> [참고자료]  
> https://poiemaweb.com/js-execution-context  
> https://www.zerocho.com/category/JavaScript/post/5741d96d094da4986bc950a0  

# 실행 컨텍스트(Execution Context)

## 실행 컨텍스트의 정체?
- 자바스크립트 엔진은 코드를 실행하기 위하여 실행에 필요한 여러가지 정보를 알고 있어야 한다. 

- 실행 컨텍스트는 실행 가능한 코드를 형상화하고 구분하는 추상적인 개념이다.

- 하지만 물리적으로는 '객체'의 형태를 가지며 아래의 3가지 프로퍼티를 소유한다.  

  | Property | Details |
  | --- | --- |
  | Variable Object | {var, function declarations, arguments... } |
  | Scope chain | [Variable object + All parent scopes] |
  | thisValue | Context object |

- 코드를 실행하면, 함수가 실행될 때 실행 컨텍스트가 생성되고 실행이 끝날 때  소멸한다. 구체적으로는, **스택(Stack)** 형태를 띠고 있다. 새로운 컨텍스트가 생기면 이 컨텍스트는 스택에 쌓이게 되고 컨트롤(제어권)이 이동한다.

### 컨텍스트의 4가지 원칙(원리)
1. 먼저 전역 컨텍스트 하나 생성 후, 함수 호출 시마다 컨텍스트가 생긴다.
2. 컨텍스트 생성 시 컨텍스트 안에 변수객체(arguments, variable), scope chain, this가 생성된다.
3. 컨텍스트 생성 후 함수가 실행되는데, 사용되는 변수들은 변수 객체 안에서 값을 찾고, 없다면 스코프 체인을 따라 올라가며 찾는다.
4. 함수 실행이 마무리되면 해당 컨텍스트는 사라진다(클로저 제외). 페이지가 종료되면 전역 컨텍스트가 사라진다.

### 컨텍스트 생성 시 실행 순서
새로운 함수 실행 컨텍스트가 생성되어 해당 실행 컨텍스트로 컨트롤이 이동하면 아래와 같이 실행된다.
1. 스코프 체인의 생성과 초기화
2. Variable Instantiation 실행
3. this value 결정

## Scope Chain (SC)
- `scope chain`은 **리스트** 형태를 띠고 있으며, 전역 객체와 중첩된 함수의 스코프에 대한 레퍼런스를 차례로 저장하고 있다.
- 현재 실행 컨텍스트의 활성 객체(AO)를 선두로 하여 순차적으로 상위 컨텍스트의 활성 객체(AO)를 가리키며 마지막 리스트는 전역 객체(GO)를 가리킨다.

## Variable Object (VO / 변수객체)
- 실행 컨텍스트가 생성되면 자바스크립트 엔진은 실행에 필요한 여러 정보들을 담을 **객체**를 생성한다. 그게 `variable object`이다.
  * 전역/지역변수, 매개변수(parameter), 인수(arguments) 정보, 함수 선언(함수 표현식은 제외)

## this Value
- this에 할당되는 값은 함수 호출 패턴에 의해 결정된다.
- `this value`가 결정되기 이전에 this는 전역 객체를 가리키고 있다가(참고로 전역 코드의 경우, this는 전역 객체를 가리킴) 함수 호출 패턴에 의해 this에 할당되는 값이 결정된다.