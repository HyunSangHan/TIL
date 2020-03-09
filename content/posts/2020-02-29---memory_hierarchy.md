---
title: Memory Hierarchy
date: "2020-02-29T17:50:32"
template: "post"
draft: false
slug: "memory-hierarchy"
category: "Computer Architecture"
tags:
  - "Computer Science"
  - "Computer Architecture"
description: "CPU가 메모리에 더 빨리 접근하기 위해 메모리를 여러가지 종류로 나누어둠을 의미한다. 레지스터 > 캐시 메모리 > 메인메모리 > 보조기억장치 순으로 빠르다. "
---

메모리를 필요에 따라 여러가지 종류로 나누어둠을 의미한다. 이때 `필요`란, 대개 CPU가 메모리에 더 빨리 접근하기 위함이다. 빠른 순서대로 나열하면 이렇다.
1. 레지스터(Register)
2. 캐시 메모리(Cache Memory)
3. 주기억장치(Main Memory)
4. 보조기억장치(하드디스크, CD 드라이브 등)

# CPU(Central Processing Unit)
- 중앙처리장치
- 컴퓨터의 모든 데이터를 연산 처리하며 두뇌와 같은 역할
- CPU 안에서 연산을 처리하기 위하여 데이터를 저장하는 공간인 레지스터, 그리고 CPU와 RAM 간의 속도 차이를 극복하기 위한 캐시 메모리(Cache Memory)가 포함됨

### 레지스터(Register)
- CPU Core 내부에 존재하며 Core에서 연산을 수행할 때 직접 참조할 수 있는 유일한 기억장치

### 캐시메모리(Cache Memory)
- CPU의 속도가 너무 빠르고 RAM의 속도가 상대적으로 떨어지기 때문에 그 사이에 캐쉬메모리라는 고속 메모리를 CPU 칩 안에 두어 RAM에 접근하지 않아도 되게 함
- 자주 사용하는 데이터를 임시적으로 저장함으로써 RAM과의 속도 격차를 줄여줌

# 주기억장치(Main Memory)
- RAM(Random Access Memory), ROM(Read Only Memory)으로 나뉨
- CPU가 연산을 하려면 코드 및 리소스가 메모리에 로드되어야 함
- 하드디스크가 CPU에 비해 너무 느리기 때문에 RAM이 CPU와 하드디스크를 연결해 주는 역할을 함
- RAM 공간이 너무 적다면 하드디스크의 공간을 가상 RAM 공간으로 인식하여 느려지게 됨

# 보조기억장치
### SSD(Solid State Drive)
- 보조기억장치 중 하나
- 하드디스크의 디스크 방식과는 다르게 SSD는 RAM과 비슷한 반도체로 이루어져있어서 고속으로 데이터를 입출력 가능
- 발열/소음/전력소모가 적으며 소형화/경량화가 가능
- 하드디스크에 비해 외부 충격에 강하나 저장 용량당 가격이 비쌈

### HDD(Hard Disk Drive)
- 보조기억장치 중 하나
- 개인용 컴퓨터에서의 보조기억장치로 널리 사용됨
- 자성 물질을 입힌 금속 원판을 여러 장 겹쳐서 만든 기억매체
- 저장 용량이 크고, 데이터 접근 속도가 빠르나 충격에 약해 본체 내부에 고정시켜 사용함

# 참고
## 브라우저 캐시
웹 개발에서 캐시는 크게 클라이언트 측 또는 서버 측을 활용한 캐시가 있다. 서버를 통한 캐시 활용은 `CDN 서버`를 예로 들 수 있고, 클라이언트는 `브라우저 캐시`를 예로 들 수 있다. 브라우저 캐시를 간단히 알아보자.

### Disk Cache
디스크 캐시는 하드디스크에 접근하는 시간을 개선하기 위해 RAM에 저장하는 기법이다. 하드디스크에 접근하는 것보다 RAM 에 접근하는 것이 더 빠르기 때문이다.

### Memory Cache
메모리 캐시는 캐시 메모리에 저장하는 기법이다.

#### 캐시 컨트롤의 원리
CPU 내부에 있는 캐시 컨트롤러(Cache Controller)는 두 가지 원리에 따라 캐시 메모리에 적재될 내용을 관리한다.
- 시간적 지역성(Temporal Locality) : 최근 접근된 내용이 또 다시 접근될 확률이 높다.
- 공간적 지역성(Spatial Locality) : 한 지역의 내용이 접근되었다면, 그 주위의 내용도 접근될 확률이 높다.

---

> [참고자료]  
> https://mygumi.tistory.com/275  
> https://www.tuwlab.com/ece/1977