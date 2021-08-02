---
title: Pod - Node Scheduling
date: "2021-08-02T09:00"
template: "post"
draft: false
slug: "pod-node-scheduling"
category: "k8s"
tags:
  - "kubernetes"
  - "Infra"
  - "Dev-environment"
description: "kubelet이 Pod를 실행할 수 있도록, Pod를 할당할 때 어떤 Node가 적합한지 kube-scheduler가 확인하는 것을 말한다."
---

`kubelet`이 Pod를 실행할 수 있도록, Pod를 할당할 때 어떤 Node가 적합한지 `kube-scheduler`가 확인하는 것을 말한다.
`kube-scheduler`는 아래와 같이 두 단계 작업에서 파드에 대한 노드를 선택한다.

1. 필터링
2. 스코어링(scoring)

Pod가 할당될 적합한 Node를 설정할 때 필터링 혹은 스코어링에 쓰이는 속성은 다음과 같다.
`Node 선택`, `Pod간 같은 노드에 할당 or 서로 다른 노드에 할당`, `Node에 할당 제한`으로 성격을 구분해볼 수 있겠다.

## Node 선택

#### NodeName
- 명시적으로 노드명으로 셀렉트한다.
- 운영하다보면 노드가 추가/제외 되면서 노드명이 바뀔 수도 있으므로 이는 별로 권장되지 않는다.

#### NodeSelector
- 노드에 달려있는 `label`을 기준으로 그와 동일한 NodeSelector를 사용하여 셀렉트한다.
- 만일 동일한 `key-value`를 가지는 노드가 2개 이상이라면 그중 리소스 상황이 가장 좋은 노드에 Pod이 올라간다.
- 만일 동일한 `key-value`를 가지는 라벨의 노드가 없다면 Pod은 어느 노드에도 할당되지 않아 에러가 난다.

#### NodeAffinity
- `key`만 맞으면, 그 key가 일치하는 `label`의 노드에 적절히 할당이 되고,
- 일치하는 `label`의 노드가 없으면 Scheduler가 알아서 할당해준다.
- `matchExpressions` 옵션을 쓰면 일부만 일치해도 셀렉트 된다.
- `required` 옵션을 쓰면 그 `key`가 노드에 `label`로 없을 경우 할당되지 않는다.
- `preferred` 옵션을 쓰면 그 `key`가 노드에 `label`로 있는 경우를 우선시 하긴 하지만 그렇지 않아도 할당은 된다.
  * `preferred` 속성에 있는 필수값인 `weight`를 사용하면, 우선순위가 같은 두 개 이상의 Node 간 리소스가 더 많이 남는 걸 선택할 때 가중치를 부여해서 고려할 수 있게 해준다.

## Pod간 같은 노드에 할당 or 서로 다른 노드에 할당
2개 이상의 Pod가 동일한 노드에 존재해야하거나, 오히려 그 반대로 동일한 노드에 존재하면 안될 때에 할당하는 수단이다.

#### Pod Affinity
- 예시: 웹 Pod과 서버 Pod 관계
- `podAffinity`를 줘서 동일 `key-value`를 지정해주면 동일 노드에 올라간다.
- Node에 있는 label과 비교해서 찾는 게 아니라, **Pod들에 있는 label을 비교**해서 운명을 함께 할 Pod을 찾는다.
- `topologyKey`를 줘서 특정 노드로 제한시킬 수 있다.
- `required`와 `preferred` 옵션은 Node Affinity와 동일하다.

#### Pod Anti-Affinity
- 예시: Primary - Secondary 관계의 Pod들
- `podAntiAffinity`를 줘서 동일 `key-value`를 지정해주면 동일 노드에 올라가지 **않는다.**
- Node에 있는 label과 비교해서 찾는 게 아니라, **Pod들에 있는 label을 비교**해서 서로 격리되어 존재할 대상 Pod을 찾는다.
- `topologyKey`를 줘서 특정 노드로 제한시킬 수 있다.

## Node에 할당 제한

#### Toleration / Taint
- 예시: GPU가 있는 Node여서 성능이 좋을 수 있게 아껴줘야 할 때
- `taint`라는 걸 Node에 설정하면, 기존 방법으로는 Pod을 거기에 할당할 수 없음.
  * 예외적으로, `toleration`을 설정한 Pod은 거기에 할당되게 됨
  * 단, `toleration`에 있는 key, operatore, value, effect가 모두 일치해야만 함
  * 여기까지가 자격(?) 같은 거였고, 특정 노드에 지정하고 싶다면 여기다 nodeSelector까지 붙여줘야 한다.
- Pod가 이미 안착되어있는 상태에서 Node에 `taint`를 붙여준다면? Pod이 쫓겨날까?
  * 기본적으로, `NoSchedule` 효과(effect)의 Taint면 그렇지 않다.
  * NoExecute 효과의 `taint`면 그 Pod는 삭제되고, 이후 AutoHealing 기능에 의해 다른 Node에서 Pod이 새로 뜬다.
    * 만일 `toleration`에 effet로 `NoExecute`를 가진 Pod이 `tolerationSeconds`를 가지고 있지 않다면 삭제 되지 않는다. 가지고 있다면 그 시간(초) 동안 기다렸다가 삭제된다.

---

> [참고자료]  
> https://www.inflearn.com/course/%EC%BF%A0%EB%B2%84%EB%84%A4%ED%8B%B0%EC%8A%A4-%EA%B8%B0%EC%B4%88  
  