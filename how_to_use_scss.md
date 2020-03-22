> [참고자료]  
> https://poiemaweb.com/sass-script  
> https://donghunee.github.io/study/2020/01/19/scss/  


# SCSS
CSS 전처리기 중 하나다. `TypeScript`(.ts)가 `JavaScript`(.js)의 superset이듯, `SCSS`(.scss)는 `CSS`(.css)의 superset이다. 스타일링의 방법은 일반적인 `CSS`뿐만 아니라 HTML의 `style 속성`, 리액트에서는 `styled-components` 등 여러가지가 있는데, 그 중 하나로 `SCSS`가 있다고 보면된다. SCSS의 기본적 사용법을 훝어보자.

## 필요한 사전작업
브라우저는 SCSS의 문법을 알지 못하기 때문에 SCSS(.scss) 파일을 CSS(.css) 파일로 Complie(Transpile)해야 한다. 따라서 SCSS 환경의 설치가 필요하다. 아래와 같이 `node-sass`를 글로벌에 설치하자.

```console
$ npm install -g node-sass
```

## 사용법
예시 및 CSS와의 비교와 함께 몇가지 사용법을 알아보자.

### 네스팅
부모자식 관계를 가지고 있다면 네스팅으로 직관적인 작성이 가능하다.

```scss
// scss
.div {
  p {
    font-family: 'NanumBarunGothic';
    font-size: 14px;
    font-weight: 400;
  }
}

// css
.div p { 
  font-family: 'NanumBarunGothic';
  font-size: 14px;
  font-weight: 400;
}
```

속성도 네스팅을 통해 축약이 가능하다.

```scss
// scss
.div {
  p {
    font: {
      family: 'NanumBarunGothic', sans-serif;
      size : 14px;
      weight: 400;
    }
  }
}
```

### 부모요소 참조 (&)
Ampersand(&)는 부모요소를 참조하는 셀렉터로 쓰인다.

```scss
// scss
a {
  text-decoration: none;
  &:hover { 
    text-decoration: underline; 
  }
}

// css
a { 
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}
```

이를 이용해 문자를 이어서 클래스네임 등을 작성하는 네스팅도 가능하다.

```scss
// scss
.btn {
  display: inline-block;
  padding: 4px 10px;
  border: 1px solid #bbb;

  &_black { 
    background-color: #000; 
    border: 0; 
  }

  &_white {
    background-color: #fff;
    border:0;
  }
}

// css
.btn {
  display: inline-block;
  padding: 4px 10px;
  border: 1px solid #bbb;
}

.btn_black { 
  background-color: #000; 
  border: 0; 
}

.btn_white {
  background-color: #fff;
  border:0;
}
```

### 확장 (@extend)
베이스가 될 스타일을 미리 지정해놓으면, 여러 곳에서 이를 상속받아 쓸 수 있다. 확장을 사용할 때에는 `@extend` 지시어를 사용한다.

```scss
// scss
.btn {
  display: inline-block;
  padding: 4px 10px;
  border: 1px solid #bbb;
}

.btn_black {
  @extend .btn;
  background-color: #000; 
  border: 0; 
}

.btn_white {
  @extend .btn;
  background-color: #fff;
  border:0;
}
```

### 믹스인 (@mixin)
재사용을 위해 함수화하는 방법이다. 믹스인을 사용할 때에는 `@include` 지시어를 사용한다.

```scss
// scss
@mixin border-radius-all($radius) {
  -webkit-border-radius: $radius;
  -moz-border-radius: $radius;
  -ms-border-radius: $radius;
  border-radius: $radius;
}

.box {
  @include border-radius-all(10px);
} 
```
