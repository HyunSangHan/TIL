---
title: 프로세스(Process)와 쓰레드(Thread)
date: "2020-04-11T19:46"
template: "post"
draft: false
slug: "process&thread"
category: "OS "
tags:
  - "Concept"
  - "Computer Science"
  - "OS"
description: "프로세스는 운영체제로부터 자원을 할당받는 작업의 단위이고 쓰레드는 프로세스가 할당받은 자원을 이용하는 실행의 단위이다."
---

`프로세스`는 운영체제로부터 자원을 _할당_ 받는 **작업의 단위**이고 `쓰레드`는 프로세스가 할당받은 자원을 _이용_ 하는 **실행의 단위**이다.

# Process
- 컴퓨터에서 연속적으로 실행되고 있는 컴퓨터 프로그램. 즉 메모리상에 올라와 실행중인 각 작업들을 의미한다.
- 운영체제로부터 프로세서, 필요한 주소 공간, 메모리 등 자원을 프로세스 단위로 할당받게 된다. 

# Thread
- 프로세스 내에서 실행되는 여러 흐름의 단위. 기본적으로 프로세스당 최소 1개의 쓰레드를 가지고 있고 그것을 메인 쓰레드라고 한다.
- 프로세스 내에서 각 쓰레드는 `Stack`만 따로 할당을 받고 `Code`, `Data`, `Heap` 영역을 공유한다.

# Multi-process와 Multi-thread
- `Multi-process`인 경우 CPU에서 여러 프로세스를 로테이션으로 돌면서 처리를 하게 된다.
- 그 과정에서, 동작중인 프로세스가 대기를 타면서 해당 프로세스의 상태(Context)를 보관하고, 대기하고 있던 다음 순번의 프로세스가 동작하면서 이전에 보관했던 프로세스의 상태를 복구하게 된다. 이러한 과정을 `Context Switching`이라고 하는데 프로세스는 각각 독립된 메모리 영역이다보니 꽤 비용이 많이 발생한다.
- 반면 한 프로세스 내에서 `Multi-thread`를 사용하는 경우, 프로세스를 생성하여 자원을 할당하는 시스템 콜이 줄어들어 자원을 효율적으로 관리할 수 있다. Code, Data, Heap 영역을 공유하다보니 리소스 소모가 줄어들고 응답 시간 또한 단축된다.
- 하지만 이는 잘못하면 단점이 될 수 있다. 각 쓰레드가 동일한 데이터를 사용하다가 충돌이 날 수 있고 버그가 생길 수 있는 것이다.

---

> [참고자료]  
> https://gmlwjd9405.github.io/2018/09/14/process-vs-thread.html  
