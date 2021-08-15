---
title: k8s - [Pod] ReadinessProbe, LivenessProbe
date: "2021-08-02T02:00"
template: "post"
draft: false
slug: "pod-probes"
category: "k8s"
tags:
  - "kubernetes"
  - "Infra"
  - "Dev-environment"
description: "ReadinessProbe는 Pod가 뜬 다음, 컨테이너 안에 있는 App이 구동(Running)될 때까지 체크한 후에 비로소 트래픽이 가도록 해주고, LivenessProbe는 서비스가 다운되었을 때 트래픽이 실패(5xx error)될 텐데, 이를 감지하여 지속적인 트래픽 실패를 방지해준다."
---

## ReadinessProbe
- Pod가 뜬 다음, 컨테이너 안에 있는 App이 구동(Running)될 때까지 체크한 후에 비로소 트래픽이 가도록 하는 역할.
- 이에 따라 트래픽 실패를 없앨 수 있게 됨

## LivenessProbe
- App은 겉보기엔 정상적으로 구동(Running) 중인 상태이지만 그 안에 돌고 있던 서비스가 다운되었을 때 트래픽이 실패(5xx error)될 텐데, 이를 감지하는 역할.
- 이에 따라 "지속적인" 트래픽 실패를 방지할 수 있게 함

#### 참고
Pod의 Container에 `ReadinessProbe`, `LivenessProbe`를 설정하게 되는데, 그 때 속성들이 몇 개 있다. 
아래 셋 중 하나는 꼭 정해야 하는 속성이다.

1. httpGet (`Port`, `Host`, `Path`, `HttpHeader`, `Scheme`)
2. Exec (`Command`)
3. tcpSocket (`Port`, `Host`)

그 외에, 다른 속성(옵션)들로 이런 것들이 있다. 

- initialDelaySeconds (default 0초): 최초 프로브 하기 전 딜레이 시간
- periodSeconds (default 10초): 프로브 체크 시간 간격
- timeoutSeconds (default 1초): 지정된 시간까지 결과가 와야 됨
- successThreshold (default 1회): 몇번 성공을 받아야 성공으로 분류할지
- failureThreshold (default 3회): 몇번 실패를 받아야 실패로 분류할지

---

> [참고자료]  
> https://www.inflearn.com/course/%EC%BF%A0%EB%B2%84%EB%84%A4%ED%8B%B0%EC%8A%A4-%EA%B8%B0%EC%B4%88  
  