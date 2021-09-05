---
title: Nginx - (3) nginx.conf 파일 구성
date: "2021-11-14T09:00"
template: "post"
draft: false
slug: "nginx-config-file"
category: "Nginx"
tags:
  - "Nginx"
  - "Web"
  - "Network"
  - "Dev-environment"
  - "How to use"
description: "Nginx 모듈의 동작은 nginx.conf 파일에 있는 directives(지시어)에 의해 제어되는데, directive는 simple directive와 block directive 두 가지 종류가 있다."
---

## 기본
- Nginx의 메인 설정 파일 경로는 `/etc/nginx/nginx.conf`이다. (`/etc/nginx/nginx.conf`에 없다면 `/usr/local/nginx/conf/nginx.conf` 또는 `/usr/local/etc/nginx/nginx.conf` 에 위치한다.)
- Nginx 모듈의 동작은 configuration 파일에 있는 `directives`(지시어)에 의해 제어되는데, directive는 simple directive와 block directive 두 가지 종류가 있다.
    1. `simple directive` : 이름, 값이 있고 세미콜론(`;`)으로 끝난다.
    2. `block directive` : simple directive의 구조에 블록(`{`, `}`)을 감싼 형태의 지시어이다. 해당 directive 안에 또 다른 block directive가 포함될 수 있다.

## URL에 따른 변수들(예약어)
만약 아래와 같은 URI가 있다고 치면,
```
http://phenomenon.kr/gallery/index?type=number&id=49
```

- `$host`(서버나 IP의 도메인): phenomenon.kr
- `$uri`(도메인을 제외한 path): /gallery/index
- `$args`(쿼리파라미터): type=number&id=49

\* 참고: http://nginx.org/en/docs/varindex.html

## 예제
```nginx
$ vi /etc/nginx/conf.d/test.conf

server {

    # 우선 proxy에서 사용할 포트를 설정한다.
    listen 80; 

    # 서버의 도메인이나, 아이피 주소를 작성해주면 된다.
    server_name phenomenon.kr; 

    # phenomenon.kr/docs 로 요청이 온 경우 github에 존재하는 api 문서를 확인할 수 있도록 301 redirection을 해주었다.
    location /docs {
        return 301 https://github.com/HyunSangHan/TIL/blob/master/README.md;
    } 

    # phenomenon.kr/api 로 요청이 온 경우에는 localhost의 3000번 포트로 프록시 해준다.
    location /api {
        # 업스트림으로 연결되는 도중 error나 timeout, invalid_header, http 오류 등이 발생하면 요청을 포기한다.
        proxy_next_upstream error timeout invalid_header http_500 http_502 http_503 http_504;

        # 각 종 헤더를 설정할 수 있다.
        proxy_set_header Host $host;
        prxoy_set_header X-Real-IP $remote_addr

        # 타임 아웃에 대한 설정을 진행한다.
        proxy_connect_timeout 300;
        proxy_send_timeout 300;
        proxy_read_timeout 300;
        send_timeout 3000;

        # 프록시 대상 경로를 설정해준다.
        proxy_pass http://localhost:3000/api;
    }

    location / {
    }

    # 404 페이지와 같이 웹서버의 기능인 정적파일을 제공하기도 한다.
    error_page 404 = /error_404.html
}
```

upstream을 써서 로드밸런싱과 함께 프록싱한다면 이런 식이다.
```nginx
# upstream
http {
    upstream myproject {
        server 127.0.0.1:8000 weight=3;
        server 127.0.0.1:8001;
        server 127.0.0.1:8002;
        server 127.0.0.1:8003 backup;
    }
    server {
        listen 80;
        server_name phenomenon.kr;
        location / {
            proxy_pass http://myproject;
        }
    }
}
```

> [참고자료]  
> https://hyeo-noo.tistory.com/205  
> https://developer88.tistory.com/299  
  
---

#### 이전 글
[(2) 역할과 기능](/posts/nginx-role)  