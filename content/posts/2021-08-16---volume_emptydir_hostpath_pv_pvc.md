---
title: k8s - [Volume] emptyDir, hostPath, PV/PVC
date: "2021-08-16T00:00"
template: "post"
draft: false
slug: "volume-emptydir-hostpath-pv-pvc"
category: "k8s"
tags:
  - "Kubernetes"
  - "Infra"
  - "Dev-environment"
description: "컨테이너 파일 시스템은 컨테이너가 살아있는 동안만 존재한다. 따라서 컨테이너가 종료되고 재시작할 때, 파일 시스템 변경사항이 손실된다. 컨테이너와 독립적이며, 보다 일관된 스토리지를 위해 사용자는 볼륨을 사용할 수 있다."
---

컨테이너 파일 시스템은 컨테이너가 살아있는 동안만 존재한다. 따라서 컨테이너가 종료되고 재시작할 때, 파일 시스템 변경사항이 손실된다. 컨테이너와 독립적이며, 보다 일관되고 안정적인 스토리지를 위해 사용자는 볼륨을 사용할 수 있다. 실제 데이터는 k8s cluster와 분리되어 관리된다.

#### 볼륨 자원을 내부망에서 관리하는 경우

클러스터를 구성하는 Node들을 실제 물리적인 공간으로 활용해 데이터를 만들 수 있는 방법으로
- `hostPath`나 `local volume`이 있고,
- `On-Premise Solution`인 StorageOs, Ceph, GlusterFS 등이 있다.
- 그리고 아예 Node자원과 별개로 `NFS`를 사용해 다른 서버를 볼륨 자원으로 사용할 수 있다.

#### 볼륨 자원을 외부망에서 관리하는 경우
대표적으로 아래와 같은 제품들이 있다. 이렇게 k8s cluster 외부에 볼륨이 마련되어있다면, PVC를 만들어 PV를 통해 
- AWS
- GCP
- Azure

## 볼륨을 사용하는 방식의 종류

### 1. emptyDir
- **컨테이너끼리 Pod 내에서 데이터를 공유**하기 위해 볼륨을 사용하는 것.
  - 예컨대 Pod안에 컨테이너를 2개 띄워서 하나는 웹, 하나는 백엔드 처리를 해준다고 했을 때 두 서버 간 통신을 할 필요가 없게 해준다. Pod 안에 마운트된 볼륨을 로컬 파일처럼 접근 가능하기 때문에.
  - 각 **컨테이너**별 접근 path는 다르더라도 동일한 디렉토리에 접근할 수 있도록 공유된다.
- Pod 특성상, 일시적인 사용목적에 의한 데이터만 쓰는 게 좋다. Pod 생성 시 만들어지고, 죽으면 휘발되기 때문이다.
- 최초에 생성했을 때에는 비어있기 때문에 `emptyDir`이라고 한다.

### 2. hostPath
- **Pod끼리 Node 내에서 데이터를 공유**하기 위해 볼륨으로 사용하는 것. (Pod말고) Node에 있는 path를 Pod에서 사용하기 위한 거라고 보면 된다.
  * 각 **Pod**별 접근 path가 다르더라도 동일한 디렉토리에 접근할 수 있도록 공유된다.
- Pod이 죽어도 사라지지 않는다.
- 근데 문제점은, 예컨대 특정 Pod가 Node1의 hostPath를 사용하다가 죽은 후 Node2에서 살아날 수도 있는데, 그럼 그 볼륨을 되살아나서는 못쓰게 된다는 점이다.
  * 이를 해결하려면 Node 추가 시마다 같은 경로에 마운트를 해줘야한다.(개발자가 직접 해줘야해서 비추)

### 3. PVC(Persistent Volume Claim)와 PV(Persistent Volume)
- Pod에 영속성있는 볼륨을 제공하기 위한 기능이다.
- `PVC`는 유저 영역 `PV`는 어드민영역이라고 보면 된다. `PVC`는 `PV`에 Pod를 연결해주는 역할이다.
- `capacity`와 `accessModes`라고 하는 spec 내 옵션이 있는데, 이걸 `PV`에서 셋팅해놓으면 `PVC`에서 요구사항을 적을 때 그걸 기준으로 `PV`를 연결한다.
- PVC만 만들면 PV를 자동으로 만들어주고 볼륨까지 연결해주는 Dynamic Provisioning이라는 방식도 있는데 이는 [[Volume] Dynamic Provisioning, 그리고 PV의 Status와 ReclaimPolicy](/posts/volume-dynamic-provisioning)에서 별도로 더 다루었으니 참고한다.

---

> [참고자료]  
> https://www.inflearn.com/course/%EC%BF%A0%EB%B2%84%EB%84%A4%ED%8B%B0%EC%8A%A4-%EA%B8%B0%EC%B4%88  
> https://kubernetes.io/ko/docs/concepts/storage/volumes/  
  