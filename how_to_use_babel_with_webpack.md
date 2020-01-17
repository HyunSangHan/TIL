> [참고자료]  
> 김정환, 모던 프론트엔드 개발 환경의 이해, 68차 토크ON세미나(2020. 1. 15.), T아카데미(SK Planet).    

이번 글은 2020년 1월 15일에 서울대 SKT연구소에서 T아카데미 주관으로 진행된 <모던 프론트엔드 개발 환경의 이해>(강사: 김정환 님)라는 세미나의 필기 내용이다.

# 바벨과 웹팩 함께 사용하기
바벨로 변환한 코드를 웹팩으로 말기 위해서 이 둘을 함께 쓰게 된다. babel을 webpack의 loader로서 쓰는 것이다!  

`npm install -D babel-loader`로 바벨로더를 설치해주고 아래와 같이 웹팩 설정파일을 작성한다.

```js
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader', // 바벨 로더를 추가한다 
      },
    ]
  },
}
```

참고로, js파일을 대상으로 하되 node_modules가 포함되면 너무 느려질 수 있으니 제외한 것이다.

만일 바벨에서 polyfill 설정을 했다면, `core-js`를 install해주어야 한다(`core-js`를 `babel.config.js`에 이미 작성해놓았을지라도!). babel은 코드만 제공할 뿐, 실제 require(import)까지 책임져주지는 않기 때문이다. `npm i core-js@2`로 core-js의 2버전을 설치할 수 있다.  

이제, 웹팩을 실행하면 바벨로더가 트랜스파일을 한 후의 코드를 웹팩이 빌드해주게 된다.