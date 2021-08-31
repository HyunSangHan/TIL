---
title: k8s - Pod가 새로 생성되는 과정
date: "2021-09-01T00:00"
template: "post"
draft: false
slug: "pod-creating-process"
category: "k8s"
tags:
  - "Kubernetes"
  - "Infra"
  - "Dev-environment"
description: "k8s는 자동으로 해주는 게 많아서 작동 과정에는 관심이 덜 가는 면이 있는데, 이번 포스팅에서는 Pod가 새로 생성될 때 어떤 과정을 거치는지 알아본다."
---

k8s는 자동으로 해주는 게 많아서 작동 과정에는 관심이 덜 가는 면이 있는데, 이번 포스팅에서는 Pod가 새로 생성될 때 어떤 과정을 거치는지 알아본다.

### 사전 참고사항

#### Controller Plane Component
마스터노드에 떠있으며 `Controller Manager Pod`, `kube-apiserver Pod` 등을 의미한다.
- `Controller Manager Pod`에는 우리가 사용하는 컨트롤러들, 즉 Deployment, ReplicaSet, DaemonSet, HPA, VPA, CA, .. 등이 쓰레드의 형태로 돌아가고 있다.
- `kube-apiserver`는 쿠버네티스 모든 통신의 길목 역할을 한다. 사용자가 쿠베에 접근했을 때도 그렇지만 쿠베 컴포넌트들조차 타 컴포넌트에 접근한다든가 할 때 이를 통하게 된다. 

#### Worker Node Component
워커노드(들)에 떠있다.
- `kubelet`이 설치되고 이는 각 Node마다 설치돼서 Node를 대표하는 agent 역할을 하며 Node에 포함된 Pod들을 관리하는 역할을 한다.(직접 컨테이너 관리는 X)
  * 컨테이너 관리는 `Controller Runtime`이라는 구현체(Docker 등)가 컨테이너 생성/삭제를 함

## Pod이 생성/삭제되는 과정(예시를 통해 알아보기)

#### 예시1) ReplicaSet을 만들었을 때
1. ReplicaSet을 담당하는 쓰레드는, "Pod을 만들어달라"고 kube-apiserver를 통해 `kubelet`한테 요청함.
2. `kubelet`은, `Controller Runtime`(ex: Docker)에게 ~~(Pod을 만들어달라가 아니라)~~ 컨테이너를 만들어달라고 요청한다.
3. 그럼 `Controller Runtime`이 컨테이너를 만들어준다.

 
#### 예시2) 리소스 사용률이 HPA를 걸어놓은 메트릭 조건을 넘었을 때
1. HPA가 CPU와 메모리 정보를 apiserver를 통해 15초(디폴트)마다 체크하고 있다가, 리소스 사용률이 높아지면 ReplicaSet의 리플리카수를 증가시킨다.
2. 그 이후는 `예시1)`의 1~3 과정과 동일하다.

[참고]
- Resource Estimator인 `cAdvisor`가 도커로부터 Memory, CPU 성능정보를 체크하고 있으며 이를 `kubelet`을 통해 가져갈 수 있게 설정해두었다.
- AddOn Component로 `metrics-server`를 설치하면, 이게 각 Node의 `kubelet`를 통해서 메모리/CPU 정보를 불러와서 저장해둔다.
- 이 데이터들을 다른 컴포넌트들이 사용할 수 있도록 `kube-apiserver`에 Resource API를 등록해놓는다.

---

> [참고자료]  
> https://www.inflearn.com/course/%EC%BF%A0%EB%B2%84%EB%84%A4%ED%8B%B0%EC%8A%A4-%EA%B8%B0%EC%B4%88  
  