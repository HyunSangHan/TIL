---
title: 이벤트 객체
date: "2020-01-28T22:40:32.169Z"
template: "post"
draft: false
slug: "event-object"
category: "Javascript"
tags:
  - "Javascript"
  - "Event"
description: "DOM에 대한 이벤트에 연결한 함수는 이벤트 객체를 매개변수로 사용할 수 있는데, 이벤트 객체에는 여러 메소드와 정보가 들어있다. 이벤트를 제어할 수 있게 해주는 두 가지 요소는 이벤트리스너와 콜백이다."
---

# Event Listener + Callback
이벤트를 제어할 수 있게 해주는 두 가지 요소는 이벤트리스너와 콜백이다.
1. DOM 엘리먼트에 이벤트를 등록(`addEventListener`)
2. 등록한 이벤트가 발생했을 때 실행할 함수를 정의(`callback`)  

# 이벤트 객체
DOM에 대한 이벤트에 연결한 함수는 이벤트 객체를 매개변수로 사용할 수 있는데, 이벤트 객체에는 여러 메소드와 정보가 들어있다.  

이벤트 객체 내 대표적인 메소드로 `preventDefault`와 `stopPropagation` 등이 있다.
- `event.preventDefault()`: 태그의 기본 동작을 하지 않게 막아주는 역할
- `event.stopPropagation()`: 태그를 클릭 시 부모에게 이벤트 버블링이 이루어지지 않도록 하는 역할

메소드 외에, 이벤트 객체에는 많은 정보들이 들어있다. 예를 들면 아래와 같다.
- `event.target`: 이벤트가 발생한 태그의 정보
- `event.currentTarget`: 이벤트가 바인딩된 태그의 정보
- `event.pageX`, `event.pageY`: 클릭한 좌표(각각 x, y)
- `event.key`: 키보드의 어떤 키를 쳤는지

---

> 참고자료  
> https://www.zerocho.com/category/JavaScript/post/57432d2aa48729787807c3fc  
> https://leehwarang.github.io//docs/tech/2019-09-09-event.html