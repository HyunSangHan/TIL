---
title: k8s - StatefulSet
date: "2021-08-30T00:00"
template: "post"
draft: false
slug: "statefulset"
category: "k8s"
tags:
  - "Kubernetes"
  - "Infra"
  - "Dev-environment"
  - "Comparsion"
description: "Stateless vs Stateful 의 개념부터 알아보고, k8s 내에서 각각에 해당하는 ReplicaSet과 StatefulSet에 대해 이어서 알아본다."
---

## Stateless vs Stateful

#### Stateless Application
- 대표적으로 Web Server(Apache, Nginx 등)
- 주로 사용자(유저)로부터 트래픽을 받는다.
- 각각의 앱은 동일한 기능을 하므로 단순히 부하 분산을 위해 여러 앱을 띄워놓게 되는 게 일반적이다.
- 한 앱이 죽으면, 그 개수를 채우기 위해 단순히 앱 하나를 더 띄워주면 된다.
- 보통은 볼륨이 필요 없다. 볼륨이 필요하다면 하나의 볼륨을 모든 앱이 함께 써도 무방하다.(로그 등..)

## Stateful Application
- 대표적으로 Database(MongoDB, Redis 등)
- 외부 사용자보다는 주로 내부 시스템에 의해 트래픽을 받는다.
- 각각의 앱은 Primary, Secondary, Arbiter 등 고유의 역할이 있다.
- 따라서 한 앱이 죽었을 때 아무 앱이나 띄우면 안되고, 그와 동일한 이름과 역할을 가진 앱을 띄워야 정상 재개된다.
- 각 역할에 따라 볼륨을 따로따로 써야한다.

Stateless Application을 여럿 관리할 때 `ReplicaSet`을 사용하고, Stateful Application을 여럿 관리할 때 `StatefulSet`을 사용한다.

### ReplicaSet vs StatefulSet

#### ReplicaSet
- Pod가 죽어서 다시 띄워야 할 때 이름이 랜덤 생성된다.
- replicas를 늘리거나 줄일 때 동시다발적으로 Pod가 삭제되거나 생성된다.
- PVC를 사용하려면 직접 생성해서 써야한다.
- 그리고 Pod가 어느 Node에 뜰지 모르기 때문에, nodeSelector를 이용해 특정 PVC가 있는 Node로 지정을 해줘야, Pod이 위치하는 Node와 PVC가 위치하는 Node가 달라지지 않아 Pod이 정상적으로(의도된 위치에) 뜨고 PVC에 연결될 수 있다.

#### StatefulSet
- Pod가 죽어서 다시 띄워야 할 때 Ordinal Index가 붙은 이름(ex: Pod-0)로 생기며, 새 이름이 아니라 기존 이름으로 생긴다.
- Replicas를 늘리거나 줄일 때 Index가 높은 Pod부터 순차적으로 진행된다.
- Pod가 생성되면 PVC가 동적으로 생성되고 Pod와 바로 연결되므로 PVC를 따로 만들거나 할 필요 없다.
- 기본적으로 PVC는 삭제하지 않는다. 볼륨은 함부로 지우면 안되므로.

---

> [참고자료]  
> https://www.inflearn.com/course/%EC%BF%A0%EB%B2%84%EB%84%A4%ED%8B%B0%EC%8A%A4-%EA%B8%B0%EC%B4%88  
  