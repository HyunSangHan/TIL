---
title: Kafka - (5) Replication과 ISR
date: "2021-02-28T00:00"
template: "post"
draft: false
slug: "kafka-replication-isr"
category: "Kafka"
tags:
  - "Kafka"
  - "Apache"
description: "고가용성을 위해 파티션을 복제해두는 걸 리플리케이션이라고 하며, 그로 인해 리더(원본) 파티션과 팔로워(복제본) 파티션이 나뉜다. 리더와 싱크가 맞는 리플리카를 ISR이라고 하여 리더 후보로 삼는다."
---

## Replication
- 고가용성을 위해 파티션을 복제해두는 걸 의미한다.
- `리더 파티션`은 원본을 의미하며, `팔로워 파티션`은 복제본을 의미한다.
- 읽기와 쓰기는 모두 `리더 파티션`을 통해서만 이루어진다. 즉, 팔로워 파티션은 그저 보험용(?) 복제본일 뿐이다.
- Replication fator: 기본값은 1이며, 몇개의 리플리케이션을 할지를 의미하는 옵션이다. Replication fator를 곱한 만큼 저장소 크기가 더 필요하다.

## ISR
- `In-Sync Replicas`. 리더와 싱크가 완전히 맞는 리플리카 그룹이다. **리더 파티션이 될 수 있는 후보**의 의미를 가진다고 보면 된다.
- 싱크가 완전히 맞는 팔로워만 신뢰하겠다는 컨셉이다.


> [참고자료]
> 고승범 외(2018), _카프카: 데이터 플랫폼의 최강자_, 책만.  

---

#### 이전 글
[(4) Topic과 Partition](/posts/kafka-topic-partition)

#### 다음 글
[(6) Offset과 Consumer Group, 그리고 Lag](/posts/kafka-offset)
