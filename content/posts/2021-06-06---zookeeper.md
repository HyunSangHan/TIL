---
title: ZooKeeper란?
date: "2021-06-06T00:00"
template: "post"
draft: false
slug: "what-is-zookeeper"
category: "Kafka"
tags:
  - "Zookeeper"
  - "Kafka"
  - "Apache"
description: "분산 코디네이션 서비스를 제공하는 오픈소스 프로젝트이다."
---

## 주키퍼(ZooKeeper)란?
- 분산 코디네이션 서비스를 제공하는 오픈소스 프로젝트이다.
- 카프카의 여러 서버들의 역할과 상태를 주키퍼에 기록하여 관리한다.
- 주키퍼는 [[Kafka - (3) 관련 인프라]](/posts/kafka-infra)에서 한차례 언급한 적이 있는데 이에 대해 조금 더 알아보기로 한다.

## 분산 시스템에서의 고민거리
- 분산된 시스템 간의 정보를 어떻게 공유할 것인가?
- 클러스터에 있는 서버들의 상태를 어떻게 체크할 것인가?
- 분산된 서버들 간에 동기화를 위해 잠금(Lock)을 어떻게 처리할 것인가?

## 코디네이션 서비스 시스템
- 분산 환경에서, 노드 간 조정자 역할
- 노드 간 정보 공유, 잠금, 이벤트 등의 기능을 수행
- 여러 개의 노드에 작업을 분산시켜주는 부하 분산 기능 제공
- 서버에서 처리된 결과를 다른 서버에게 동기화할 때 잠금(Lock) 처리 수행
- 서버 장애 시 대기 서버가 기존 서버를 대신 처리할 수 있도록 장애 상황 판단 및 복구 기능

## 코디네이션 서비스 시스템의 조건
- 데이터 액세스가 빨라야 함
  - 주키퍼는 관리 데이터를 메모리상에 유지함
- 자체적으로 장애에 대한 대응성을 가져야 함
  - 주키퍼는 자체적으로 클러스터링을 제공함
  - 장애에도 데이터 유실 없이 Fail Over / Fail Back이 가능

## 주키퍼의 아키텍처
- 디렉토리 구조 기반의 데이터 저장소
- znode라는 데이터 저장 객체를 제공함(key-value 방식)
  - 객체에 데이터(상태 정보, 구성 정보, 위치 정보 등)를 넣고 빼는 기능을 제공함
- 데이터를 계층화된 구조로 저장하기 용이함

### 노드의 종류
#### Persistent Node
- 노드에 데이터를 저장하면 삭제하지 않는 이상 영구히 저장되는 노드
- 트랜잭션 로그, 스냅샷, 상태 이미지 등을 유지함

#### Ephemeral Node
- 노드를 생성한 클라이언트의 세션이 연결되어있을 경우에만 유효하며, 연결이 끊어지는 순간 삭제됨
- 이를 통해서 클라이언트가 연결이 되어 있는지 아닌지 판단함

#### Sequence Node
- 노드를 생성할 때 자동으로 일련번호가 붙는 노드
- 주로 분산 Lock을 구현하는데 사용

### Watch 기능
1. 주키퍼 클라이언트가 특정 znode에 watch를 걸어 놓을 수 있음
2. 그러면 해당 znode가 변경되었을 때 클라이언트로 callback 호출을 날림으로써 클라이언트에 해당 znode가 변경되었음을 알려줌

### 복제 기능
- 클러스터 내에서 서버들 모두 데이터가 복제(Replication)됨. 리더에서 팔로워로.
- 접속이 되었을 때 Ephemeral Node가 만들어지고, 그 노드가 watch가 되고... 하는 흐름
  1. 클라이언트가 주키퍼 서버에 연결
  2. 요청, 응답, watch 이벤트, heart beats 등을 주고 받음
  3. TCP 연결을 유지하며, 연결이 끊어지면 타 서버에 연결

## 주키퍼 활용 분야
### 클러스터 정보
- 클러스터에서 기동 중인 서버 목록을 유지할 수 있음
- Ephemeral Node는 주키퍼 클라이언트가 살아있을 경우에만 유효함
- 해당 서버가 죽으면 Ephemeral Node가 삭제되기 때문에 클러스터 내의 살아있는 Node 리스트만 유지할 수 있음

### 서버 정보
- 클러스터 내의 각 서버들의 설정 정보를 저장하는 저장소로 사용 가능
- Watch 기능 사용 시, (콜백을 통해) 설정 정보가 저장 혹은 변경될 경우 각 서버에서 바로 반영할 수 있게 함

### 글로벌 잠금
- 여러 개의 서버로 구성된 분산 서버에서, 공유 자원을 접근하려고 했을 때 동시에 하나의 작업만 발생해야 한다고 할 때 그 작업에 잠금을 걸고 작업을 할 수 있는 기능을 구현할 때 사용함

## 카프카와 주키퍼
- 카프카 브로커를 띄울 때 주키퍼 지정해주게 되는데, 이 때 `zookeeper.connect`라는 옵션에 `주키퍼 노드 목록/znode` 형태로 넣게 된다.
- 즉, 이런 식으로 여러 개 브로커를 띄울 때 하나의 znode를 지정하면 그 브로커들끼리 주키퍼에 의해 함께 관리되게 된다.

---

> [참고자료]  
> 구자환 교수님 강의 - https://youtu.be/Avh6AhX_inM  
> 구자환 교수님 강의 - https://youtu.be/6n908UiJYUQ  
> https://level-muscle-c3a.notion.site/Kafka-665a8d1344c6496a8cd9770365708c17  