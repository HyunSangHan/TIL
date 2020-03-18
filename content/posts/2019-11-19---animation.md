---
title: "Animation의 기초"
date: "2019-11-19T22:12:03.284Z"
template: "post"
draft: false
slug: "animation"
category: "Fronted Basic"
tags:
  - "Fronted Basic"
  - "Css"
description: "JavaScript 애니메이션을 사용하면 JavaScript 특성상 하나의 스레드에서 실행되기 때문에 처리할 양이 많으면 애니메이션이 끊겨 보일 수 있다. 반면 CSS 애니메이션은 다른 스레드에서 작동되기 때문에 훨씬 부드럽게 보일 수 있다. 그럼에도 애니메이션에 동적인 효과를 줘야하거나, CSS로 표현할 수 없는 속성을 지원하기 위해서는 JS 애니메이션이 필요하다."
socialImage: "/media/gutenberg.jpg"
---

<!-- # Animation -->
애니메이션은 CSS와 JS를 활용해 구현할 수 있다. 각각의 장점은 아래와 같다.(장단점은 CSS - JS 간 상대적이기 때문에 장점만 작성했다.)

### CSS 애니메이션
- JavaScript 애니메이션보다 좋은 성능: JavaScript 애니메이션을 사용하면 JavaScript 특성상 하나의 스레드에서 실행되기 때문에 처리할 양이 많으면 애니메이션이 끊겨 보일 수 있다. 반면 CSS 애니메이션은 **다른 스레드에서 작동되기 때문에 훨씬 부드럽게 보일 수 있다.**
- CSS만으로도 [이 정도](https://codepen.io/davidkpiano/pen/wMqXea)의 애니메이션까지 가능(은..) 하다!

### JavaScript 애니메이션
- 중간 제어와 상호 작용이 가능: 마우스, 키보드, 브라우저 등과 같은 상호작용 또는 DOM 이벤트를 통해 **애니메이션에 동적인 변화**가 필요할 때가 있는데, 정적인 상태인 CSS 애니메이션으로 제어하기 힘들기 때문에 JavaScript 애니메이션을 사용해야 한다.
- CSS로 표현할 수 없는 속성 지원: HTML, DOM Attribute은 CSS로 구현할 수 없고 브라우저가 지원하지 않는 속성도 있다. IE 9에서는 CSS 애니메이션을 지원하지 않고 CSS를 이용한 SVG 애니메이션도 지원하는 브라우저가 매우 한정적이다. 이럴 경우 JavaScript 애니메이션을 사용해야 한다.

# 애니메이션을 위한 사전 지식

## @keyframes
`@keyframes` 는 CSS 애니메이션에서 구간을 정하고 각 구간별로 어떤 스타일을 적용시킬지 정하는 문법이다.

### @keyframes 를 사용하기 위 필요한 3가지
1. animation-name : 사용자가 직접 지정한 이름, @keyframes 가 적용될 애니메이션의 이름
2. 스테이지 : from - to 로 0 ~ 100% 의 구간
3. CSS 스타일 : 각 스테이지(구간)에 적용시킬 스타일

```css
@keyframes fadeOut {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
```

또는

```css
@keyframes fadeOut {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
```

위와 같은 방법으로 `keyframes` 정의가 가능하다.  

## Animation
animation 속성은 애니메이션에 이름을 지정하거나 지속시간, 속도 조절 등을 지정할 수 있는 속성을 가지고 있다.

### 애니메이션 속성의 종류
- `animation-name` : @keyframes 이름 (예제에서는 fadeOut 을 사용) `디폴트: none`
- `animation-duratuion` : 타임 프레임의 길이, 키프레임이 동작하는 시간을 설정할 때 사용 `디폴트: 0s`
  * time | initial | inherit
- `animation-timing-function` : 애니메이션 속도 조절 / 그래프 `디폴트: ease`
  * linear | ease | ease-in | ease-out | ease-in-out | cubic-bezier
- `animation-delay` : 애니메이션을 시작하기 전 지연시간 설정 `디폴트: 0s`
- `animation-iteration-count` : 반복 횟수 지정 `디폴트: 1`
- `animation-direction` : 반복 방향 설정 `디폴트: normal`
  * normal | reverse | alternate | alternate-reverse | initial | inherit
- `animation-fill-mode` : 애니메이션 시작 / 끝 상태 제어 `디폴트: none`
  * none | forwords | backwords | both

## Cross-browsing 이슈 해결을 위한 vender-prefix
`@keyframes`과 `animation` 모두 프리픽스를 적용해주어야 한다.(물론, 코드가 좀 길어질 수 있겠음)
- 크롬&사파리 : `-webkit-`
- 파이어폭스 : `-moz-`
- 오페라 : `-o-`
- 인터넷 익스플로러 : `-ms-`

## Animation 속성을 활용한 예시

예를 들어 class 명이 memo인 경우 사라지는 애니메이션을 준다면 아래 코드와 같이 작성 가능하다.

```css
.memo {
  animation-name: fadeOut;
  animation-duration: 4s;
  animation-delay: 1s;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
  animation-direction: alternate;
}
```

class 명이 memo인 경우 1초의 지연시간 후 4초 동안 사라졌다가 4초 동안 나타났다가를 반복하는, 즉 무한으로 깜빡이는 효과를 만들 것이다. 위의 예제 코드를 animation 속성으로 짧게 줄일 수도 있다.

```css
.memo {
  animation: fadeOut 4s 1s infinite linear alternate;
}
```

위의 두 코드는 똑같이 동작하는 같은 코드이다.

_더 많은 예시는 [Mozilla에서 작성한 docs](https://developer.mozilla.org/ko/docs/Web/CSS/animation)에서 확인할 수 있다._

# Transform과 Transition

## Transform
- rotate
  ```css
  transform: rotate( angle );
  ```
  - angle에는 각의 크기를 입력
  - 단위는 deg, rad, grad, turn 등을 사용
  - turn은 1회전, 즉 360deg를 의미함
  - 각도가 음수일 경우 시계 반대방향

- scale
  ```css
  transform: scale( 2.0 ); // 가로 세로 모두 2배 확대
  transform: scale( 2.0, 1.5 ); // 가로 2배, 세로 1.5배 확대
  transform: scaleX( 2.0 ); // 가로 2배 확대
  transform: scaleX( 2.0 ) scaleY( 1.5 ); // 가로 2배, 세로 1.5배 확대
  ```
  - 평면에서의 확대 또는 축소를 의미
  - IE는 버전 10부터 지원

- translate
  ```css
  transform: translate(-50%,-50%);
  ```
  - X축과 Y축을 따라 지정된 거리만큼 요소를 이동시킬 때 사용함

- transform-origin
  ```css
  transform-origin: x축 y축;
  // px, 백분율(%), left, center, right 중에서 사용 가능
  ```

### Transform 작성 예시
```css
.scaled {
  transform: scale(2, 0.5); /* Equal to scaleX(2) scaleY(0.5) */
  transform-origin: left;
}
```

```css
@keyframes spinner {
  from {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  to {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}

.loading {
  animation: spinner 1.2s steps(12) infinite;
}
```  

## Transition
- property : transition을 적용시킬 속성을 정함
  * none | all | property | initial | inherit
- timing-function : transition의 진행 속도를 정함
  * ease | linear | ease-in | ease-out | ease-in-out | step-start | step-end | steps( n, start|end ) | cubic-bezier( n, n, n, n ) | initial | inherit
- duration : transition의 총 시간을 정함
  * time | initial | inherit
- delay : transition의 시작을 연기
  * time | initial | inherit
- initial : 기본값으로 설정
- inherit : 부모 요소의 속성값을 상속

### Transition 작성 예시
```css
.trans {
  -webkit-transition:width 2s, height 2s, background-color 2s, -webkit-transform 2s;
  transition:width 2s, height 2s, background-color 2s, transform 2s;
}
```

```css 
/* property name | duration */
transition: margin-left 4s;

/* property name | duration | delay */
transition: margin-left 4s 1s;

/* property name | duration | timing function | delay */
transition: margin-left 4s ease-in-out 1s;

/* Apply to 2 properties */
transition: margin-left 4s, color 1s;

/* Apply to all changed properties */
transition: all 0.5s ease-out;
```

---

> [참고자료]  
> https://developer.mozilla.org/ko/docs/Web/CSS/animation  
> https://developer.mozilla.org/ko/docs/Web/CSS/CSS_Transitions/Using_CSS_transitions  
> https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/scale  
> https://developers.google.com/web/fundamentals/design-and-ux/animations/css-vs-javascript?hl=ko  
> https://pro-self-studier.tistory.com/m/108  
> https://www.codingfactory.net/11168