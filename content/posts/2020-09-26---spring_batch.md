---
title: 스프링 배치(Spring Batch)
date: "2020-09-26T21:04"
template: "post"
draft: false
slug: "type"
category: "Spring"
tags:
  - "Spring"
  - "Batch"
  - "Java"
description: "배치는 '일괄 처리'라고 해석할 수 있으며, 실시간으로 요청에 의해서 처리되는 방식이 아닌 일괄적으로 한꺼번에 대량의 프로세스를 처리하는 방식이다. 스프링 배치는 이를 쉽게 할 수 있게 해준다."
---

# Batch란?
`일괄 처리`라고 해석할 수 있으며, 실시간으로 요청에 의해서 처리되는 방식이 아닌 일괄적으로 한꺼번에 대량의 프로세스를 처리하는 방식이다.
- 대량의 데이터를 처리하고자 할 때
- 특정 시간에 프로그램을 실행하고자 할 때 (참고: 스케줄링 자체는 Spring Batch에 포함되지 않으니 따로 방법을 마련해야한다.)
- 일괄적으로 처리할 때

# Spring Batch 개발 시 원칙
1. 가능하면 단순화해서 복잡한 구조와 로직을 피하자
2. 데이터를 직접 사용하는 편이 빈번하게 일어나므로 데이터 무결성을 유지하는데 유효성 검사 등의 방어책을 마련하자
3. I/O 사용을 최소화하자
    - 잦은 I/O로 데이터베이스 커넥션과 네트워크 비용이 커지면 성능에 영향을 줄 수 있기 때문
    - 따라서 가능하면 한번에 데이터를 조회하여 메모리에 저장해두고 처리하길 권장
    - 그러므로 처리 시간이 많이 걸리는 작업을 시작하기 전에 메모리 재할당에 소모되는 시간을 피하기 위해 충분한 메모리를 할당하기를 권장

# Spring Batch의 일반적인 개념도
![spring batch scenario](/media/spring-batch-scenario.jpeg)
1. 읽기(read) : 데이터 저장소(일반적으로 데이터베이스)에서 특정 데이터 레코드를 읽는다.
2. 처리(processing) : 원하는 방식으로 데이터 가공/처리 한다.
3. 쓰기(write) : 수정된 데이터를 다시 저장소(데이터베이스)에 저장한다.

Chunk-oriented processing이라면 `ItemReader+ItemProcessor+ItemWriter`처럼 구분되어 chunk단위로 수행될 것이고, 단순한 역할의 배치의 경우 Tasklet으로 한번에 작성되어 수행될 수도 있다.

#### [참고] Chunk-oriented processing
일반적으로 대용량 데이터를 처리하는 배치 프로세스의 특성상 대상 데이터들을 하나의 트랜잭션으로 처리하기에는 어려움이 있기때문에 대상 데이터를 임의의 Chunk 단위로 트랜잭션 동작을 수행하는 것

# 객체 관계도 및 용어 설명
`Job`과 `Step`은 1:M 관계이고 `Step`과 `ItemReader+ItemProcessor+ItemWriter`은 1:1 관계이다.
하나의 큰 일감(`Job`)에 여러 단계(`Step`)을 두는 거라고 이해하면 된다.

![Batch object relationship](/media/batch-object-relationship.png)

#### Job
- 배치 처리 과정을 하나의 단위로 만들어 표현한 객체이고 여러 Step 인스턴스를 포함하는 컨테이너. 한 번에 실행되기를 의도하는 작업의 집합이다.

#### JobRunner
- 외부 요청에 의해 작업 실행을 담당한다.
- `JobLauncher`의 인스턴스화를 수행한다.

#### JobRepository
- 배치 처리 과정 중 프레임워크에서 사용하는 메타데이터 정보를 가지고 있다.

#### JobLauncher
- 작업의 시작과 실제 실행을 관리한다. `JobRunner`에 의해 인스턴스화되고, `JobParameters`와 함께 배치를 실행하는 주체이다.

#### JobParameters
- 배치 Job이 실행될 때 필요한 파라미터 셋을 가지고 있다.
- `JobParameters`는 `@Value` 어노테이션을 이용하여 사용 가능하다.
- 스프링 배치에서 `JobParameters`를 정상적으로 사용하기 위해서 `JobScope`나 StepScope annotation을 함께 사용해줘야만 한다.
  * 스프링에서 일반적으로 Bean은 싱글톤인데, 위 어노테이션들을 사용하면 Job 또는 Step의 **실행시점**에 Bean으로 등록된다.
  * 즉, Bean의 생성 시점을, 지정된 Scope가 실행되는 시점으로 지연(Late Binding)시킨다는 뜻이다.
- `JobParameters`로 사용 가능한 데이터 타입으로는 4가지가 있다. `Long`, `Double`, `Date`, `String`이다.

#### JobInstance
- 작업의 독립된 실행 단위이다.
- 만약 하루에 한 번 씩 배치의 Job이 실행된다면 어제와 오늘 실행된 각각의 Job을 `JobInstance`라고 부를 수 있다. 즉, `Job`과 `JobInstance`는 **1:M** 관계이다.
- 하나의 `JobInstance`는 고유한 `JobParameter`를 갖는다.

