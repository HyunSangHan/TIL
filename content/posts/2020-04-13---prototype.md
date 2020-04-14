---
title: JavaScript의 prototype
date: "2020-04-13T10:00"
template: "post"
draft: false
slug: "prototype"
category: "JavaScript"
tags:
  - "JavaScript"
  - "Concept"
  - "Design Pattern"
description: "Java와 같은 클래스 기반 언어에서는 Class를 통해 객체를 생성하는데, JavaScript는 Class가 없어 Function과 prototype을 통해 객체를 만든다. 이 때문에 자바스크립트는 프로토타입 기반 언어라고도 불린다. Function의 기본 property인 prototype과 객체의 기본 property인 __proto__, 그리고 프로토타입 체인에 대해 알아본다."
---

Java와 같은 클래스 기반 언어에서는 `Class`를 통해 객체를 생성하는데, JavaScript는 Class가 없어 Function과 `prototype`을 통해 객체를 만든다. 이 때문에 자바스크립트는 프로토타입 기반 언어라고도 불린다.


## 자바스크립트에도 Class가 있다?
ECMA2015를 통해 `Class`라는 문법이 추가되었다. 이는 문법이 추가된 것일 뿐, JavaScript의 `Class`는 사실 **함수(Function)**이다. 객체는 언제나 함수로 생성된다. 어떻게 만들어지는지 보자.

```js
function Person() {
  this.eye = 2;
  this.nose = 1;
}

const hyunsang = new Person();
console.log(hyunsang.eye); // 2
```

객체 리터럴도 마찬가지다. 아래 두 예시는 사실 같은 코드인데, 여기서 `Object`가 JavaScript에서 기본적으로 제공하는 **함수**이기 때문이다. 위 예시의 `Person`의 경우와 비슷한 걸 알 수 있다.

```js
const obj1 = {};
const obj2 = new Object();
```

# 프로토타입(Prototype)
함수가 정의될 때, 아래 2가지 일이 일어난다.

1. 함수에 Constructor(생성자) 자격 부여 : new를 통해 객체를 만들어 낼 수 있게 됨
2. 함수에 대한 프로토타입 객체 생성 및 연결 : 함수에는 `prototype`이라는 property가 생기고, 프로토타입 객체에는 `constructor`가 생겨서 서로에게 직접 접근할 수 있게 됨

참고로 프로토타입 객체에 접근하는 방법은 2가지가 있다.

- **함수에서** `prototype`이라는 property를 통해 접근하는 방법
- 해당 함수를 통해 찍어낸 **객체들에게서** `__proto__`(= Prototype Link)이라는 property를 통해 접근하는 방법

다시 한번 강조하지만, "함수에서는 `prototype`, 객체에서는 `__proto__`"라는 걸 기억해야 헷갈리지 않는다.

심지어 프로토타입 객체 또한 그 자체로 객체이기 때문에, 앞서 얘기한 `constructor` 외에 `__proto__`라는 property도 기본적으로 갖고 있게 된다. 이를 통해 등장하게 되는 개념이 `프로토타입 체인`이다.

# 프로토타입 체인(Prototype Chain)
현 스코프 내에서 값을 못찾을 경우 상위 스코프로 올라간다는 "스코프 체인"이라는 개념을 알 것이다. 이와 닮은 개념이다. (변수를 찾아 올라가는 게 '스코프 체인', 프로퍼티를 찾아 올라가는 게 '프로토타입 체인')  
`프로토타입 체인`에서도 현 객체에서 property를 못찾으면 상위 프로토타입으로 계속해서 거슬러 올라가게 된다. 이렇게 프로토타입 체인을 형성해주는 게 `__proto__` 때문이다. 일반 객체의 `__proto__`가 프로토타입 객체를 가리키고 있는데, 프로토타입 객체도 `__proto__`가 있으니 이를 통해 상위 프로토타입 객체로 넘어갈 수 있는 것이다.  
정리하면, `__proto__`라고 하는 Prototype Link가 모여 마침내 Prototype Chain을 만들어내는 것이다. 예시를 보자.

```js
function Person() {
  this.eye = 2;
  this.nose = 1;
}

const hyunsang = new Person();
console.log(hyunsang.eye); // 2

Person.prototype.mouth = 1;
console.log(hyunsang.mouth); // ?
```

여기서 `hyunsang.mouth`의 결과는 어떻게 될까? `hyunsang`이라는 객체는 `mouth`라는 property를 갖고 있지 않으니까 `undefined`일까?  

아래에서 `hyunsang` 객체가 어떻게 되어있는지를 보자.

```console
> console.log(hyunsang)
Person {eye: 2, nose: 1}
    eye: 2
    nose: 1
    __proto__:
        mouth: 1
        constructor: ƒ Person()
        __proto__: Object
```

`hyunsang`이라는 객체는 `mouth`라는 property를 갖고 있지 않다는 사실은 맞다. 하지만 `__proto__`라는 프로토타입 링크를 통해 간접적으로 가지고 있다. 따라서 프로토타입 체인을 따라 `mouth`를 탐색해서 `console.log(hyunsang.mouth)`의 결과는 `undefined`가 아닌 `1`이 되게 된다.
이와 마찬가지로, 모든 객체에서 `toString` method를 쓸 수 있는 이유도 프로토타입 체인의 최상위인 `Object`의 프로토타입 객체 내에 이미 정의된 method이기 때문이다!

---

> [참고자료]  
> https://developer.mozilla.org/ko/docs/Web/JavaScript/Guide/Inheritance_and_the_prototype_chain
> https://medium.com/@bluesh55/javascript-prototype-%EC%9D%B4%ED%95%B4%ED%95%98%EA%B8%B0-f8e67c286b67  