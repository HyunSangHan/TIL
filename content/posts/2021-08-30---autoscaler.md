---
title: k8s - Autoscaler
date: "2021-08-30T09:00"
template: "post"
draft: false
slug: "autoscaler"
category: "k8s"
tags:
  - "Kubernetes"
  - "Infra"
  - "Dev-environment"
  - "Comparsion"
description: "HPA로 가장 많이 사용되는, 오토스케일러는 HPA, VPA, CA가 있다."
---

## HPA(Horizontal Pod Autoscaler)
- HPA가 Pod의 리소스 상태를 감지하고 있다가 Controller(아마 ReplicaSet일 것)의 replicas를 수정한다.(Scale Out / Scale In)
- 장애를 방지하기 위해서, 기동이 빠르게 되는 App에 사용을 권장한다.
- Stateless App에 사용해야한다. Stateful하면 어떤 App을 늘려야하는지 알 수 없기 때문이다.
- 각 옵션 사용 방법
  * `target`: 타겟 컨트롤러 지정(예컨대 Deployment)
  * `maxReplicas`/`minReplicas`: 리플리카 수 최대/최소 지정
  * `metrics`: "어떤 매트릭 정보"의 "어떤 조건"을 통해 replicas를 변경할 건지 정하는 부분
- 프로메테우스를 설치하면 이런 Resource 말고도 예컨대 Pod로 들어오는 Packet수라는지 등을 기준으로 HPA가 가능해진다.

## VPA(Vertical Pod Autoscaler)
- HPA처럼 스케일아웃이 아니라, VPA는 스케일업을 해주는 것이다.
- Stateful App에 대해 사용한다.
- 한 Controller에서 VPA를 쓸 때에는 HPA와 함께 쓸 수는 없다.

## CA(Cluster Autoscaler)
- 워커 Node 차원에서 Scale Out, Scale In을 해주는 것이다.
- 참고로 Scale In 때, 추가되었던 Node를 기존 Node로 옮겨준다.

---

> [참고자료]  
> https://www.inflearn.com/course/%EC%BF%A0%EB%B2%84%EB%84%A4%ED%8B%B0%EC%8A%A4-%EA%B8%B0%EC%B4%88  
  