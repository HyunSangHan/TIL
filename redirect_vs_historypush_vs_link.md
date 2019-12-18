# Redirect와 history.push, 그리고 Link
- 셋 다 특정 URL로 페이지를 이동시켜준다는 점에서는 유사한 듯하다.
- 그런데 뭐가 다른 거지? 이 중 `history`객체가 가장 범용적으로 사용될 수 있을 것으로 보여 이부터 설명을 기록한다.
​
## history.push
- `history.push("/login")`과 같이 쓴다.
- history stack을 활용한다.
- JSX에서 쓸 수 없다. 어떠한 event가 일어났을 때 작동할 함수 안에서 활용하면 되겠다.
- 하위(자식) 컴포넌트에서 `history`객체를 사용하려면, props를 통해 부모 컴포넌트로부터 전달받아야 한다.(참고로, BrowerRouter와 Route를 사용한 경우, 라우팅된 페이지의 최상위 컴포넌트에는 props를 통해 `history`객체가 자동으로 전달된다.)

### history.replace
- `Redirect`처럼, 현재(이동전)의 URL이 이동후에는 남지 않도록 할 때 쓴다.

## Redirect
- `react-router-dom`의 Redirect를 import 해온 후 `<Redirect to="/login">`와 같이 쓴다.
- `history.replace`처럼 작동한다.(`history`에 이동전경로가 남지 않는다.)
- JSX안에서 쓴다. 어떠한 state에 따라 리다이렉트 여부를 결정해야할 때 활용하면 되겠다.
- `history` 객체를 props로 넘겨받아오지 않아도 자식 컴포넌트에서 `Redirect`를 통해 다른 페이지로 이동시켜줄 수 있다는 편리함이 있다.

## Link
- `react-router-dom`의 Link를 import해온 후 `<Link to="/login">`와 같이 쓴다.
- 내부적으로 `<a></a>` tag를 통해 작동되고 사용법도 비슷하지만, 실제 동작은 일반적인 `<a></a>` tag와 다르게, 페이지 전체를 리로드하지 않고 필요한 부분만 리로드하게 된다.
- JSX안에서 쓴다. 어떠한 부분을 클릭했을 때 페이지를 이동시켜주고 싶다면 이를 활용하면 되겠다.
- `history.push`처럼 이동전경로가 `history`객체에 남는다.
- 만일 `history.replace`처럼 이동전경로를 남기지 않게 하려면 `<Link to= "/login" replace={true} />`와 같이 쓰면 되겠다.