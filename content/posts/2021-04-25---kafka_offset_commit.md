---
title: Kafka - (7) Offset Commit
date: "2021-04-25T00:00"
template: "post"
draft: false
slug: "kafka-offset-commit"
category: "Kafka"
tags:
  - "Kafka"
  - "Apache"
description: "자동 커밋과 수동 커밋으로 나뉘고, 수동 커밋은 동기 커밋과 비동기 커밋으로 나뉜다. 각각 상황과 용도에 맞도록 적절하게 활용해야 성능과 가용성 차원에서 이슈가 없다."
---

## 자동 커밋(Auto commit)
- 컨슈머 오프셋 관리를 사용자가 직접할 필요 없는 경우 자동으로 커밋을 해주는 설정이다.
- 로그성 데이터 등, 비교적 컨슘 후의 비즈니스 로직이 복잡하지 않은 경우에는 쓰기에 좋다. 
- `enable.auto.commit=true` 옵션으로 auto commit을 활성화 한다.
- `auto.commit.interval.ms` 옵션으로 오토커밋의 주기를 설정한다.(* poll 주기와 동일한 건 아니다.)
- 오토커밋은 데이터 중복이나 유실을 유발할 수 있으니 주의한다.
  - [수정] 이에 대해서는 _[[Kafka Case Study] 3편 - Kafka 메시지가 중복 처리되거나 누락되는 문제가 발생하는 경우](/posts/kafka-message-issue)_ 에서 별도로 다루었다.
- 데이터 처리가 끝날 때 commit을 하는 수동 커밋과 달리, 폴링 주기에 맞춰 커밋할 시간이 되었는지 확인하여 시간이 되었으면 커밋을 수행한다. 즉, 작업 단위가 아니라 시간 단위로 커밋이 되는 게 특징이다.

## 수동 커밋
- 메시지 처리가 완전히 완료되기 전까지 메시지를 가져온 것으로 간주하면 안되는 경우 사용한다.
- 물론 메시지(데이터) 처리 과정의 비즈니스 로직이 길고 복잡한 경우, 그 처리 로직에서 실패가 발생했을 때 retry 과정에서 중복처리가 발생할 수는 있다. 이 경우 이 offset은 영원히 commit되지 못하기 때문에 다음 메시지를 가져오지 못하고 막히는 문제가 생긴다. 
  - 컨슈머의 로직을 단순화 하면 이런 문제를 줄일 수 있겠다.
  - 영원히 처리할 수 없는 메시지는 다른 토픽으로 보내는 등 DLQ 등을 고려하여 설계하는 게 좋겠다.
    - [수정] 이에 대해서는 _[[Kafka Case Study] 2편 - Consumer에서의 데이터 처리중 Exception이 발생한다면?](/posts/kafka-consumer-exception)_ 에서 별도로 다루었다.
- 즉, 자동 커밋이든 수동 커밋이든 컨슈머는 동일 메시지를 수신할 가능성도 있고 retry가 있을 수 있으므로 멱등성을 고려하는 것이 좋다.

#### (1) 동기 커밋
- 명시적으로 오프셋을 커밋하는 방법 중 하나로, 동기 커밋은 브로커에 커밋 요청을 하고 커밋이 정상적으로 처리되었는지 응답을 기다린다.
- 데이터 처리에 실패하면 Exception을 던진다.

#### (2) 비동기 커밋
- 명시적으로 오프셋을 커밋하는 방법 중 하나로, 비동기 커밋은 동기 커밋과 다르게, 브로커에 커밋 요청 후 기다리지 않고 다른 데이터 처리를 수행한다.
- 코드 자체에서 바로 실패 여부를 알 수 없고, 콜백을 받아야 데이터 처리 실패 여부를 알 수 있다.


> [참고자료]  
> 고승범 외(2018), _카프카: 데이터 플랫폼의 최강자_, 책만.  
> https://jyeonth.tistory.com/30  

---

#### 이전 글
[(6) Offset과 Consumer Group, 그리고 Lag](/posts/kafka-offset)

#### 다음 글
[(8) 응용 기술](/posts/kafka-applied-technology)
