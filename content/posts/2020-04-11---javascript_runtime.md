---
title: JavaScript의 작동 원리
date: "2020-04-11T22:40:32.169Z"
template: "post"
draft: false
slug: "javascript-runtime"
category: "JavaScript"
tags:
  - "JavaScript"
  - "Browser"
  - "NodeJS"
  - "Event"
  - "Async"
  - "Concept"
description: "자바스크립트 런타임은 어떻게 구성되어있고 싱글쓰레드의 장단점, 그리고 자바스크립트에서 왜 그렇게 비동기가 중요한 개념인지 알아보자."
---

자바스크립트는 싱글쓰레드 기반으로 동작한다는 말을 수 차례 들어보았지만 그 작동 원리를 잘 이해하고 있진 못했다. 그래서 이에 대해 공부해보기로 했다. 자바스크립트 런타임은 어떻게 구성되어있고 싱글쓰레드의 장단점, 그리고 자바스크립트에서 왜 그렇게 비동기가 중요한 개념인지 알아보자.

# 싱글 쓰레드가 뭐야?

### 장점
- 자원 접근에 대한 동기화가 불필요하다.
- 문맥 교환(Context Switching) 작업이 불필요하다.

### 단점
- 하나의 작업이 오래 걸리면 성능이 떨어진다.
- 여러 개의 CPU를 사용하지 못한다.(싱글 쓰레드이므로 프로세스도 하나고, CPU도 하나만 사용될 수 밖에 없다.) 따라서 CPU 작업량이 많은 작업에는 적합하지 않다.

# 자바스크립트 런타임
자바스크립트 엔진은 싱글 쓰레드의 장점을 취하고, 자바스크립트 런타임 차원에서는 `Web APIs`와 `Task Queue`, `Event Loop`를 통해 싱글 쓰레드의 단점을 보완한다. 이벤트 루프 기반의 Non-blocking I/O를 지원하는 것이다.

![JavaScript Runtime](/media/js_runtime.png)

## JavaScript Engine
### Heap
메모리 할당이 이루어지는 곳. 동적으로 생성된 객체(인스턴스)는 힙(heap)에 할당된다. 대부분 구조화되지 않는 '더미'같은 메모리 영역을 heap이라 표현한다.

### Call Stack
함수가 호출될 때마다 수행할 작업이 스택 형태로 쌓이는 곳이다. 일반적인 동기적 작업은 수행된 후 _LIFO_ 의 순서로 pop되게 되며, `setTimeout`과 같은 비동기적 작업은 콜백과 함께 Web API를 호출하게 된다. 
(참고로, 계속 콜스택이 위로 쌓여가기만 할 경우 콜스택의 한정된 공간의 크기를 넘어서게 되는데, 이를 `Stack Overflow`라고 한다.)

## Web APIs
참고로, 자바스크립트 엔진은 싱글 쓰레드지만 Web APIs는 멀티 쓰레드가 가능하다. 콜스택으로부터 콜백과 함께 `setTimeout` 함수를 받았다면, 일정 시간(setTimeout의 2번째 인자)이 지난 후 Task Queue로 콜백을 넘겨준다. Background라고도 불린다.

## Task Queue
Web APIs로부터 넘겨받은 콜백을 줄세워 놓기 때문에 Callback Queue라고도 불린다. _FIFO_ 의 순서로 대기한다.

## Event Loop
콜스택이 비어져있고 + 태스크큐에 작업이 대기하고 있다면 이 작업을 콜스택으로 보내 처리한다. 

## 이해를 도울 대표적 예시
아래 예시에서 비동기인 `first`는 태스크 큐에 들어갔다가 호출 스택에 들어오느라, 동기인 `second`보다 늦게 실행되었다. Event loop를 공부하면서, `setTimeout`이 아주 정확하지는 않다는 것을 깨닫게 되었다.

```js
setTimeout(function() {
  console.log("first");
}, 0);
console.log("second");
```

```console
console >>
second
first
```

---

> [참고자료]  
> https://hudi.kr/비동기적-javascript-싱글스레드-기반-js의-비동기-처리-방법/  
