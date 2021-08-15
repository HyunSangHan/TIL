---
title: k8s - [Pod] Lifecycle
date: "2021-08-02T01:00"
template: "post"
draft: false
slug: "pod-lifecycle"
category: "k8s"
tags:
  - "kubernetes"
  - "Infra"
  - "Dev-environment"
description: "라이프사이클 단계에 따라 주요 기능들이 밀접한 관련을 맺고 있으므로 Pod의 생명주기를 잘 알아야 한다."
---

라이프사이클 단계에 따라 주요 기능들이 밀접한 관련을 맺고 있으므로 Pod의 생명주기를 잘 알아야 한다.

## 각 Phase와 그 의미
단계 | Phase | 의미
:--: | :--: | --
1 | Pending | Pod가 쿠버네티스 클러스터에서 승인되었지만, 하나 이상의 컨테이너가 설정되지 않았고 실행할 준비가 되지 않았다. 여기에는 Pod가 스케줄되기 이전까지의 시간 뿐만 아니라 네트워크를 통한 컨테이너 이미지 다운로드 시간도 포함된다.
2 | Running | Pod가 노드에 바인딩되었고, 모든 컨테이너가 생성되었다. 적어도 하나의 컨테이너가 아직 실행 중이거나, 시작 또는 재시작 중에 있다.
3 | Succeeded | Pod에 있는 모든 컨테이너들이 성공적으로 종료되었고, 재시작되지 않을 것이다.
3 | Failed | Pod에 있는 모든 컨테이너가 종료되었고, 적어도 하나 이상의 컨테이너가 실패로 종료되었다. 즉, 해당 컨테이너는 non-zero 상태로 빠져나왔거나(exited) 시스템에 의해서 종료(terminated)되었다.
- | Unknown | 어떤 이유에 의해서 Pod의 상태를 얻을 수 없다. 이 단계는 일반적으로 Pod가 실행되어야 하는 노드와의 통신 오류로 인해 발생한다.

### 각각에 대한 추가 설명
#### 1) Pending

1. PodScheduled: Pod가 어느 노드에 생성될지 결정되면 True가 됨
2. Initialized: initContainer가 실행 완료되었거나 아예 설정하지 않았을 때 True가 됨
    - initContainer: 본 컨테이너가 기동되기 전에 초기화시켜야 하는 내용이 있을 경우 그걸 실행하는 컨테이너

#### 2) Running
- _(컨테이너가 Running이 아니고 심지어 CrashLoopBackOff인 상태라 하더라도)_ 일단 컨테이너가 실행되게 되면 `Running` 상태가 된다.
  * 참고로, 컨테이너가 `Running`이면 `ContainerReady`가 True가 되고 Pod의 `Ready`가 `True`, `CrashLoopBackOff`이면 `ContainerReady`와 `Ready`가 `False`가 된다.

#### 3-1) Suceeded
- Job이나 CronJob으로 생성된 Pod이 실행이 끝나고 나면 Pod의 상태는 성공 또는 실패인데, 만일 모든 Container가 Completed인 상황이 바로 "Pod의 상태가 성공"인 것이고 `Suceeded`가 된다.

#### 3-2) Failed
- 컨테이너 중 하나라도 Error가 생기면 Pod의 상태가 실패가 되어 `Failed`가 된다.
- 참고로, 성공이든 실패든 `ContainerReady`와 `Ready`는 `False`가 된다.
- `Pending`에서 바로  `Failed`가 되기도 하고, `Unknown`이 오래 지속되면 이렇게 되기도 한다.

#### Unknown
- `Pending`이나 `Running`중 통신장애가 발생하면 `Unknown`이 된다.

---

> [참고자료]  
> https://www.inflearn.com/course/%EC%BF%A0%EB%B2%84%EB%84%A4%ED%8B%B0%EC%8A%A4-%EA%B8%B0%EC%B4%88  
> https://kubernetes.io/ko/docs/concepts/workloads/pods/pod-lifecycle/  