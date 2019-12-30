> [참고자료]  
> https://www.vobour.com/%EB%A6%AC%EC%95%A1%ED%8A%B8-react-%EC%9D%B4%ED%95%B4-4-higher-order-component  
> https://reactjs-kr.firebaseapp.com/docs/higher-order-components.html  
> https://velopert.com/3537  

# HOC(Higher Order Component)

## HOC가 뭐야?
- 기능적인 필요성에 의해 반복되어 나타나는 코드들을 재사용할 수 있게 해준다.
- 반복되는 로직을 HOC에 넣어두고, 이를 통해 다른 컴포넌트를 Wrapping하는 방식으로 활용한다.
- 개인적인 해석으로 비유해보자면, 공통인수를 이용해서 인수분해를 하는 것과 의미적으로나 생김새적으로나 무척 비슷하다고 본다. (이런 느낌: `ax+ay = a(x+y)`)

## HOC 사용법
- 리액트 컴포넌트를 인자로 받아서 새로운 리액트 컴포넌트를 리턴하게 한다.
- 주로 HOC 의 이름을 만들 땐 with___ 형식으로 지으며, 이 밑줄 부분에는 새로 주입될 prop명을 적어주면 나중에 prop의 출처를 명확히 파악하기에 좋다.(ex: `withNewPropName`)

## HOC의 쓰임새
이 외에도 많은 쓰임새가 있겠으나, 유용할 만한 쓰임새를 나열했다.
1. Container 컴포넌트와 Presentational 컴포넌트 분리 : Container 컴포넌트와 Presentational 컴포넌트를 분리하여 사용 할 때, 컨테이너 컴포넌트를 HOC를 만들어서 사용할 수 있다.

2. 로딩 중 화면 표시 : 보통 SPA(Single Page App)에서 화면이 로딩 중일 때, Skeleton 화면을 보여주고, 로딩이 완료되면 데이터를 보여줄 때 사용 할 수 있다.

3. 유저 인증 로직 처리: 컴포넌트 내에서 권한 체크나 로그인 상태를 체크하기 보다는 인증 로직을 HOC로 분리하면 컴포넌트 재사용성도 높일 수 있고, 컴포넌트에서 역할 분리도 쉽게 할 수 있다.

4. 에러 메세지 표시: 컴포넌트 내에서 분기문(if/else 등)을 통해 처리 할 수도 있지만, 분기문을 HOC로 만들어 처리 하면 컴포넌트를 더욱 깔끔하게 사용 할 수 있다.


## 생김새

#### 함수형 컴포넌트
```js
const withHOC = WrappedComponent => {
  const newProps = {
    loading: false,
  };
  return props => {
    return <WrappedComponent {...props} {...newProps} />
  }
};
```

#### 클래스형 컴포넌트
```js
const withHOC = WrappedComponent => {
  const newProps = {
    loading: false,
  };
  return class extends React.Component {
    render() {
      return <WrappedComponent {...this.props} {...newProps} />
    }
  }
};
```

#### HOC로 wrapping하기
```js
export default withHOC(AnyComponent);
```

## 예시 코드

#### 아주 기본적인 예시
아래는 간단한 예제이다. 로딩여부에 따라 `Loading` 메시지를 보여줄 것인지, 컴포넌트를 보여줄 것인지 조건부 렌더링이 된다.

```js
const withLoading = (WrappedComponent) => (props) => {
  props.isLoading ? <div>Loading ...</div> : <WrappedComponent { ...props } />
}
```

위와 같이 정의한 HOC를 실제 사용할 때에는 이렇게 한다.

```js
export default withLoading(TodoList);
```

#### 좀더 발전된 상황의 예시
만일, 로딩 화면의 유형이 여러가지여서 유형에 따라 다른 컴포넌트를 보여주고 싶다면 이렇게 함수를 중첩하게끔 만들면 되겠다.

```js
const withLoading = options => WrappedComponent => props => {
  if (props.isLoading) {
    if (options.type === 'circle') {
      return <CircularLoading />
    }
    return <LinearLoading />
  }
  return <WrappedComponent {...props} />
};
```

`{ type: 'circle'}`이 options라고 가정하면, 아래와 같이 활용하면 되겠다.

```js
export default withLoading({ type: 'circle' })(TodoList);
```
