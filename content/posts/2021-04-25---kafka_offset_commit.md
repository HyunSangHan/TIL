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
- `auto.commit.interval.ms` 옵션으로 오토커밋의 주기를 설정한다.
- 오토커밋은 데이터 중복이나 유실을 유발할 수 있으니 주의한다.

## 수동 커밋 - (1) 동기 커밋
- 명시적으로 오프셋을 커밋하는 방법 중 하나로, 동기 커밋은 브로커에 커밋 요청을 하고 커밋이 정상적으로 처리되었는지 응답을 기다린다.
- 데이터 처리에 실패하면 Exception을 던진다.

## 수동 커밋 - (2) 비동기 커밋
- 명시적으로 오프셋을 커밋하는 방법 중 하나로, 비동기 커밋은 동기 커밋과 다르게, 브로커에 커밋 요청 후 기다리지 않고 다른 데이터 처리를 수행한다.
- 콜백을 받아야 데이터 처리 실패 여부를 알 수 있다.

---

> [참고자료]
> 고승범 외(2018), _카프카: 데이터 플랫폼의 최강자_, 책만.  

---

#### 이전 글
[(6) Offset과 Consumer Group, 그리고 Lag](https://tillog.netlify.app/posts/kafka-offset)

#### 다음 글
[(8) 응용 기술](https://tillog.netlify.app/posts/kafka-applied-technology)