#### JobExecution
- 작업의 독립된 실행 단위인 `JobInstance`에 대한 한번의 실행 시도이다.
- Job이 재시작된 경우 하나의 `JobInstance`는 여러개의 `JobExecution`을 가질 수 있다.
- 예컨대 오늘 Job 실행이 실패(즉, `JobInstance`가 끝나지 않은 것으로 간주됨)하여 다음날 재시도 되었다면, 동일한 `JobInstance`를 가지고 또 실행하게 되고 `JobExecution`은 2개가 된다.

#### Step
- 실직적인 배치 처리를 정의하고 제어 하는데 필요한 모든 정보가 있는 도메인 객체

#### StepExecution
- `JobExecution` 개념과 마찬가지로, Job이 갖고 있던 하나의 Step에 대한 한 번의 실행 시도를 의미한다.

#### ItemReader+ItemProcessor+ItemWriter
청크 지향 프로세싱으로 DB에서 읽어와서 데이터를 가공한 후 DB에 저장한다고 할 때,
- `ItemReader`: DB에서 읽어오는 역할
- `ItemProcessor`: 읽어온 데이터를 가공/처리하는 역할. 필수는 아니다.(간단한 가공은 writer에서 하기도 한다.)
  * 참고로 `ItemReader` 또는 `ItemWriter`는 각각 인풋/아웃풋에 해당하는 타입만 있으면 되지만 `ItemProcessor`는 인풋/아웃풋 모두의 타입이 필요하다보니 generic으로 2개의 타입을 명시하게 된다.
- `ItemWriter`: DB에 저장하는 역할

와 같이 각 역할을 분리한다.

#### Tasklet
- Step내에서 수행될 개별 배치 task. `ItemReader`/`ItemProcessor`/`ItemWriter`로 구분하지 않고 하나로 퉁쳐도 무방할 때 쓴다.(즉, 청크 지향 프로세싱에 해당하지 않음)

# 예제 코드로 보는 사용법
### build.gradle의 dependencies
디펜던시를 추가해야한다.

```gradle
implementation 'org.springframework.boot:spring-boot-starter-batch'
testImplementation 'org.springframework.batch:spring-batch-test'
```

### Application.java
`@EnableBatchProcessing` 어노테이션을 붙여준다.

```java
@EnableBatchProcessing  // 배치 기능 활성화
@SpringBootApplication
public class BatchApplication {
    public static void main(String[] args) {
        SpringApplication.run(BatchApplication.class, args);
    }
}
```

### Tasklet 작성
Tasklet 인터페이스를 구현하여 작성할 수 있으며, 그중 execute 메서드를 override하여 그 안에 비즈니스 로직을 넣을 수 있다.

```java
public class TempTasklet implements Tasklet {
    @Override
    public RepeatStatus execute(StepContribution contribution, ChunkContext chunkContext) throws Exception {
        log.debug("tasklet이 실행되면서 debug 로그를 찍었다!"); // 비즈니스 로직 들어갈 부분
        return RepeatStatus.FINISHED;
    }
}
```

### Job 및 Step 등록
`JobBuilderFactory`는 job을 만들어주고, `StepBuilderFactory`는 step을 만들어주는 역할을 한다. `StepBuilderFactory`가 step을 만들기 위해 tasklet(또는 ItemReader+ItemProcessor+ItemWriter)을 주입하고, `JobBuilderFactory`가 job을 만들기 위해 그 step을 주입한다.

```java
@Configuration
@RequiredArgsConstructor
public class BatchConfig {

    private final JobBuilderFactory jobBuilderFactory; // Job 빌더 생성용
    private final StepBuilderFactory stepBuilderFactory; // Step 빌더 생성용

    // JobBuilderFactory를 통해서 tempJob을 생성
    @Bean
    public Job tempJob() {
        return jobBuilderFactory.get("tempJob")
                .start(tempStepFirst())  // Step 설정
                .next(tempStepSecond()) // 만약 tempStepSecond가 없다면 이 next 줄 자체를 빼도 됨
                .build();
    }

    // StepBuilderFactory를 통해서 tempStep을 생성
    @Bean
    public Step tempStepFirst() {
        return stepBuilderFactory.get("tempStepFirst")
                .tasklet(new TempTasklet()) // Tasklet 설정
                .build();
    }

    @Bean
    public Step tempStepSecond() {
        return stepBuilderFactory.get("tempStepSecond")
                .chunk(10) // 청크 단위당 개수
                .reader(new TempItemReader()) // Reader 설정
                .processor(new TempItemProcessor()) // Processor 설정
                .writer(new TempItemWriter()) // Writer 설정
                .build();
    }
}
```

### 배치 스케줄링 방법
단순히 스케줄링 방법중 하나로 칠 정도가 아니라 각각 또 한참의 학습이 필요해서 여기선 생략한다.
- Airflow
- Jenkins
- ...

---

> [참고자료]  
> https://medium.com/myrealtrip-product/spring-batch-%EC%B2%98%EC%9D%8C%EB%B6%80%ED%84%B0-%EC%8B%9C%EC%9E%91%ED%95%98%EA%B8%B0-3c6a5db0646d  
> https://cheese10yun.github.io/spring-batch-basic/  
> https://deeplify.dev/back-end/spring/batch-tutorial  
> https://deeplify.dev/back-end/spring/batch-architecture-and-components  
> https://jojoldu.tistory.com/330  
> https://sejoung.github.io/2018/07/2018-07-09-Chunk_and_Tasklet/  
