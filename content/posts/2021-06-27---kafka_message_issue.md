---
title: Kafka 메시지 처리 중복 or 누락 문제
date: "2021-06-27T00:00"
template: "post"
draft: false
slug: "kafka-message-issue"
category: "Kafka"
tags:
  - "Kafka"
  - "Apache"
  - "Event"
  - "Case study"
description: "[Kafka Case Study] 3편 - Kafka 메시지가 중복 처리되거나 누락되는 문제가 발생하는 경우"
---

#### [Kafka Case Study] 3편 - Kafka 메시지가 중복 처리되거나 누락되는 문제가 발생하는 경우

_[Kafka - (7) Offset Commit](/posts/kafka-offset-commit)_ 에서 이미 카프카 메시지의 중복 처리 가능성에 대해 언급한 적 있는데 이에 대해 좀더 알아본다.

중복 처리하게 되는 케이스도, 누락 되는 케이스도 결국엔 Kafka의 오프셋 관리 컨셉이 *브로커 중심*으로 되어 있어 *consumer offset이 물리적으로 브로커*에서 관리되기 때문이다(정확히는 `__consumer_offsets`이라는 topic에서 관리).

- `컨슈머` 입장에서는 중복 처리되거나 누락될 수 있지만
- `브로커` 입장에서는 하나의 컨슈머 그룹에 대해,
  - 레코드를 보내주는(정확히는, "레코드가 컨슘된") 관점에서 적어도 한 번(중복은 있지만 누락은 없는)은 보장한다.
  - commit 관점에서는, 중복없이 각 레코드를 한 번만 다루게 되는 게 맞다.

## 중복 처리되는 케이스
*자동 커밋*(`enable.auto.commit = true`)으로 운영할 때, 예컨대 5초 주기(default)로 auto commit이 수행된다고 하면 아래와 같은 경우가 발생할 수 있다.

1. poll을 호출했을 때, 오토커밋할 때(마지막 오토커밋으로부터 5초 지남)가 된 것을 확인하여 commit이 수행됨
2. 그 다음번 poll을 호출했을 때에는 오토커밋할 때가 되지 않았고(즉, 커밋은 X) 그간 쌓인 record 5개(아래 그림에서의 offset 3~7)를 컨슈머로 가져옴
3. 컨슈머가 record 5개 중 3개번째 것까지 처리함(= 아래 그림에서의 offset 3, 4, 5 레코드는 처리를 하여 DB 등에 반영까지 완료함)
4. 특정 원인에 의해 리밸런스가 트리거 됨(기존에 연결을 맺고 있던 파티션-컨슈머 관계가 끊어지고 새로운 조합으로 관계를 맺게 됨)
    - 어떤 원인이 있을 수 있는지는 따로 다룬다.
5. 그 리밸런스 과정 이후, 가장 최근 commit이 된 offset(위 1번 과정 당시의 offset. 즉, 아래 그림에서의 offset 2)을 기준으로 그 다음번 offset(아래 그림에서의 offset 3)부터 컨슈머가 컨슘을 재개함
6. 위 3번 과정에서 이미 처리했던 3개의 레코드는 commit관점에서는 아직 미처리된 것처럼 인지되기 때문에 중복 컨슘 발생

![kafka consume twice](/media/kafka_consume_twice.png)  

*수동 커밋*의 경우도 중복 처리가 발생할 수 있다.

수동 커밋은 데이터 처리가 끝난 후에 명시적으로 commit을 수행해주게 되는데, 데이터가 처리되고 commit을 하기 전까지의 기간동안 리밸런스가 일어나게 된다면 이 또한 위 자동 커밋에서의 사례처럼 이미 컨슘하여 처리가 완료된 레코드임에도 불구하고 다시 컨슘하여 중복 처리를 하게 된다.


## 누락되는 케이스
*자동 커밋*(`enable.auto.commit = true`)으로 운영할 때, 예컨대 5초 주기(default)로 auto commit이 수행된다고 하면 아래와 같은 경우가 발생할 수 있다.

1. poll을 호출했을 때, 그간 쌓인 record 6개(아래 그림에서의 offset 0~5)를 컨슈머로 가져오면서 오토커밋할 때가 된 것을 확인하여 commit이 수행됨
2. 컨슈머가 record 6개 중 3개번째 것까지 처리함(= 아래 그림에서의 offset 0, 1, 2 레코드는 처리를 하여 DB 등에 반영까지 완료했지만 3, 4, 5 레코드는 처리하지 않은 상태)
3. 특정 원인에 의해 리밸런스가 트리거 됨(기존에 연결을 맺고 있던 파티션-컨슈머 관계가 끊어지고 새로운 조합으로 관계를 맺게 됨)
    - 어떤 원인이 있을 수 있는지는 따로 다룬다.
4. 그 리밸런스 과정 이후, 가장 최근 commit이 된 offset(위 1번 과정 당시의 offset. 즉, 아래 그림에서의 offset 5)을 기준으로 그 다음번 offset(아래 그림에서의 offset 6)부터 컨슈머가 컨슘을 재개함
5. 위 2번 과정에서 이미 처리했던 3개의 레코드는 commit관점에서는 이미 처리된 것처럼 인지되기 때문에 컨슘 누락 발생

![kafka consume lost](/media/kafka_consume_lost.png)

## [참고] 리밸런스가 발생하는 요인
- _[Kafka - (6) Offset과 Consumer Group, 그리고 Lag](/posts/kafka-offset)_ 에 기록되어 있으므로 생략한다.  
  
  
> [참고자료]  
> https://saramin.github.io/2019-09-17-kafka/  
> https://ichi.pro/ko/kafka-eseo-jungbog-mesiji-mich-mesiji-sunseoleul-cheolihaneun-bangbeob-143911451893797  
  
---

#### 이전 글
[[Kafka Case Study] 2편 - Consumer에서의 데이터 처리중 Exception이 발생한다면?](/posts/kafka-consumer-exception)
