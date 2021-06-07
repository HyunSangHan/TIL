---
title: Kafka - (3) 관련 인프라
date: "2020-12-27T00:00"
template: "post"
draft: false
slug: "kafka-infra"
category: "Kafka"
tags:
  - "Kafka"
  - "Apache"
description: "카프카의 정보를 관리해주는 Zookeeper, Avro 기반의 스키마를 관리하여 스키마를 강제해주는 Schema Registry 등이 대표적으로 카프카와 관련된 인프라이다."
---

#### Bootstrap Server
- 클라이언트가 접근하는 토픽 파티션의 메타데이터를 요청할 대상 서버
- `bootstrap.servers`는 브로커의 호스트/포트 정보의 목록이라고 보면 된다.

#### Zookeeper
-  분산 메세지 큐의 정보를 관리해 주는 역할을 한다. Kafka를 띄우기 위해서는 Zookeeper가 반드시 실행되어야 한다.
- 참고: [ZooKeeper란?](/posts/what-is-zookeeper)

#### Schema Registry
- Producer와 Consumer가 주고 받으려는 메시지의 스키마를 서로 알게 해주고 호환을 강제한다.
  * 예를 들면 Producer가 처음에 정의했던 스키마와 호환되지 않는 스키마를 보내려고 할 때 보낼 수 없게 막아준다.
- Avro를 사용하여 스키마를 정의한다.
- REST API로 스키마를 조회/생성/삭제 가능하다.

#### Kafka Manager
- 카프카 클러스터의 브로커와 토픽 목록 및 상태를 확인할 수 있는 GUI 툴이다.
- 토픽 생성, 삭제도 가능하고 ISR, Leader 확인이 가능하다.
- 컨슈머 그룹의 offset과 lag도 확인 가능하다.


> [참고자료]  
> 고승범 외(2018), _카프카: 데이터 플랫폼의 최강자_, 책만.  
> https://geonyeongkim-development.tistory.com/5  

---

#### 이전 글
[(2) Producer, Broker, Consumer](/posts/kafka-producer-broker-consumer)

#### 다음 글
[(4) Topic과 Partition](/posts/kafka-topic-partition)