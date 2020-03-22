---
title: HTMLCollection vs NodeList
date: "2020-03-09T21:24:32"
template: "post"
draft: false
slug: "htmlcollection-nodelist"
category: "JavaScript"
tags:
  - "JavaScript"
  - "Browser"
  - "DOM"
  - "Frontend Basic"
  - "Comparison"
description: "DOM을 조작할 때 접하게 되는 유사배열들이다. Live하냐 Static하냐의 차이가 중요한데, 이를 인지하고 있지 못하면 언젠간 버그를 마주칠 수밖에 없겠다."
---

DOM을 조작할 때 접하게 되는 유사배열들이다. `getElementsByClassName()`과 `querySelectorAll()`이 거의 같은 것이라 인식하고 있는 사람들이 있을 것이다. 결정적으로 다른 부분이 있다. 바로 그 결과가 각각 `HTMLCollection`과 `NodeList`라는 차이이며, 이는 즉 Live하냐 Static하냐이다. 이를 인지하고 있지 못하면 언젠간 버그를 마주칠 수밖에 없겠다.

# HTMLCollection
```js
document.getElementsByClassName('hyunsang');
```

이처럼, document.getElementsByClassName(), document.getElementsByTagName()과 같은 메서드 또는 element.children과 같은 속성에 의해 반환된다. 중요한 특징은, 실시간으로 업데이트되는 **라이브(Live)** 콜렉션이라는 점이다. 예컨대 만일 위와 같이 얻어낸 콜렉션에서, `hyunsang`이라는 클래스네임을 가진 엘리먼트 중 하나를 pop시키면 그 즉시 콜렉션에 반영된다는 것이다. **이 과정에서 인덱스가 달라지게 되며,** 이를 개발자가 인지하지 못하고 있는 경우 버그가 발생하게 되겠다.

# NodeList
```js
document.querySelectorAll('.hyunsang')
```

위와 같이 `document.querySelectorAll()` 메소드에 의해 반환되는 `NodeList`는 **정적(Static)** 콜렉션으로, DOM의 변경 사항이 실시간으로 반영되지 않는다.

# 버그 픽스 사례
사실 내가 이 차이점에 대해서 알게 된 것은 오픈소스 때문이다. 오픈소스 컨트리뷰톤을 통해 [mochajs](https://github.com/mochajs/mocha)에 대한 기여를 막 시작할 때였는데, 같은 팀이었던 한 성균관대 학생이 관련 버그를 찾아 수정했다. 알면 정말 별거 아니지만, 모르면 끝까지 이유를 찾을 수 없는 버그였을 것이다. 이 때 뭔가 감명을 받아 찾아봤던 기억이 난다.  

`unhide`라는 함수가 `getElementsByClassName`을 통해 `HTMLCollection`을 만들어내고 이를 for 반복문을 돌며 className을 replace하게 하는 코드가 있었다. 그런데 `HTMLCollection`은 **Live**하므로, 짝수번째 요소를 건너뛰는 문제가 있었던 것이다. [이를 해결한 Pull Request](https://github.com/mochajs/mocha/pull/4051)에서는 while 반복문을 돌며 첫번째 요소의 className을 replace하는 방식으로 해결했다. queue 같은 컨셉으로 맨 앞에서부터 차례대로 replace하여 요소를 건너뛰는 일이 없게 한 것이다. 아래는 당시 수정한 코드다.

```diff
function unhide() {
  var els = document.getElementsByClassName('suite hidden');
-  for (var i = 0; i < els.length; ++i) {
-    els[i].className = els[i].className.replace('suite hidden', 'suite');
+  while (els.length > 0) {
+    els[0].className = els[0].className.replace('suite hidden', 'suite');
  }
}
```

이 말고 다른 수정 방법은 뭐가 있었을까? 이런 것들을 생각해봤다.
1. while문을 통해 첫번째 요소부터 작업하기(= 위 방법)
2. for문을 쓰되 마지막 인덱스의 요소부터 작업하기(단, 이는 위 케이스의 경우와 같이 순서가 별로 상관이 없는 상황에 제한적으로 가능하겠음)
3. for문을 쓰고 맨앞 요소부터 작업하되, 인덱스가 하나씩 당겨진다는 점을 감안하여 i를 1씩 줄이기
4. 유사배열인 `HTMLCollection`을 배열로 바꾸어 for문을 써 작업하기
5. `querySelectorAll()` 메서드를 사용해서 처음부터 정적 콜렉션으로 만든 후 작업하기

또 다른 아이디어가 있으신 분은 댓글을 달아주시면 좋겠다.

---

> [참고자료]  
> https://im-developer.tistory.com/110  
