---
title: DLQs(Dead Letter Queues)
date: "2021-06-20T00:00"
template: "post"
draft: false
slug: "kafka-consumer-exception"
category: "Kafka"
tags:
  - "Kafka"
  - "Apache"
  - "Event"
  - "Case study"
description: "[Kafka Case Study] 2편 - Consumer에서의 데이터 처리중 Exception이 발생한다면?"
---

#### [Kafka Case Study] 2편 - Consumer에서의 데이터 처리중 Exception이 발생한다면?

한 Consumer를 개발해서 배포했다고 가정하자. 그런데 그 컨슈머의 비즈니스 로직에 결함이 있는 등의 이유로, 계속해서 Runtime Exception이 발생한다면? 물론 비즈니스 로직의 결함을 해결해서 배포하면 대부분 해결되겠지만, 그 해결과정까지 시간이 소요되고 그동안 서비스 장애가 발생할 수 있다. 이를 막기 위해 미리 방어 로직을 심어둘 수 있다.

> 한 메시지 처리만 계속 실패하게 되어도, 다음 메시지를 처리하지 못 하게 되는 FIFO이기 때문이다.

## 컨슈머에서 데이터 처리 시 Exception이 발생하는 사례들
- 메시지를 deserialize 할 수 없는 경우
- 잘못된 메시지가 들어온 경우(데이터의 형식이 안 맞는다든지, 허용 범위에서 벗어나 valid하지 않은 값이 들어온다는지)
- 컨슈머의 비즈니스 로직을 잘못 짠 경우
- 컨슈머에 연결되어있는 API나 DB 등이 일시적으로 다운된 경우

위와 같이 예외가 발생하는 사례들의 일부는 일시적인 문제라 얼마 후 retry하면 성공할 수도 있고, 또 다른 일부는 retry를 아무리 반복해도 절대 성공할 수 없는 dead letter인 경우도 있다(보통 컨슈머는 멱등성이 보장되도록 짜다보니 그러하다.). 따라서 컨슈머에서 예외가 발생하면 retry를 시도하고 이후에 DLQ까지 이어지도록 대비하는 게 좋다.

## Retry
_`spring-kafka`를 기준으로 Retry하는 방법에 대해 알아보자._

`@KafkaListener` annotation과 함께 카프카 리스너를 사용할 때 보통 Kafka 설정 파일 내에서, `KafkaListenerContainerFactory` bean에 이런저런 설정을 등록하게 되는데, Retry에 대한 설정도 여기서 이루어진다. 관련 인스턴스가 생성되는 순서대로 살펴보자.

#### 1. RetryPolicy 객체를 만든다. 그 안에서 Retry에 대한 정책을 입력한다.
- 최대 몇번 Retry를 할 것인지
- 어떤 exception들에 대해 Retry를 하게 하고, 안하게 할 것인지
- 어느 정도의 delay time 이후 Retry를 할 것인지 등...

```java
private SimpleRetryPolicy getSimpleRetryPolicy() {
    Map<Class<? extends Throwable>, Boolean> exceptionMap = new HashMap<>();
    /* Retry 정책 예시 */
    exceptionMap.put(IllegalArgumentException.class, false); // IllegalArgumentException은 retry하지 않겠다는 뜻
    exceptionMap.put(TimeoutException.class, true); // TimeoutException은 retry하겠다는 뜻
    return new SimpleRetryPolicy(3,exceptionMap,true);
}
```

#### 2. RetryTemplate 객체를 만들어서 해당 RetryPolicy를 설정한다.
```java
private RetryTemplate retryTemplate() {
    RetryTemplate retryTemplate = new RetryTemplate();
    retryTemplate.setRetryPolicy(getSimpleRetryPolicy()); // RetryPolicy를 설정한다!
    return retryTemplate;
}
```

#### 3. KafkaListenerContainerFactory 객체를 만들어서 그 RetryTemplate 객체를 설정해준다.
```java
@Bean
public ConcurrentKafkaListenerContainerFactory<?, ?> kafkaListenerContainerFactory(
    ConcurrentKafkaListenerContainerFactoryConfigurer configurer,
    ObjectProvider<ConsumerFactory<Object, Object>> kafkaConsumerFactory
  ) {
    ConcurrentKafkaListenerContainerFactory<Object, Object> factory = new ConcurrentKafkaListenerContainerFactory<>();
    configurer.configure(factory, kafkaConsumerFactory);
    factory.setRetryTemplate(retryTemplate()); // Retry를 위한 설정이 되어있는 RetryTemplate을, 이렇게 추가한다!
    return factory;
}
```

## Recover
Max 횟수 만큼의 Retry를 이미 했음에도 성공하지 못했을 때에 그 context를 받아서 개발자가 직접 핸들링해줄 수도 있다. RecoveryCallback을 설정해주는 방식, 즉 KafkaListenerContainerFactory에 Recover를 위한 콜백함수를 set해주는 방식이다. Recover가 실행되어야 할 때 context가 인자로 넘어 오므로, 그 context의 정보에 따라 분기를 쳐서 원하는 로직에 태울 수 있다.

