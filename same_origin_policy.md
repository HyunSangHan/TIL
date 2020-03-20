> [참고자료]  
> https://developer.mozilla.org/ko/docs/Web/Security/Same-origin_policy  
> https://velog.io/@yejinh/CORS-4tk536f0db  

# 동일 출처 정책(Same Origin Policy)
어떠한 출처(origin)에서 로드된 문서나 스크립트가, 그와 다른 출처(cross origin)와 상호작용하지 못하도록 제약하는 정책이다. 이는 웹 브라우저의 보안을 위한 것이다.

### 동일 출처의 기준은?

`프로토콜(Protocol)`, `호스트(Hostname)`, `포트(Port)`가 모두 동일한 경우이다. 참고로, 이들은 window의 location 객체에서 알 수 있는데, 이를 통해 `https://tillog.netlify.com/`에서 각각이 무엇을 의미하는지 확인해보자.

```js
const protocol = location.protocol;
const hostName = location.hostname;
const port = location.port;

console.log(protocol); // https:
console.log(hostName); // tillog.netlify.com
console.log(port); // port는 따로 명시되어있지 않을 경우 디폴트가 80이며, 이 경우 빈 문자열을 리턴함
```

서버와 클라이언트를 구분하여 개발하다보면 동일 출처가 아니기 때문에 아래와 같은 에러를 자주 마주치게 된다.

```bash
XMLHttpRequest cannot load 'http://localhost:3000'. No 'Access-Control-Allow-Origin' header is present on the requested resource. Origin 'http://localhost:8080' is therefore not allowed access.
```

# CORS(Cross-Origin Resource Sharing)
동일 출처 정책의 문제점을 해결하기 위한 정책으로, 다른 출처(cross origin)에서 온 요청이라도 데이터 접근을 허용하는 것이다.

### 서버단 해결 방법
- `Access-Control-Allow-Origin` 등의 응답 헤더를 설정하여, 접근을 허용할 도메인을 서버단에 미리 등록해두는 방법이 있다.
- 이 외에, Node.js같은 경우 cors 미들웨어를 사용하는 방법도 있다.

### 클라이언트단 해결 방법
- `Proxy`를 사용하는 방법이 있다. `package.json`의 `"proxy"` 필드에 요청하고자 하는 타겟 도메인을 넣어주고, 서버에 요청을 보낼 때에는 `fetch('/users')` 이런 식으로 로컬에 요청을 보내듯이 코드를 작성하면 된다.
- 이 외에, 간단하게 해결할 수 있는 방법이 몇 가지 있어 소개한다.(물론, 제한적이다.)
    * `cors-anywhere` 프록시 서버를 사용하기 : `https://cors-anywhere.herokuapp.com/https://tillog.netlify.com` 이런식으로 `https://cors-anywhere.herokuapp.com/`를 붙여 요청하는 방법이다. 헤로쿠의 프록시 서버가 중간에 응답 헤더를 설정해주는 원리로, 상당히 파워풀하지만 속도가 느리다.
    * `JSONP`를 활용하기 : GET방식에만 유효하다는 한계가 있다.
    * 크롬 확장앱을 설치하기 : 사용자에게 이걸 설치하라고 강요할 수는 없으므로 개발자 본인에게만 유효하다는 한계가 있다. 즉, 개발환경에서는 유효하다는 뜻이다.