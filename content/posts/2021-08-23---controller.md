---
title: k8s - Controller(ReplicaSet, Deployment, DaemonSet, Job)
date: "2021-08-23T09:00"
template: "post"
draft: false
slug: "k8s-controller"
category: "k8s"
tags:
  - "kubernetes"
  - "Infra"
  - "Dev-environment"
description: "Controller는 Auto-healing, Auto-scaling, Software update, Job 등의 역할을 한다."
---

### Controller의 기능
- Auto-healing: Pod가 다운되거나 Node가 다운되면 다른 Node에 Pod를 띄워주는 기능
- Auto-scaling: 부하 분산을 위해 Pod 개수를 조절해주는 기능
- (Software) Update: 버전 업 및 롤백
- Job: 컨트롤러가 필요한 순간에만 pod를 만들어서 해당 작업을 이행하고 Pod를 삭제하는 기능(필요할 때만 리소스를 써서 효율적인 자원 활용 가능)

## (Replication Controller와) ReplicaSet
_(Replication Controller은 현재 deprecated되어 ReplicaSet으로 대체되었다.)_
참고로 아래 세 가지 기능 중 3번째의 matchExpressions는 ReplicaSet에만 있는 기능이다.

#### 1) Template
마치 Service처럼, ReplicaSet도 selector를 이용해 Pod의 label과 같은 케이스를 찾아 연결되는데, 떠있는 Pod의 수가 replicas에 설정된 파드의 수를 만족시키지 않을 때 새로 Pod를 생성하기 위한 템플릿이다.

#### 2) Replicas
Replicas만큼 Pod의 개수가 유지된다

#### 3) Selector (ReplicaSet에만 있는 기능)
- `matchLabels`라는 게 있어서, `key-value` 모두와 label인 같은 경우의 Pod만 셀렉트되는데 
- `matchExpressions`는 좀더 디테일한 조건식(`key-value` 모두가 완전히 같지 않더라도 조건에 맞으면)으로 셀렉트가 가능하다.

## Deployment
Deploy하는 역할인데 방식은 아래와 같이 나뉜다.

#### 1) ReCreate
- 먼저 Pod들을 삭제. 그다음에 새로운 Pod를 만듦.
- 일시적인 중지(Downtime)가 가능한 서비스에서만 쓰임

#### 2) Rolling Update _(default)_
- 먼저 Pod하나를 만들고, 하나를 죽이고, 그다음 하나를 만들고, 하나를 죽이고.
- 순차적으로 진행되며 중간중간 일시적으로 '일부'가 공존.
- 배포중에 추가적인 리소스가 필요하다는 단점이 있지만 Zero Downtime이라는 장점이 있다.

#### 3) Blue/Green
- `label`이 다른(ex: 기존에 v1이었다면 다음에 v2) Pod을 한벌 더 띄운다. 그다음 서비스에서 `selector`로 그 새로운 Pod들을 가리키게끔 서비스를 수정해줌으로써 트래픽을 옮긴다.
- 문제 시 롤백이 쉽고, 다운타임이 없다는 장점이 있다.
- 자원이 2배로 필요하다는 게 단점이다.

#### 4) Canary
- 다른 버전의 pod를 띄워놓고, 기존 버전과 동일한 tag를 걸어놔서 트래픽의 일부를 받게 하는 것

## DaemonSet
ReplicaSet과 다르게, node의 자원셋과 상관없이 모든 Node에 하나씩 Pod가 생긴다는 특징이 있다.
- ex: Prometheus(Performance), fluentd(Logging), GlusterFS(Storage)

## Job
- 특정 작업만 하고 종료되는 Pod를 `template`에 정의하고 `selector`는 Job이 알아서 만들어준다.

## CronJob
- `template`이 아니라 `jobTemplate`이 있어서, cron schedule에 의해 주기적으로 Job들을 만들어내며 그 Job들은 또 pod들을 만들어내게 된다.
- concurrency policy로 좀더 상세하게 정책을 잡을 수 있다.

#### [참고] Pod을 만드는 3가지 방법: Pod vs ReplicaSet vs Job
Pod이 속해있는 Node가 다운되었다고 가정할 때,
1. `Pod`: 그냥 죽고 끝난다.(서비스 다운)
2. `ReplicaSet`: 새로운 Node에 Pod을 `Recreate`해준다. 그리고 그 Pod는 일을 하지 않으면 `Restart`된다.
    * `Recreate`: Pod를 아예 다시 만들어줌
    * `Restart`: Pod은 그대로 두고 컨테이너만 재시작시켜줌
3. `Job`: 새로운 Node에 Pod을 `Recreate`해준다. 그러나 그 Pod이 일을 하지 않아도 `Restart`해주지 않는다.(자원을 사용하지 않는 상태로 멈춰있을뿐 Pod가 삭제되진 않는다.)
    * CronJob: 위와 같은 Job을 정기적으로 실행한다.

---

> [참고자료]  
> https://www.inflearn.com/course/%EC%BF%A0%EB%B2%84%EB%84%A4%ED%8B%B0%EC%8A%A4-%EA%B8%B0%EC%B4%88  
  