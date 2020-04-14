
> [참고자료]  
> https://poiemaweb.com/es6-iteration-for-of  
> https://infoscis.github.io/2018/01/31/ecmascript-6-iterators-and-generators/  

# 이터레이터(Iterator)와 제너레이터(Generator)
컬렉션에서 위치를 추적하는 방법은 변수를 통해 for 루프를 사용하여 데이터를 반복하는 방법이 있고, 컬렉션의 다음 요소(next)를 반환하는 `Iterator` 객체를 사용하는 방식이 있다. JavaScript에서는 `Iterator`와 `Generator`를 ES6에서 도입하였다. `Iterator`는 반복을 위해 설계된, 특별한 인터페이스를 가진 객체이다. `Generator`는 `Iterator`를 반환하는 함수이다.

## 이터레이터(Iterator)
- `Iterator`는 반복을 위해 설계된 특정 인터페이스가 있는 객체로, `next`라는 메서드를 가지고 있어 컬렉션의 다음 요소를 얻을 수 있다.
- `next()`라는 메서드 실행 결과의 객체에는 `value`와 `done`이라는 2가지 property가 있다. 전자는 next(다음)에 대한 값이고, 후자는 반환할 값이 없는지에 대한 여부(boolean)이다.
- [Symbol.iterator] 프로퍼티를 가진 객체를 `Iterable`하다고 한다.
- 이터러블 객체는 `for...of`문으로 순회할 수 있고 Spread 문법을 사용 가능하다.

#### ES6에서 제공하는 빌트인 이터레이터
```
Array, String, Map, Set, TypedArray(Int8Array, Uint8Array, Uint8ClampedArray, Int16Array, Uint16Array, Int32Array, Uint32Array, Float32Array, Float64Array), DOM data structure(NodeList, HTMLCollection), Arguments
```

## 제너레이터(Generator)
- `Iterator`를 반환하는 함수다.
- `Generator` 함수는 function 키워드 다음에 별표 (`*`)가 추가되고, `yield`라는 키워드를 사용한다. yield는 일반적인 함수의 return과 살짝 비슷한 느낌인데, return처럼 함수를 종료시키진 않는다. 아래의 예시를 보자.
  ```js
  // Generator
  function *createIterator() {
    yield 1;
    yield 2;
    yield 3;
  }

  // Iterator
  const iterator = createIterator();
  console.log(iterator.next().value); // 1
  console.log(iterator.next().value); // 2
  console.log(iterator.next().value); // 3
  ```  
