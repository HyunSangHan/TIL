---
title: Kafka - (6) Offset과 Consumer Group, 그리고 Lag
date: "2021-03-01T00:00"
template: "post"
draft: false
slug: "kafka-offset"
category: "Kafka"
tags:
  - "Kafka"
  - "Apache"
description: "각 파티션마다 메시지가 저장되는 위치를 오프셋이라고 한다. 컨슈머 그룹 단위로 이 오프셋으로 줄세워진 레코드를 순차적으로 컨슘하게 되며, 컨슈머가 얼마나 더 컨슘할 게 남았는지가 Lag이다."
---

## Offset이란?
- 각 파티션마다 메시지가 저장되는 위치를 오프셋이라고 한다. 그 위치는 해당 파티션 내에서 유니크하고 순차적인 숫자 형태로 표시된다.(토픽 기준으로는 유니크하지 않다. 파티션이 여러 개이기 때문)
- 이 오프셋을 이용해 메시지의 순서가 보장되며, 절대 오프셋 순서가 바뀐 상태로 컨슈머가 데이터를 가져갈 수는 없다.
  * 단, 토픽은 여러 파티션으로 이루어져있기 때문에 토픽 차원에서는 기본적으로 메시지 순서가 보장되지 않는다.

## Consumer Group이란?
- 여러 컨슈머를 하나의 그룹으로 묶어서 group을 지정할 수 있는데, 이렇게 그룹으로 묶인 컨슈머끼리는 동일한 데이터를 중복으로 컨슘하지 않도록 설게되어있다.
  * 즉, 서로 다른 그룹의 컨슈머라면 동일한 데이터를 각각 컨슘하게 될 수 있다.
  * [응용] 만일 여러 애플리케이션을 운영한다고 가정할 때, 각 애플리케이션에서 하나 이상의 토픽에 저장된 모든 메시지를 읽어야 할 때는 애플리케이션마다 컨슈머 그룹을 지정해주면 되겠다.
- 리밸런싱: 한 컨슈머로부터 다른 컨슈머로 파티션 소유권을 이전하는 것을 의미한다. 컨슈머가 늘어나거나 컨슈머가 줄어드는 등 변화가 생길 때 group coordinator가 그걸 감지하여 리밸런싱한다. 리밸런싱이 자주 일어나면 성능상 이슈가 발생한다. 그 과정에서 컨슈머들이 토픽의 데이터를 읽지 못하기 때문이다.

## Lag이란?
아래 명령어를 실행하면 각 컨슈머그룹의 파티션별 lag을 확인 가능하다.

```sh
kafka-consumer-groups --bootstrap-server <host:port> --group <group.id> --describe
```

실행 결과:

```
TOPIC         PARTITION  CURRENT-OFFSET  LOG-END-OFFSET  LAG             CONSUMER-ID                                      HOST            CLIENT-ID
example.topic 0          6392623366      6392623859      493             consumer-1-f6f6ffb0-1054-46b9-af13-0b254bc14da0  /10.64.69.95    consumer-1
example.topic 1          6394637143      6394637383      240             consumer-10-6c57b320-7742-4418-8e15-b7d735da346e /10.64.69.95    consumer-2
example.topic 2          6397170269      6397170495      226             consumer-19-dbed41a1-42bb-4ecb-bc8f-84e47c74dbe8 /10.64.69.95    consumer-3
example.topic 3          6397170269      6397170495      226             consumer-19-dbed41a1-42bb-4ecb-bc8f-84e47c74dbe8 /10.64.69.95    consumer-4
```

- Current offset이란, 각 _Consumer Group_ 에서 각 파티션의 어느 오프셋까지 컨슘했는지를 나타내는(정확히는, 어느 오프셋까지 commit했는지를 나타내는) 값이다.
  * [참고] Kafka 클러스터의 Internal topic인 `__consumer_offsets`를 통해 관리하며, consumer에서 commit이 일어나면 변경된다.
- Log end offset이란, 각 파티션의 실제 마지막 offset 값이다.
- Lag이란, 이 두 값의 차이이다. Lag이 늘어난다면 메시지의 생산 속도를 컨슘 속도가 못따라가고 있다는 의미다. 


---

#### 이전 글
[(5) Replication과 ISR](https://tillog.netlify.app/posts/kafka-replication-isr)

#### 다음 글
[(7) Offset Commit](https://tillog.netlify.app/posts/kafka-offset-commit)

---

> [참고자료]
> 고승범 외(2018). 카프카, 데이터 플랫폼의 최강자. 책만.  
> https://steemit.com/kr/@yjiq150/kafka-consumer-offset-reset  
  