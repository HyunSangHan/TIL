---
title: Nginx를 통해 Tomcat에 전달된 client ip 얻기
date: "2021-11-14T10:00"
template: "post"
draft: false
slug: "nginx-x-forwarded-for"
category: "Nginx"
tags:
  - "Nginx"
  - "Web"
  - "Network"
  - "How to use"
  - "Case study"
description: "Springboot에서 request.getRemoteAddress()를 호출하여 client ip를 얻으려 할 때 127.0.0.1 이 찍히는 문제가 있다면, X-Forwarded-For를 통해 실제 client ip를 얻을 수 있다."
---

## X-Forwarded-For
Nginx(80포트) 거쳐서 tomcat(8080포트)으로 들어오게 할 때,
단순히 아래와 같이 하면,
```nginx
server{
    location ^~/api {
        proxy_pass http://127.0.0.1:8080;
    }
}
```
springboot에서 `request.getRemoteAddress();`를 호출하여 client_ip를 얻으려 할 때 127.0.0.1 이 찍히는 문제가 있다.

`X-Forwarded-For`를 쓰면 실제 client ip를 얻을 수 있다.
```nginx
server{
    location ^~/api {
        proxy_set_header X-Forwarded-For $remote_addr;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Host $http_host;
        proxy_pass http://127.0.0.1:8080;
    }
}
```

대략 이런 식으로 얻으면 되겠다.

```java
public String getIp(HttpServletRequest request){
  String ip = request.getHeader("x-forwarded-for");
  return ip != null ? ip : request.getRemoteAddr();
}
```

---

> [참고자료]  
> https://developer88.tistory.com/299  
  