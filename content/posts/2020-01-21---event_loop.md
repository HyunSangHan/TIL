---
title: 이벤트루프
date: "2020-01-21T22:40:32.169Z"
template: "post"
draft: false
slug: "event-loop"
category: "Javascript"
tags:
  - "Javascript"
  - "Event"
description: "자바스크립트는 싱글쓰레드 기반으로 동작한다는 말을 수 차례 들어보았지만 그 작동 원리를 잘 이해하고 있진 못했다. 그래서 이에 대해 공부해보기로 했다."
# socialImage: "/media/image-3.jpg"
---

<!-- # 이벤트 루프(Event Loop) -->
자바스크립트는 싱글쓰레드 기반으로 동작한다는 말을 수 차례 들어보았지만 그 작동 원리를 잘 이해하고 있진 못했다. 그래서 이에 대해 공부해보기로 했다. 이벤트 루프에 대해 이해하기에 앞서 알아야 할 것들부터 정리했다.

# 자바스크립트의 작동 원리
자바스크립트 엔진은 크게 3가지 영역(`Call Stack`, `Event(Task) Queue`, `Heap`)으로 나뉘며, 추가로 `Event Loop`라는 게 Event Queue에 들어갈 Event들을 관리하게 된다. 자바스크립트의 메인 쓰레드인 이 이벤트 루프가 바로 싱글 쓰레드이기 때문이기 때문에, 자바스크립트를 싱글쓰레드 기반으로 동작한다고 말하는 것이다.

## 렌더링 엔진 vs 자바스크립트 엔진

### 렌더링 엔진
- 웹 렌더링 엔진(Web Rendering Engine) 또는 웹 브라우저 엔진(Web Browser Engine) 또는 웹 레이아웃 엔진(Web Layout Engine)이라고 불린다.
- 단어 그대로 웹 페이지에 대한 컨텐츠 및 데이터를 위해 동작하는 엔진이다.
- 대표적 렌더링 엔진들
  * Gecko - 모질라, 파이어폭스
  * Blink - 구글, 오페라
  * Webkit - 사파리
  * Trident - 익스플로러
  * EdgeHTML - 마이크로소프트 엣지

### 자바스크립트 엔진
- 자바스크립트 코드를 해석하고 실행하는 인터프리터다.
- 렌더링 엔진의 HTML 파서가 DOM 생성 프로세스를 하던 중 스크립트 태그를 만나면, 자바스크립트 코드를 실행시키기 위해 자바스크립트 엔진에게 제어권한을 넘겨 주게 된다.
- DOM 트리가 다 형성되지 않은 상태에서 자바스크립트로 해당 DOM을 조작하려고 하면 문제가 발생하기 때문에 `<script>` 태그는 html의 body 태그 제일 아래에 놓는 것이 좋다고 하는 것이다.
- 대표적 렌더링 엔진들
  * Rhino - 모질라
  * SpiderMonkey - 파이어폭스
  * V8 - 구글, 오페라
  * JavascriptCore - 사파리
  * Chakra - 익스플로러, 마이크로소프트 엣지

# 자바스크립트 엔진의 3가지 영역

## 힙(Heap)
메모리 할당이 이루어지는 곳. 동적으로 생성된 객체(인스턴스)는 힙(heap)에 할당된다. 대부분 구조화되지 않는 '더미'같은 메모리 영역을 heap이라 표현한다.

## 호출 스택(Call Stack)
함수가 호출되면 _(LIFO의 규칙을 따르는)_ 스택(stack)에 요청들이 순차적으로 스택 프레임 형태로 쌓이게 된다. 실행이 됨에 따라 하나씩 pop되면서 마침내 모든 실행이 끝나면 스택이 비워진다. 실행 컨텍스트를 공부했다면 이를 이해하기 쉬울 것이다. 참고로 자바스크립트는 단일 호출 스택을 사용한다.

## 이벤트 큐(Event Queue)
자바스크립트에서 비동기로 호출된 event(혹은 task)는 곧바로 call stack에 쌓이지 않고 event(혹은 task)는 _(FIFO의 규칙을 따르는)_ 큐(queue)에서 대기한다. call stack이 비어있는 상황이 되면 event loop가 event queue에 있는 task를 차례대로 호출 스택에 넣게 되고, stack에 들어간 task가 수행되며 pop되는 식으로 하나씩 처리가 되게 된다. 이렇듯 **이벤트 루프의 기본 역할은 큐와 스택 두 부분을 지켜보고 있다가 스택이 비는 시점에 콜백을 실행시켜 주는 것이다.**


## 이해를 도울 대표적 예시
아래 예시에서 비동기인 `first`는 이벤트 큐에 들어갔다가 호출 스택에 들어오느라, 동기인 `second`보다 늦게 실행되었다. event loop를 공부하면서, `setTimeout`이 아주 정확하지는 않다는 것을 깨닫게 되었다.

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
> https://www.zerocho.com/category/Javascript/post/597f34bbb428530018e8e6e2  
> https://asfirstalways.tistory.com/362  
> https://mygumi.tistory.com/173  