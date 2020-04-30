---
title: Document Fragment
date: "2020-04-29T23:00"
template: "post"
draft: false
slug: "document-fragment"
category: "JavaScript"
tags:
  - "JavaScript"
  - "DOM"
description: "여러 노드를 하나의 그룹으로 감싸 다른 곳으로 전달하게 해주는 Wrapper 노드이다. 리액트에서의 Fragment와 의미상 비슷한 개념이라고 볼 수 있겠다."
---

사실 React에서 `<Fragment>`의 개념은 어렵지 않게 접할 수 있다. 최상위 노드를 하나만 둬야하는 경우가 많다보니 Wrapper로 종종 쓰게 되기 때문이다(물론 그냥 `<div>`로 감싸는 사람도 있지만.). 하지만 이는 리액트에만 있는 개념이 아니라 JavaScript에 존재하는 개념이라는 것을 알게 되었다. 성능 최적화를 위해서 활용될 수 있다고 하니 공부해두자.

# Document Fragment를 만드는 방법
`<div>` 엘리먼트를 만들고자 할 때 아래와 같이 작성하면 된다는 것을 알 것이다.

```js
var element = document.createElement('div');
```

`Document Fragment`를 만들 때에도 비슷하다. 하지만, 빈 태그(React에서는 `<> </>`)인 셈이니, 인자로는 아무 것도 넣지 않는다.

```js
var documentFragment = document.createDocumentFragment();
```

이렇게 만들어진 `Document Fragment`는 DOM트리 내부에 존재하는 게 아니라 **메모리상에만** 따로 존재하게 된다. DOM에다가 바로 작업을 하는 게 아니라, 본격적인 DOM 조작에 앞서 잠시 보관해두는 껍데기인 것이다.

# Document Fragment를 활용한 성능 최적화
어떤 때에, 왜 `Fragment`가 유용하게 쓰일 수 있다는 걸까?
1. DOM객체는 트리구조로 되어있기 때문에, 특정 엘리먼트에 접근하는 것을 줄일수록 좋다. `Document Fragment`는 DOM트리와 별개로 존재하므로 접근 속도가 빠르다.
2. Reflow는 성능에 영향을 미치는 주요 요인중 하나로, Reflow를 줄일수록 좋다. `Document Fragment`를 이용해서 작업을 모아놨다가 한번에 DOM에 적용한다면 Reflow를 최소화할 수 있을 것이다.

예시를 보자.  

반복문을 돌면서 어떤 엘리먼트 하위에 자식 엘리먼트를 추가하는 상황이다.

```js
function addHundredTimes() {
    var target = document.getElementById('target');

    for (var i = 0; i < 100; i++) {
        var div = document.createElement('div');
        div.innerText = 'targetChild';
        target.appendChild(div);
    }
}
```

위 코드에서는, 결과적으로 target 엘리먼트에 자식 엘리먼트를 총 100차례 추가했다. 아래와 같이 `Document Fragment`를 이용한다면, 100차례의 자식 엘리먼트 추가를 `Document Fragment`에다가 해두고, 그 덩어리를 한번에 target 엘리먼트 하위에 추가한다. 이로써 DOM 조작 횟수를 최소화할 수 있는 것이다.

```js
function addOnceWithFragment() {
    var target = document.getElementById('target');
    var fragment = document.createDocumentFragment();
 
    for (var i = 0; i < 100; i++) {
        var div = document.createElement('div');
 
        div.innerText = 'targetChild';
        fragment.appendChild(div);
    }
    target.appendChild(fragment.cloneNode(true));
}
```

--- 

> [참고자료]  
> https://untitledtblog.tistory.com/44  
> https://programmer-seva.tistory.com/60  