```java
@Bean
public ConcurrentKafkaListenerContainerFactory<?, ?> kafkaListenerContainerFactory(
    ConcurrentKafkaListenerContainerFactoryConfigurer configurer,
    ObjectProvider<ConsumerFactory<Object, Object>> kafkaConsumerFactory
  ) {
    ConcurrentKafkaListenerContainerFactory<Object, Object> factory = new ConcurrentKafkaListenerContainerFactory<>();
    configurer.configure(factory, kafkaConsumerFactory);
    factory.setRetryTemplate(retryTemplate());
    factory.setRecoveryCallback((context -> {
        if(context.getLastThrowable().getCause() instanceof RecoverableDataAccessException){
            // Recoverable하다고 판단된 Exception의 경우, 카프카 프로듀서를 사용하여 토픽으로 메시지를 발행하는 등의 조치를 여기서 취해줄 수 있다.

            /* 예시 */
            ConsumerRecord record = (ConsumerRecord) context.getAttribute("record");
            String topic = "dlt_" + record.topic();
            String value = record.value().toString();
            kafkaProducerTemplate.send(topic, value);
        } else{
            // Recoverable하지 않은 경우 로깅을 하거나 원하는 커스텀 Exception을 던져주는 등 에러 핸들링을 할 수 있다.

            /* 예시 */
            throw new RuntimeException(context.getLastThrowable().getMessage());
        }
        return null;
    }));
    return factory;
}
```


## DLQs(Dead Letter Queues)
_`spring-kafka`를 기준으로 DLQ(Kafka에서는 DLT)를 만드는 방법에 대해 알아보자._

#### [참고] DLT란?
> 일반적으로는 DLQ(Dead Letter Queue)라고 불리는 개념으로, 제대로 처리되지 않은 메시지를 모으는 Queue이다. Kafka에서는 Topic이라는 개념을 쓰다보니, 마찬가지로 DLT(Dead Letter Topic)라는 표현을 쓴다.

앞서 언급한 Recover 과정에서 DLT로 메시지를 Produce해줘도 되지만, `spring-kafka`는 DLT를 이미 구현해 놓아서 편리하게 사용할 수도 있다. 아래와 같이, `DeadLetterPublishingRecoverer`를 사용하면 되며, 이에 따라 `{원본 토픽명}.DLT`라는 이름의 토픽이 자동 생성되어 실패한 메시지가 여기로 보내진다. 이 자동 생성된 토픽의 특징은, 원본 토픽과 동일한 파티션으로 보내진다는 것이다. 따라서 DLT 토픽의 파티션은 원본 토픽의 파티션보다 작아선 안된다.

```java
@Bean
public ConcurrentKafkaListenerContainerFactory<?, ?> kafkaListenerContainerFactory(
    ConcurrentKafkaListenerContainerFactoryConfigurer configurer,
    ObjectProvider<ConsumerFactory<Object, Object>> kafkaConsumerFactory,
    KafkaTemplate<Object, Object> kafkaProducerTemplate
  ) {
	ConcurrentKafkaListenerContainerFactory<Object, Object> factory = new ConcurrentKafkaListenerContainerFactory<>();
	configurer.configure(factory, kafkaConsumerFactory);
	factory.setErrorHandler(new SeekToCurrentErrorHandler(
			new DeadLetterPublishingRecoverer(kafkaProducerTemplate), 3)); // 3번 Retry 후 실패하면 DLT로 보내겠다는 뜻
	return factory;
}
```

Dead Letter 토픽에 메시지를 보낼 때에는 아래 헤더가 추가되어 보내진다.

- `KafkaHeaders.DLT_EXCEPTION_FQCN`: The Exception class name
- `KafkaHeaders.DLT_EXCEPTION_STACKTRACE`: The Exception stack trace
- `KafkaHeaders.DLT_EXCEPTION_MESSAGE`: The Exception message
- `KafkaHeaders.DLT_ORIGINAL_TOPIC`: The original topic
- `KafkaHeaders.DLT_ORIGINAL_PARTITION`: The original partition
- `KafkaHeaders.DLT_ORIGINAL_OFFSET`: The original offset
- `KafkaHeaders.DLT_ORIGINAL_TIMESTAMP`: The original timestamp
- `KafkaHeaders.DLT_ORIGINAL_TIMESTAMP_TYPE`: The original timestamp type

DLT에 모인 이른바 dead letter들은 어드민에서 관리자가 별도로 처리해준다든지, 개발자가 로그를 확인해서 비즈니스 로직을 보완한다든지 하면 되겠다.  

> [참고자료]  
> https://medium.com/@sannidhi.s.t/dead-letter-queues-dlqs-in-kafka-afb4b6835309  
> https://gunju-ko.github.io/kafka/2020/06/17/Dead-Letter-Queue.html  
> https://blogs.perficient.com/2021/02/15/kafka-consumer-error-handling-retry-and-recovery/  

---

#### 이전 글
[[Kafka Case Study] 1편 - Consumer 비즈니스 로직을 변경하기로 한 등등의 사유로, 예전 레코드부터 다시 가져와야 한다면?](/posts/kafka-offset-reset)
