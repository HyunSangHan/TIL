---
title: Browser Rendering
date: "2020-05-02T11:15"
template: "post"
draft: false
slug: "browser-rendering"
category: "Frontend Basic"
tags:
  - "Browser"
  - "DOM"
  - "Css"
  - "JavaScript"
  - "Frontend Basic"
  - "Performance"
description: "HTML을 파싱하여 DOM tree를, CSS를 파싱하여 CSSOM tree를 만들고 이 둘을 조합해 Render tree를 만든다. 이를 배치하고 그리는 과정이 바로 이전 포스트에서 다룬 Reflow와 Repaint이다."
---

# 브라우저 기본구조
브라우저의 전반적인 구조는 아래와 같다. 오늘 주제인 브라우저 렌더링은 `렌더링 엔진`에서 일어난다.

![Browser Structure](/media/browser_structure.png)

- User Interface(유저 인터페이스) : 주소 표시줄, 이전/다음 버튼, 북마크 메뉴 등. 요청한 페이지를 보여주는 창을 제외한 나머지 모든 부분
- Browser Engine(브라우저 엔진) : `User Interface`와 `Rendering Engine` 사이의 동작을 제어
- Rendering Engine(렌더링 엔진) : 요청한 콘텐츠 표시. HTML 요청이 들어오면 HTML과 CSS를 파싱하여 화면에 표시
- Networking(통신): HTTP 요청과 등 네트워크 호출에 사용
- JavaScript Interpreter(자바스크립트 해석기 또는 자바스크립트 엔진) : 자바스크립트 코드를 해석하고 실행. Chrome에서는 V8 엔진을 사용
- UI Backend(UI 백엔드) : 기본적인 위젯(콤보 박스 등..)을 그림
- Data Persistence(데이터 저장소) : 쿠키, 로컬 스토리지 등 클라이언트 사이드의 데이터를 저장

# 렌더링 엔진의 동작 과정
1. HTML 문서 파싱 후 DOM tree 구축(DOM Parsing)
2. 외부 CSS 파일 파싱 후 CSSOM tree 구축(CSS Parsing)
3. 이 둘을 조합하여 Render tree(렌더 트리)를 구축(Attachment)
4. 렌더 트리 배치(Layout 혹은 Reflow)
5. 렌더 트리 그리기(Rasterizing 혹은 Repaint)  

위 과정 중에서, Reflow와 Repaint는 앞 글에서 다루었으니 파싱하는 과정에 대해서만 더 알아보도록 하자.  

1. `Bytes`
2. `Characters`
3. `Tokens`
4. `Nodes`
5. `DOM` 또는 `CSSOM`  

위 순서로 파싱이 된다.  

- `Bytes` -> `Characters` : 원시 바이트(Raw Bytes)를 읽어와 문자열로 변환하는 과정이다.
- `Characters` -> `Tokens` : 토큰화(Tokenizing)라고 한다. 문자열을 고유 토큰(Tokens)으로 변환한다. 각 토큰은 특별한 의미와 고유한 규칙을 가진다.
- `Tokens` -> `Nodes` : 렉싱(Lexing)이라고 한다. 토큰을 해당 속성 및 규칙을 정의한 객체(Nodes)로 변환한다.
- `Nodes` -> `DOM` 또는 `CSSOM` : 노드의 상위-하위 관계를 통해 트리 구조로 변환한다.

# 렌더링과 관련해 알아둬야 할 기본적인 것들

이미 습관처럼 하고 있는 것들이겠지만, 그 이유를 한번 짚고 넘어가자.

### 1. CSS는 `<head>` 태그 안에서 정의하여 빠르게 리소스를 받을 수 있도록 해야한다.
CSS는 DOM 파싱과 마찬가지로, **렌더 트리 구축을 위해 반드시 파싱**해둬야하는 리소스이다. 그리고 자바스크립트에서 스타일 정보를 요청하는 경우, CSS가 파싱되지 않은 상태라면 스크립트 에러가 발생할 수 있다.

### 2. 자바스크립트는 `<head>` 태그가 아닌 `<body>` 태그가 닫히기 직전에 삽입하는 게 좋다.
DOM 파싱이 일어나다가도 자바스크립트 코드를 만나면, **진행하던 파싱을 중단**하고 자바스크립트 엔진에게 그 제어권을 넘겨주게 된다.

### 3. 화면에 표시되지 않는 노드들은 렌더 트리에 포함되지 않는다.
예를 들어 `<head>` 태그와 같은 비시각적 DOM 노드는 렌더 트리에 추가되지 않는다. `display: none;`인 노드들 또한 그러하다. 반면에 `visibility: hidden;`은 눈에서만 안보일 뿐, 화면상으로 공간을 차지하기 때문에 렌더 트리에 포함된다는 점이 다르다.

---

> [참고자료]  
> https://beomy.github.io/tech/browser/browser-rendering/  
> https://yoonjaepark.github.io/2018-12-25/repaint-reflow  
> https://developers.google.com/web/fundamentals/performance/critical-rendering-path/render-tree-construction  
