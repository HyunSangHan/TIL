---
title: k8s - Namespace
date: "2021-08-23T08:00"
template: "post"
draft: false
slug: "k8s-namespace"
category: "k8s"
tags:
  - "kubernetes"
  - "Infra"
  - "Dev-environment"
description: "여러 네임스페이스가 쿠버네티스 클러스터의 자원을 공유해서 쓴다. 각 네임스페이스에 리소스 쿼타를 달면 그만큼은 보장된다."
---

여러 네임스페이스(그안에 여러 pod가 있음)가 쿠버네티스 클러스터의 자원을 공유해서 쓴다. 각 네임스페이스에 리소스 쿼타를 달면 그만큼은 보장된다.

## 네임스페이스(Namespace)
- 네임스페이스 내에서 동일 오브젝트는 동일한 이름을 가지면 안된다.
- 네임스페이스가 서로 다르다면 서로 독립적으로 존재한다.
  * ex: 네임스페이스1에서 Pod을 만들어 라벨을 달았다고 하면, 네임스페이스2에서 Service를 만들 때 그 라벨값과 같은 selector를 지정해도 그 Pod에 연결할 수 없다.
- 네임스페이스를 지우면 그 안의 자원도 모두 지워진다. 

### ResourceQuota
네임스페이스의 자원 한계를 설정하는 오브젝트
- 리소스쿼타를 명시했으면 Pod를 만들 때 그 리소스를 명시해야만 만들 수 있다.
- 제한할 수 있는 것: 리소스(cpu/memory/stroage), 오브젝트개수(Pod, Service, ConfigMap, PVC, ...)

### LimitRange
각 Pod마다 네임스페이스에 들어올 수 있는지 자원을 체크해줌. (조건문 또는 제약조건 느낌)

---

> [참고자료]  
> https://www.inflearn.com/course/%EC%BF%A0%EB%B2%84%EB%84%A4%ED%8B%B0%EC%8A%A4-%EA%B8%B0%EC%B4%88  
  