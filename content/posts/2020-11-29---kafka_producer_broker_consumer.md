---
title: Kafka - (2) Producer, Broker, Consumer
date: "2020-11-29T00:00"
template: "post"
draft: false
slug: "kafka-producer-broker-consumer"
category: "Kafka"
tags:
  - "Kafka"
description: "메시지를 송신하는 역할을 하는 프로듀서, 수신하는 역할을 하는 컨슈머, 그리고 그 둘 사이의 중간 매개체 역할을 하는 브로커로 이루어져있다."
---

## Broker
- Producer와 Consumer가 각각 메시지를 주고 받을 수 있도록 **중간 매개**하는 역할
- 카프카 애플리케이션이 설치되어 있고, 메시지가 실제로 저장되고 관리되는 서버. 한마디로 카프카 서버.
- _주키퍼_ 에 의해 각 노드가 모니터링 됨
- _토픽_ 을 기준으로 메시지를 관리함

## Producer
- **메시지를 송신**하는 역할을 하는 서버 혹은 애플리케이션
- 메시지를 생산해서 _토픽_ 을 지정해 Broker에 전달한다.
- 한 토픽에 대해 여러 프로듀서가 접근 가능하다.(멀티 프로듀서)

## Consumer
- **메시지를 수신**하는 역할을 하는 서버 혹은 애플리케이션
- Broker를 polling해서 특정 _토픽_ 으로부터 메시지를 가져온다.
- 한 토픽에 대해 여러 컨슈머가 접근 가능하다.(멀티 컨슈머)

---

#### 이전 글
https://tillog.netlify.app/posts/what-is-kafka

---

> [참고자료]
> 고승범 외(2018). 카프카, 데이터 플랫폼의 최강자. 책만.  
