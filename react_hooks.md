> 공식문서  
> https://ko.reactjs.org/docs/hooks-intro.html  
> 그 외 참고자료  
> https://dev-momo.tistory.com/entry/React-Hooks  
> https://velog.io/@velopert/react-hooks  
> https://velog.io/@public_danuel/trendy-react-usememo  

# Hooks
## Hook이 뭐야?
- 함수형 컴포넌트에서 state와 LifeCycle을 사용할 수 있게 해주는 개념이다.
- 렌더만을 담당하며 Functional Component는 기존에 Stateless Component와 거의 비슷한 의미로 받아들여졌였는데, Hook의 등장으로 이 둘은 개념적으로 분리되게 된 셈이다.
- 참고로, useState와 useEffect를 가장 자주 쓰게 되는 것 같다.
​
## Hook을 도입하게 된 이유들
- 컴포넌트 사이에서 상태와 관련된 로직을 재사용하기 어려웠다.(중복로직이 많았다)
- 컴포넌트들이 복잡해졌다. state를 재활용하려다보니 Wrapper Hell을 마주하게 되는 경우가 종종 생겼다.
- Class가 진입장벽이 될 수 있었다.(정확히는, this가 불편했다.)
​
## useState
useState는 함수형 컴포넌트 내에서 state를 선언 및 초기화해주는 기능을 한다.
​
#### 예시
```js
const [count, setCount] = useState(0);
// 함수형 컴포넌트 안에 count라는 state를 선언하면서 0으로 초기화한다. setCount를 통해 state를 업데이트할 수 있게 된다. 
```

#### 특징​
- useState는 state를 함수형 컴포넌트 안에서 사용할 수 있게 해준다.(함수형 컴포넌트를 사용하다가, 단지 state를 쓰기 위해 클래스형 컴포넌트로 바꾸는 일은 이제 안해도 된다.)​
- 일반적인 변수는 함수가 끝날 때 사라지지만, state 변수는 React에 의해 사라지지 않는다는 차이점이 있다. 
  * 왜 `createStat`e가 아니라 `useState`라고 할까? : 컴포넌트가 렌더링할 때 오직 한 번만 생성되기 때문에 'Create'라고 표현하기 애매하기 때문이다. 다음 번 렌더링의 경우엔 useState가 현재 state를 줄 뿐이다.
- 이 setXXX 함수는 이벤트 핸들러나 다른 곳에서 호출 가능하다. `this.setState`와 거의 유사하지만, 이전 state와 새로운 state를 합치지 않는다는 차이점이 있다.
​ 
#### 사용법 
- state의 수는 제한이 없기때문에 useState를 여러번 사용해도 된다. 여러 state를 활용하고 싶다면 여러번 호출하면 된다.
- useState에는 state의 초기값을 인자로 넘겨주면 된다. 클래스형 컴포넌트에서의 state와 다르게, 꼭 객체일 필요는 없고 그냥 number나 string이여도 된다.
- useState는 현재의 state 값과 이 값을 업데이트하는 함수를 쌍으로 제공한다. 그래서 `const [count, setCount] = useState()`와 같이 쓰는 것이다. (참고로, 이는 배열 비구조화 할당 문법임!)
- state를 업데이트해주는 함수에 대한 인자도 useState의 인자와 마찬가지 자료형을 넣어주면 된다.
​
## useEffect
useEffect는 함수형 컴포넌트 내에서의 Life Cycle의 역할을 담당한다.
​
#### 예시
```js
useEffect(() => {
  API.getData()
    .then((response) => { setData(response) });
}, []); // 마운트 될 때에만 실행
​
useEffect(() => func(), [count]); // count라는 특정 state가 변경될 때만 func 실행
​
useEffect(() => {
  console.log('useEffect');
  return () => { 
    console.log('cleanup');
  }; 
}, []); // 언마운트 될 때에만 실행
```

