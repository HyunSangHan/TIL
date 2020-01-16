> [참고자료]  
> 김정환, 모던 프론트엔드 개발 환경의 이해, 68차 토크ON세미나(2020. 1. 15.), T아카데미(SK Planet).    

이번 글은 2020년 1월 15일에 서울대 SKT연구소에서 T아카데미 주관으로 진행된 <모던 프론트엔드 개발 환경의 이해>(강사: 김정환 님)라는 세미나의 필기 내용이다.

# Babel
- 바벨탑이 실패한 이유는? '언어가 달라서'였다. 참고로, 히브리어로 바벨은 '혼돈'이라는 뜻이다.
- 크로스브라우징의 혼란을 해결해 줄 수 있는 것이 바벨이다. ES6 코드를 ES5 코드로 변환해주는 등 바벨이 하는 일을 `transpile`이라고 한다. 크로스브라우징 이슈를 해결하기 위해 `transpile`과 `polyfill`을 하게 되는데 이 둘의 차이는 뒤에서 다뤄보도록 한다.
- `transpile`과 `build`를 혼용해서 쓰기도 하는데, 엄밀히 다르다고 이야기하는 사람들은 이 둘의 차이를 아래와 같이 말한다. 참고만 해두자.
  * `transpile` : 변경 전 코드와 변경 후 코드 모두 사람이 읽기에 문제없는 경우
  * `build` : 변경 후 코드가 사람이 읽기엔 부적합해진 경우(그래서인지 웹팩은 여지없이 `build`한다고 표현한다.)

## Babel 간단히 알아보기

### Babel 설치
- `npm install -D @babel/core @babel/cli`로 @babel/core와 @babel/cli를 모두 설치하자.

### Babel core
Babel의 트랜스파일 과정은 다음과 같다.
1. 파싱(Parsing) : 코드를 읽고 추상 구문 트리(AST)라는 자료구조로 변환하는 단계
2. 변환(Transforming) : 추상 구문 트리를 변경하는 단계
3. 출력(Printing) : 실제로 코드를 변경하여 나타내는 단계

사실 여기서 @babel/core가 해주는 역할은 `파싱`과 `출력`뿐이다! **`변환`은 플러그인이 해준다.** 플러그인을 추가하지 않으면 babel로 트랜스파일링해도 결과물이 그대로일 것이다.(참고로 바벨 플러그인은 웹팩 플러그인과는 별개의 개념)

### Plugin
코드를 변환해주는 각각의 피쳐들을 플러그인이라 한다. 예컨대,
- const를 var로 바꾸는 `@babel/plugin-transform-block-scoping`
- 화살표함수를 일반 함수로 바꾸는 `@babel/plugin-transform-arrow-functions`
- 엄격모드를 적용하는 `@babel/plugin-transform-strict-mode`
등이 있다. 플러그인 목록은 [공식문서](https://babeljs.io/docs/en/plugins)를 참고하자.  

`npm install -D @babel/plugin-transform-block-scoping`와 같이 각각 dev옵션을 주고 설치하며, 아래와 같은 명령어로 실행 가능하다.
```
npx babel app.js \
  --plugins @babel/plugin-transform-block-scoping \
  --plugins @babel/plugin-transform-arrow-functions \
  --plugins @babel/plugin-transform-strict-mode
```

보다시피 명령어가 너무 길다. 설정 파일을 작성하면 이를 줄일 수 있다. 웹팩에서 `webpack.config.js`를 쓰듯이 바벨도 `babel.config.js`를 쓰면 된다.  

프로젝트의 루트 디렉토리에 `babel.config.js`를 만들고 아래와 같이 작성한다.
```js
// babel.config.js
module.exports = {
  plugins: [
    "@babel/plugin-transform-block-scoping",
    "@babel/plugin-transform-arrow-functions",
    "@babel/plugin-transform-strict-mode", 
  ]
}
```

이제, `npx babel app.js`라고만 작성해도 의도한대로 트랜스파일이 된다.

### Preset
모든 플러그인을 직접 찾아서 위와 같이 설정하기는 힘들다. 목적에 맞게 여러가지 플러그인을 세트로 모아놓은 것을 `preset`이라고 하며, 이를 활용하면 설정이 쉽다. 예컨대,
- ES6를 변환하기 위한 `preset-env`
- 리액트를 변환하기 위한 `preset-react`
- 타입스크립트를 변환하기 위한 `preset-typescript`
등이 있고, `preset-env`를 가장 많이 쓴다. 더 많은 프리셋 목록은 [공식문서](https://babeljs.io/docs/en/presets)를 참고하자.

`npm install -D @babel/preset-env`와 같이 dev옵션을 주고 설치하며, `babel.config.js`에 아래와 같이 간단하게만 작성해줘도 된다!

```js
// babel.config.js
module.exports = {
  presets: [
    '@babel/preset-env'
  ]
}
```

`npx babel app.js`로 실행해주면 정상적으로 트랜스파일 된다.

만일 `babel.config.js`의 target 옵션에 브라우져 버전명을 지정하면 env 프리셋은 이에 맞는 플러그인들을 찾아 적절하게 코드를 트랜스파일 한다.

```js
// babel.config.js 
module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          chrome: '79', // 크롬 79를 지원하고
          ie: '11'      // ie 11까지도 지원할만큼 트랜스파일하기!
        }
      }
    ]
  ]
}
```

만일 타겟에 크롬만 있었다면 그닥 변환을 하지 않았을 것이다. 안해도 되므로.

## Polyfill
Babel이 모든 코드를 변환해줄 수는 없다. 변환을 해주고 싶어도, 예컨대 Promise처럼 대응되는 문법 자체가 없는 경우가 있다. 다만, **하위 버전의 코드로 어떻게든 구현은 할 수 있다.** 그게 바로 폴리필의 개념이며, 꿩 대신 닭으로 구현한 코드들의 조각을 갖다 붙여주는 것이다. 폴리필 패키지, 즉 코드 조각의 원천으로는 `core-js`, `babel-polyfill`이 대표적이다. 예시에서는 `core-js`를 사용해본다.  

`babel.config.js`에서 `useBuiltIns`를 usage나 entry로 두면 폴리필을 사용할 수 있다. 디폴트값은 false였기 때문에, `useBuiltIns`를 아예 안써줬다면 당연히 폴리필이 적용되지 않는 것이다.

```js
// babel.config.js
module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        useBuiltIns: 'usage', // 폴리필 사용 방식 지정
        corejs: { // 폴리필 버전 지정
          version: 2
        }
      },
    ],
  ],
};
```

이제 `npx babel src/app.js`로 실행하면, 아래와 같이 `core-js`에서 promise 관련 모듈을 임포트하는 코드가 추가된다.

```js
"use strict";

require("core-js/modules/es6.promise");
require("core-js/modules/es6.object.to-string");

new Promise();
```

헷갈리지 말아야 할 점은, 이는 그저 임포트하는 "코드"를 추가해준 것이라는 것이다. 실제 임포트를 한 것은 아니다! `npm install -D core-js`를 한 적이 없음을 기억해보라. 즉, 바벨은 정말 코드만 변환/추가해주는 것이지 그 이상의 것을 해주는 게 아니다.