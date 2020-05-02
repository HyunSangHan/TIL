---
title: Reflow와 Repaint
date: "2020-05-01T23:15"
template: "post"
draft: false
slug: "reflow-and-repaint"
category: "Frontend Basic"
tags:
  - "JavaScript"
  - "DOM"
  - "Browser"
  - "Css"
  - "Frontend Basic"
  - "Performance"
description: "수정된 Render tree를 다시 렌더링하는 과정에서 발생한다. Reflow는 위치와 크기를 계산, Repaint는 시각적인 요소를 표현하는 과정이다. 당연히 필요한 과정이지만 효율적으로 컨트롤하지 못하면 웹애플리케이션의 성능을 떨어뜨리는 주된 요인이 된다."
---

`Reflow`와 `Repaint`는 수정된 Render tree를 다시 렌더링하는 과정에서 발생한다. 당연히 필요한 과정이지만 효율적으로 컨트롤하지 못하면 웹애플리케이션의 성능을 떨어뜨리는 주된 요인이 된다.

# Reflow
- 엘리먼트의 **위치와 크기** 등 레이아웃적인 요소들을 다시 계산하여 렌더 트리를 재배치하는 과정이다.
- 구조에 따라, 엘리먼트 하나를 변경해도 하위 엘리먼트나 상위 엘리먼트 등에 영향을 미칠 수 있다. Opera에 따르면, 대부분의 리플로우는 페이지 전체의 렌더링을 다시 일으킨다고 한다.

# Repaint
- 렌더 트리의 **시각적인 요소**가 표현되는 과정이다.
- 레이아웃에는 영향을 주지 않지만 가시성에는 영향을 주는 스타일 속성이 변경되면 발생한다.
- `배경색` > `배경이미지` > `테두리` > `자식` > `아웃라인` 순으로 paint된다고 한다.

# Reflow와 Repaint를 고려해 성능을 최적화하는 방법들
영향받는 엘리먼트의 개수, 혹은 변경 횟수 자체를 최소화하도록 설계하면 될 것이다. 어떤 방법들이 있는지 보자.
- DOM 구조상 부모가 아니라 최대한 자식쪽에 해당하는 스타일을 변경하자. Reflow&Repaint가 발생할 경우, 일부 노드로 제한할 수 있다.
- 인라인 엘리먼트 사용을 지양하자. 외부 스타일 클래스를 사용하면 단 한번만 Reflow를 발생시킬 수 있다.(코드 가독성을 위해서도 좋다.)
- CSS의 하위 선택자(Selector)는 가급적 적게 쓰자. 스타일을 적용하기 위해 하위 선택자를 모두 훑는 과정이 있기 때문이다.
- 애니메이션 등 변경이 잦은 요소는 `absolute` 또는 `fixed`의 position을 사용하자. 전체 노드에서 분리될 수 있어 Reflow의 영향을 줄일 수 있다.
- `cssText` 및 `class`를 활용해 스타일 변경은 되도록 한번에 처리하자.
- `Document Fragment`를 활용해 DOM 사용을 최소화하자.
- 테이블 레이아웃 사용을 지양하자. 조금만 변화가 일어나도 테이블 전체가 Reflow되기 때문이다. 참고로 `table-layout: fixed;` 속성을 주는 것이 디폴트값인 `auto`에 비해 성능면에서 더 좋다고 한다.
- IE의 경우, CSS에서의 JS표현식을 피하자. Reflow 될 때마다 연산을 다시하게 된다.
- 캐시를 활용하자. 수치에 대한 스타일 정보를 변수에 저장하면 정보 요청 횟수를 줄일 수 있다.
- `position: relative;` 사용 시 주의하자. CSS Calculation이 발생할 경우 `Box model Calculation` -> `Normal Flow` -> `Positioning`의 순서로 이루어지는데, position이 `fixed` 혹은 `absolute`일 경우, 또는 `float` 속성을 가진 경우  별도의 Positioning 계산이 없다. 반면에 `position: relative;` 와 함께 `top`, `left` 등 위치값을 가진 요소는 이 과정에서 상대적으로 큰 비용이 든다.

---

> [참고자료]  
> https://webclub.tistory.com/346  
> https://oyg0420.tistory.com/entry/브라우저의-Reflow-와-Repaint  
> https://gloriajun.github.io/frontend/2018/10/23/frontend-reflow-repaint.html  
> https://daumui.tistory.com/12  
