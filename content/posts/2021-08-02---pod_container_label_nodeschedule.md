---
title: k8s - [Pod] Container, Label, NodeSchedule
date: "2021-08-02T00:00"
template: "post"
draft: false
slug: "pod-container-label-nodeschedule"
category: "k8s"
tags:
  - "Kubernetes"
  - "Infra"
  - "Dev-environment"
description: "Pod 안에 컨테이너가 있다. Pod에 label을 달면 사용목적을 분리하여, Service에서 selector에 의해 그 Pod를 연결한다."
---

## Pod과 Container
- Pod안에 컨테이너가 있다.
- port를 가지고 있는데 한 컨테이너가 하나의 port를 가질 수 있으며 컨테이너끼리 port가 겹치면 안된다.
- Pod 생성 시 고유 ip주소가 결정되는데 클러스터에서는 접근 가능하지만 외부에서는 이 ip로 접근이 불가하다. 그리고 휘발성이 있는 ip이다. pod가 재생성되면 ip가 바뀐다.

## Pod과 label
- 오브젝트의 경우 라벨을 달 수 있는데, 보통 Pod에 많이 단다. 사용목적에 따라 분류하기 위해 쓴다.
- `key:value` 형태로 달 수 있다.
- 이렇게 붙여둔 라벨들은 나중에 Service를 띄울 때 selector에 의해 셀렉트해서 연결할 수 있다.
  * [참고] 이와 비슷하게, Pod를 띄우기 위해 노드를 지정할 때 node에는 label을, Pod에는 nodeSelector를 붙여 원하는 노드를 셀렉트할 수 있다. 

## Pod과 Node Schedule
- resources.requests.memory 에 작성한 메모리를 감안하여 node schedule이 Node별 자원을 보고 적절하게 분배해준다.
  * Node별로 점수를 매겨서 제일 높은 곳에 할당을 해주는데, 이 점수에 영향을 미치는 게 `남는 자원량`이다.
- 자세한 내용은 [[Pod] Node Scheduling](/posts/pod-node-scheduling)에서 다룬다.

---

> [참고자료]  
> https://www.inflearn.com/course/%EC%BF%A0%EB%B2%84%EB%84%A4%ED%8B%B0%EC%8A%A4-%EA%B8%B0%EC%B4%88  
