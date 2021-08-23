---
title: k8s - [Service] ClusterIP, NodePort, LoadBalancer
date: "2021-08-09T00:00"
template: "post"
draft: false
slug: "service-clusterip-nodeport-loadbalancer"
category: "k8s"
tags:
  - "Kubernetes"
  - "Infra"
  - "Dev-environment"
  - "Network"
description: "쿠버네티스의 Service는 Pod에 접근을 도와주는 역할을 한다. 서비스의 유형에 대해 알아본다."
---

# Service의 유형
쿠버네티스의 Service는 Pod에 접근을 도와주는 역할을 한다. 서비스의 유형에 대해 알아본다.

## 1. ClusterIP
- 자신의 Cluster IP를 IP로 가지고 있다.
- 클러스터 내부에서만 접근 가능. 운영자 등 인가된 자들만 사용 가능하다.
- 그럼, Pod도 클러스터 내부에서 접근 가능한 IP를 가지고 있는데 왜 이 서비스가 필요한 걸까?
  * Service를 개발자가 일부러 지우지 않는 이상 계속 존재하기 때문에 Pod에 비해 고정적이어서 그렇다.

## 2. NodePort
- 일단, 노드포트 타입에도 ClusterIP 기능은 기본으로 탑재되어있다.
- 쿠베 클러스터에 연결되어있는 모든 노드에게 동일한 port가 할당이 되어, 그 노드 IP에 그 port로 접속하면 해당 Service로 연결된다. 그럼 그 Service는 자기한테 연결되어있는 Pod에 연결을 해준다.
- 노드(내부망)IP를 쓰긴 하기 때문에, 보통 내부망에서 접근 가능하게 된다. 

## 3. Load Balancer
- NodePort의 성격을 기본적으로 가지고 있다.
- 로드밸런서가 각 노드에 트래픽을 분배해준다. 로드밸런서에 접근하기 위한 외부 IP(External IP)는 플러그인에 의해 만들어진다.
- 외부에 시스템을 노출하는 용도로 쓰인다.

---

> [참고자료]  
> https://www.inflearn.com/course/%EC%BF%A0%EB%B2%84%EB%84%A4%ED%8B%B0%EC%8A%A4-%EA%B8%B0%EC%B4%88  
  