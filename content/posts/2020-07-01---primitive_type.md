---
title: long vs Long
date: "2020-07-01T00:00"
template: "post"
draft: false
slug: "primitive-type"
category: "Java"
tags:
  - "Computer Science"
  - "OS"
  - "Java"
  - "Comparison"
  - "Performance"
description: "원시타입(primitive type)과 참조타입(reference type)의 차이를 통해 long과 Long의 차이를 알아본다."
---

원시타입(primitive type)과 참조타입(reference type)의 차이를 통해 long과 Long의 차이를 알아본다.

## Stack vs Heap
[[운영체제 메모리 구조]](/posts/os-memeory)에서 다뤘었기 때문에 간단히만 다루고 넘어간다.

#### Stack
액세스(생성과 삭제 등)가 모두 매우 빠르다.

#### Heap
'비교적' 액세스가 느리다.(하지만 현대의 하드웨어는 성능이 좋기 때문에 이를 감안하면 절대적으로 느리다고 볼 수는 없다고 한다.)

## 원시타입(Primitive Type) vs 참조타입(Reference Type)

#### 원시타입
- 정수, 실수, 문자, 논리 리터럴 등 `실제 데이터 값을 저장`하는 타입
- 메모리 중 `Stack` 영역에 저장된다.

#### 참조타입
- 객체(Object)의 `주소를 저장하여 참조`하는 타입
- 메모리 중 `Heap` 영역에 실제 객체가 저장되며 Stack 영역에는 그 실제 객체의 주소만 저장된다. 따라서 객체를 사용할 때에는 그 참조 변수에 주소가 저장된 객체를 불러와 사용한다.

## 박싱(Boxing)과 언박싱(Unboxing)

#### 박싱
`long`과 같은 `원시타입`을 `Long`과 같은 `참조타입` 형태로 감싸는 것

#### 언박싱
`Long`과 같은 `참조타입`을 `long`과 같은 `원시타입` 형태로 벗겨내는 것

## `long` vs `Long`

### long
- 원시 타입 형태이다.
- 값을 가져야만 한다.(`null`이 될 수 없다!)
- 제네릭 타입의 파라미터로 넣을 수 없다.

### Long
- 참조 타입(즉, 객체) 형태이다.
- `null`이 될 수 있다.
- `Object`, `Number`, `Long` 타입을 파라미터로 받는 함수에 인자로 넣을 수 있다. 심지어 `long` 타입을 파라미터로 받는 함수에도 인자로 `Long`타입을 넣을 수 있는데, 이는 auto-unboxing이라는 게 지원되기 때문이다.(Long을 long으로 언박싱해서 넣어주는 것)
- 제네릭 타입의 파라미터로 넣을 수 있다. (ex: `List<Long>`)
- 자바 직렬화 메커니즘에 의해 `직렬화(serialized)`, `역직렬화(deserialized)`될 수 있다.
- 언박싱해서 값을 써야해서 원시 타입인 `long`보다 약간의 오버헤드가 더 있지만, 현대 사회(?)의 하드웨어 관점에서는 그 차이가 크진 않다.

### long과 Long 비교 실험
```java
// 원시 타입의 long
long a1 = 1L;
long b1 = 1L;
System.out.println(a1 == b1); // true

// 참조 타입의 Long
Long a2 = 1L;
Long b2 = 1L;
System.out.println(a2 == b2); // false (레퍼런스 비교라서, 값은 같지만 다른 레퍼런스로 인해 false)
System.out.println(a2.equals(b2)); // true (값 비교라서, 값이 같으므로 true)
```

---

> [참고자료]  
> https://stackoverflow.com/questions/21034955/when-to-use-long-vs-long-in-java  
> https://kounjeong.tistory.com/21  
> https://velog.io/@gillog/%EC%9B%90%EC%8B%9C%ED%83%80%EC%9E%85-%EC%B0%B8%EC%A1%B0%ED%83%80%EC%9E%85Primitive-Type-Reference-Type  
> 인프런  