#### 특징
- useEffect는 컴포넌트가 마운트 되었을 때(componentDidMount), 컴포넌트가 업데이트 되었을 때(componentDidUpdate)를 합친 정도의 느낌이다.
- 컴포넌트가 마운트 해제될 때(componentWillUnmount)에도 활용할 수 있다.
​
#### 사용법
공부하다보니, 그룹핑 하자면 두 가지로 묶을 수 있는 것 같아서 묶어서 정리해본다. 
​
1. 업데이트 '후'에 대한 것
- 기본적으로 렌더링 되고 난 직후마다 실행된다.
- 특정 state가 업데이트되었을 때만 실행하고자 한다면, 두번째 인자에 해당 state를 요소로 한 배열(예시: `[count]`)을 넘겨주면 된다. (참고로 배열 안에 여러 state를 넣어도 된다.) 
- 이와 같은 이치로, 두번째 인자에 `[]`(빈 배열)을 넣어주면, 마운트 될 때에만 실행된다.(update되는지 watch할 대상이 없으니까!)
​
2. 업데이트 '전'에 대한 것
- return을 넣어주게 되면, 이는 cleanup함수로 인식되며 다음 effect 실행 전에 실행된다. 즉, 업데이트 직전에 뭔가를 실행하고 싶을 때는 return을 작성하자.
- return은 화살표함수로 작성해주면 되겠다.
- 만약, 업데이트 직전에 매번 실행할 게 아니라, 언마운트 전(componentWillUnmount)에만 실행하고 싶다면, 두번째 인자에 `[]`(빈 배열)을 넣어주면 된다.
​
## useMemo
useMemo는 함수형 컴포넌트 내에서 발생하는 연산을 최적화해준다.
​
#### 예시
```js
import React, { useMemo, useState } from 'react'
​
const User = () => {
 const [nickname, setNickname] = useState('')
 const nicknameLength = useMemo(() => nickname.length, [nickname]) // useMemo를 쓰는 부분
​
 const updateNickname = event => {
   const nickname = event.target.value
​
   setNickname(nickname)
 }
​
 return (
   <div>
     <input onChange={updateNickname} />
     <label>{nicknameLength}</label>
   </div>
 )
}
```

#### 특징
- useMemo는 코드의 간결화, 성능 개선에 그 의의가 있다고 생각된다.
- 사실 useState와 useEffect를 함께 쓰면, useMemo의 역할을 수행할 수 있다.(지켜볼 state를 useEffect의 두번째인자로 줌으로써, update되는지를 watch하고 있다가 그게 update되면 원하는 state를 set해주는 방식)
- 하지만, 이는 2번에 걸쳐 리렌더링이 이루어지게끔 하는 방식이기 때문에 퍼포먼스 측면에서 개선의 여지가 있고, 코드의 역할에 비해 비교적 장황한 코드를 짜게 된다는 단점이 있다.
- useMemo는 useState와 다르게, 직접적으로 state를 변경하는 함수를 제공하진 않는다.
​
#### 사용법
위에서 배운 useState와 useEffect를 함께 쓰는 경우와 비교해서 사용법을 정리해보겠다.
- useMemo를 쓴다면 state 선언과 동시에, 무엇이 업데이트 될 때 무엇을 연산할 것인지를 정의한다.(반면, useState와 useEffect는 필연적으로 코드가 분리)
- 선언과 동시에 쓴다는 것 외에는 useEffect와 비슷한 방식으로 코드를 작성하면 된다. 첫번째 인자에 원하는 연산이 들어간 함수, 두번째 인자에는 배열 형태로 update되는지 지켜볼 state를 넣어준다.
- 만일 두번째 인자를 넣어주지 않으면 컴포넌트가 화면에 렌더링될 때마다 useEffect가 실행되어버린다. 특히, useEffect가 state를 변경하는 역할을 하고 있다면 그 때문에 리렌더링이 될 테니 무한루프에 빠질 것이다.
​
## 그밖에
`useContext`, `useReducer`, `useCallback`, `useRef` 등 많은 Hook이 있고, 심지어 `커스텀 Hook`도 만들 수 있다.