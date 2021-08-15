---
title: k8s - [Volume] Dynamic Provisioning, 그리고 PV의 Status와 ReclaimPolicy
date: "2021-08-16T08:00"
template: "post"
draft: false
slug: "volume-dynamic-provisioning"
category: "k8s"
tags:
  - "kubernetes"
  - "Infra"
  - "Dev-environment"
description: "동적 프로비저닝(Dynamic Provisioning)은 사용자가 PVC를 만들면 알아서 PV를 만들어주고 volume과 연결해주는 기능이다. StorageClass라는 오브젝트를 만들어두면 동적으로 PV를 생성하기 위해 PVC를 만들 때 사용된다."
---

k8s에는 동적 프로비저닝(**Dynamic Provisioning**)이란 게 있어서 사용자가 PVC를 만들면 그에 따라 동적으로 PV를 만들어주고 volume과 연결까지 해주는 기능이 있다.

#### [참고] StorageClass
`StorageClass`라는 오브젝트를 만들어두면 동적으로 PV를 만들 때 사용된다. `PVC` 만들 때 StorageClassName 부분에 `StorageClass` 이름을 적으면 그에 맞는 PV가 만들어지고 볼륨과 연결된다.

## PV의 Status
`PVC`에 연결된 상태인지 등을 상태로 나타낸다.
- `Available`: `PVC`에 연결되기 전
- `Bound`: `PVC`와 연결된 상태
  * 단, Pod가 `PVC`를 사용해 구동 될 때까지(연결되지 않은 상태라면) 볼륨에 실제 데이터가 만들어지진 않는다.
- `Released`: `PVC`와 연결이 끊어진 경우(`PVC`를 삭제한 경우)
  * `ReclaimPolicy`에 따라 달라진다.(뒤에서 다룬다.)
- `Failed`: PV와 데이터 간의 연결에 문제가 생겼을 때

## PV의 ReclaimPolicy
- `Retain`_(Default)_: 데이터가 보존되지만 그 `PV`의 재사용은 불가함
- `Delete`: StorageClass 사용 시엔 Default. 경우에 따라 데이터가 삭제되기도 하고 아니기도 함. 그 PV는 재사용은 불가함
- `Recycle`_(Deprecated)_: 데이터가 삭제되지만 재사용이 가능하다.(곧 `PV`의 status가 Available로 돌아간다.)

---

> [참고자료]  
> https://www.inflearn.com/course/%EC%BF%A0%EB%B2%84%EB%84%A4%ED%8B%B0%EC%8A%A4-%EA%B8%B0%EC%B4%88  
> https://kubernetes.io/ko/docs/tasks/administer-cluster/change-pv-reclaim-policy/  
  