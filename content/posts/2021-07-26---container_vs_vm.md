---
title: 컨테이너(Container)란?
date: "2021-07-26T00:00"
template: "post"
draft: false
slug: "container-vs-vm"
category: "k8s"
tags:
  - "kubernetes"
  - "Infra"
  - "Dev-environment"
  - "Comparison"
description: "VM과의 차이점을 중심으로 컨테이너를 알아본다. VM은 각각의 OS를 띄워야 하는 것 대비, 컨테이너는 OS를 공유하여 여러 컨테이너들이 그 자원을 컨테이너단위로 나눠 쓸 수 있다."
---

## VM
- 비교적 완전한 격리이다.
- VM마다 각각의 OS를 띄워야 한다.
- VM은 수평적인 확장을 할 때 불필요한 모듈까지 함께 띄우게 된다.

## Container
- 다수의 컨테이너가 하나의 Host OS 위에서 자원을 공유한다.
- 리눅스 버전이나 라이브러리 등, 서비스에 필요한 디펜던시들을 컨테이너 이미지에 담을 수 있다. 따라서 어디서 서비스를 띄우든 안정적으로 서비스를 운영할 수 있다.
- 컨테이너 단위로 배포가 가능하므로, 모듈별로 쪼개어 개발했을 때 쿠버네티스는 더 큰 효과를 발휘한다.
- 마이크로서비스 개념으로 필요한 모듈 단위로 컨테이너를 더 띄워도 되어 효율적이다.

#### 참고
컨테이너 가상화를 시켜주는 것으로 대표적으로 `Docker`가 있다.

---

> [참고자료]  
> https://www.inflearn.com/course/%EC%BF%A0%EB%B2%84%EB%84%A4%ED%8B%B0%EC%8A%A4-%EA%B8%B0%EC%B4%88  