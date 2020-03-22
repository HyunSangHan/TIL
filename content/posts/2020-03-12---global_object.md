---
title: JavaScript의 전역 객체
date: "2020-03-12T21:24:32"
template: "post"
draft: false
slug: "global-object"
category: "JavaScript"
tags:
  - "JavaScript"
  - "Browser"
  - "NodeJS"
  - "DOM"
  - "BOM"
  - "Frontend Basic"
description: "자바스크립트의 전역 객체는 모든 객체의 최상위 객체를 의미한다. 브라우저 환경에서는 window, 노드 환경에서는 global이 전역 객체이다."
---

자바스크립트의 전역객체는 모든 객체의 최상위 객체를 의미한다. 브라우저 환경에서는 `window`, 노드 환경에서는 `global`이라는 전역객체가 있다.

# 전역객체의 특징
- 전역 스코프(Global Scope)를 갖는다.
- 전역 객체는 실행 컨텍스트에 컨트롤이 들어가기 이전에 생성된다.
- 전역 변수는 전역 객체의 property이다.
- 전역 함수는 전역 객체의 method이다.
- 자식 객체를 사용할 때 전역 객체의 기술은 생략할 수 있다. 예를 들어 document 객체는 전역 객체 window의 자식 객체이므로, window.document.…와 같이 써도 되고 생략해도 된다.

# window 객체
- BOM, DOM의 개념과 관련된 객체이다.
- screen, navigator, history, location, document 등 자식 객체를 가진다.
- setInterval, setTimeout, alert, confirm 등 전역 메서드를 가진다.

# global 객체
- console, buffer, module, exports, require, process, __filename, __dirname 등 자식 객체를 가진다.
- setInterval, setTimeout, stream 등 전역 메서드를 가진다.

---

> [참고자료]  
> https://chrismare.tistory.com/m/entry/Object-ModelDOM-BOM?category=973304  
> https://poiemaweb.com/js-global-object  
> https://tutorialpost.apptilus.com/code/posts/nodejs/ns-global-object