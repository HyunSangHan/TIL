---
title: 이벤트 전파와 위임
date: "2020-01-29T21:12:32.169Z"
template: "post"
draft: false
slug: "event-bubbling-capturing-delegation"
category: "JavaScript"
tags:
  - "JavaScript"
  - "Event"
description: "이론적으로만 알고 있었던 개념인데 실전에서 드디어 만나게 되어 반가운 마음에 이벤트 전파(버블링, 캡쳐링), 그리고 그를 이용한 위임에 대해 정리해보기로 했다."
---

나를 비롯한 요즘 사람들(?)은 React 등 라이브러리/프레임워크를 써서인지, 이런 개념들을 실전에서 마주치기가 비교적 어려워졌다고 본다. 개념적으로 알고 있었지만 실전에서 겪어본 적 없던 상황에서, 마침내 어제 실전에서 마주치게 되었다. 반가운 마음으로, 마주친 김에 정리해보았다.

# 이벤트 버블링(Event Bubbling)
자식의 이벤트가 부모에도 전달되는 것을 말한다.  

내가 즐겨 읽는 [이화랑님의 블로그](https://leehwarang.github.io/)에서는 이벤트 버블링에 대해 이렇게 비유되어 있었는데, 이해하기 좋아서 여기에 인용해본다.  

> 다이어리 위에 책, 책 위에 마우스가 올려져 있을 때 사람이 마우스를 눌렀다면.. 마우스가 눌린 것인가? 책이 눌린 것인가? 다이어리가 눌린 것인가? 아니면 마우스와 책과 다이어리가 모두 눌린 것인가?

예시를 보자.

```html
<div id="first">
    <div id="second">
        <div id="third">
        </div>
    </div>
</div>
```

- 위와 같은 구조가 있을 때 div#third를 클릭한 경우, 부모와 조상 태그인 second, first 순으로 같은 클릭 이벤트가 전파된다.
- 브라우저는 이벤트가 발생한 엘리먼트 중 가장 말단에 있는 것부터 시작해서, 상위로 올라가며 이벤트가 등록되어있는 엘리먼트를 탐색한다(= 이벤트리스너를 찾는다).
- 이벤트가 등록되어있는 엘리먼트를 만나면 해당 콜백함수를 실행한다.

(물론 위 예시에서는 애초에 이벤트리스너가 없기 때문에 아무 일이 일어나진 않으니 의아해하지 않기 바란다.)


# 이벤트 캡쳐링(Event Capturing)
버블링의 역순이다. 최상위 요소부터 시작해서 처음 이벤트가 발생한 요소까지 탐색한다.

- 버블링은 기본적으로 true여서 아무 설정 없이 발생하는데, 이 흐름을 캡쳐링으로 변경하려면 이벤트 등록(`addEventListner`) 시에, 세 번째 인자로 `{ capture: true }` 를 줘야 한다.


# 이벤트 위임(Event Delegation)
이벤트가 전파된다는 특성을 이용해서, 상위 태그에 이벤트 리스너를 붙여두는 것이다.

### 언제 쓸까?
- 태그마다 동일한 이벤트리스너를 반복적으로 붙이는 작업이 효율적이지 않다고 판단될 때
- 동적으로 추가된 엘리먼트에 대해서도 기존의 엘리먼트들처럼 이벤트 발생에 따른 콜백을 실행해주고 싶을 때  

이 중, 나는 jQuery와 ajax를 다루다가 이 필요성 때문에 이벤트 위임을 쓰게 되었다. 본래 아래와 같이 작성되어있던 코드였는데, ajax로 DOM에 동적으로 그린 이 엘리먼트에 분명 `.comment-submit-now` 클래스가 있는데도 이벤트가 먹히지 않아서 이상했다.

```js
$(".comment-submit-now").on("click", function(event) {
    event.preventDefault();
    ...
}
```

이는 `.comment-submit-now` 클래스를 가진 엘리먼트에 직접 클릭 이벤트를 등록하는 경우였기 때문에, 동적으로 불러온 엘리먼트에는 이벤트가 등록되어있지 않았던 것이다. 이를 아래와 같이 `document`를 통해 이벤트 위임을 적용하면서 해결했다.

```js
$(document).on("click", ".comment-submit-now", function(event) {
    event.preventDefault();
    ...
}
```

---

> [참고자료]  
> https://www.zerocho.com/category/JavaScript/post/57432d2aa48729787807c3fc  
> https://leehwarang.github.io//docs/tech/2019-09-09-event.html  