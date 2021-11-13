---
title: Nginx - (2) 역할과 기능
date: "2021-11-14T08:00"
template: "post"
draft: false
slug: "nginx-role"
category: "Nginx"
tags:
  - "Nginx"
  - "Web"
  - "Network"
  - "How to use"
description: "Nginx는 리버스 프록싱, 로드밸런싱, 보안(SSL, CORS 등), 캐싱 등의 역할을 해준다."
---

Nginx는 리버스 프록싱, 로드밸런싱, 보안(SSL, CORS 등), 캐싱 등의 역할을 해준다.

## Reverse Proxy
기본 nginx 설정 파일을 보면 URL 경로가 `/`로 시작하여 들어오는 경우, root에 지정된 경로에 따라 일치하는 파일로 이동하여 웹에서 보여주는데, reverse proxy를 서버 블록에 적용하면  URL 경로에 가장 적합한 서버블록을 찾은 후 해당 서버블록의 정보의 `proxy_pass`에 따른 내용을 보여준다. 

예컨대 아래의 사례에서 80번 포트의 `/api`를 도메인 바로 뒤에 붙인 경로로 요청을 받으면 `http://localhost:3000`로 연결한 것처럼 만든다.

```nginx
server {
    listen 80;
	...
    location ^~ /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    ...
}
```

#### [참고] 우선순위
1. `=`(exactly): 정확히 일치할 경우
    * ex) `location = /`
2. `^~`(priority prefix match): 우선 순위를 부여하고, 앞 부분이 일치할 경우. 여러 개가 충돌할 경우 긴 것이 적용(longest first)
    * ex) `location ^~ /api`
3. `~`(regex match with sensitive case): 대소문자를 구분하는 정규표현식 일치할 경우
    * ex) `location ~ /path`
4. `*~`(regex math with insensitive case): 대소문자를 무시하는 정규표현식 일치할 경우
    * ex) `location *~ /path`
5. `/`(prefix match): 앞 부분이 일치할 경우, 여러 개가 충돌할 경우 긴 것이 적용(longest first)
    * ex) `location /`

예컨대 아래의 사례에서 /api로 시작하는 요청은 3000포트로, 그 외에는 8080포트로 보내게 된다.
```nginx
location / {
    proxy_pass http://127.0.0.1:8080;
}

location /api {
    proxy_pass http://127.0.0.1:3000;
}
```

## Load Balance
기본적으로 nginx는 `round-robbin` 방식을 사용한다. 하지만 weight(가중치)를 주어 로드밸런싱이 가능하다.

```nginx
upstream project_home {
    # least_conn; # 클라이언트와 가장 적게 연결된 서버 순으로 연결을 우선하는 설정이다.
    # ip_hash; # 클라이언트 IP 를 hash 해서 특정 클라이언트는 특정 서버로 연결하는 설정이다. (부하가 골고루 분산되지 않고 특정 서버에 몰릴 수 있는 위험이 있다고 한다.)
    server project_home:8000 weight=5 slow_start=30s;
    server project_home:8001;
    server project_home:8002 backup;
}
```

위 사례에서,
- 첫 번째 서버에 `weight`(가중치)가 5가 주어져 있다. 이는 해당 서버가 5번 연결이 된 후에 8001번 서버로 연결이 넘어간다는 의미이다. 그리고 `slow_start`=30s 로 설정되어있다. 이는 최근에 장애로부터 복구한 서버에 요청이 폭주하지 않도록 slow_start 에 주어진 시간만큼 기다려 주는 의미이다.
- 세 번째 서버에는 `backup`이 설정되어있다. 모든 서버가 오류 상태일 때 동작하는 서버이다.

## SSL(HTTPS)
먼저 80 port로 들어온 걸 https(즉, 443port)로 redirect하도록 하고

```
server {
    listen 80;
    server_name example.com;
    return 301 HTTPS://$server_name$request_uri;
}
```

443 port로 들어오면 비공개키를 담아 응답한다.

```
server {
    listen 443 ssl default_server;
    server_name blahblah.com
    ssl_certificate /directory/to/unified.domain.pem // 병합한 파일
    ssl_certificate_key /directory/to/domain.key.pem  // 비공개 키
    ssl_protocols TLSv1.1 TLSv1.2;

    location / {
        root /home/ubuntu/web/dist/;
        index index.html index.htm index.nginx-debian.html;
        try_files $uri $uri/ /index.html;
    }
}
```

## CORS

```nginx
server {
    listen 8080;

    location / {
        proxy_pass https://api.blahblah.com;
        proxy_hide_header Access-Control-Allow-Origin;
        proxy_hide_header Access-Control-Allow-Methods;
        add_header Access-Control-Allow-Origin * always;
        add_header Access-Control-Allow-Methods 'HEAD, OPTIONS, GET, POST, PUT, PATCH, DELETE';
        add_header Access-Control-Allow-Headers *;
        if ($request_method = OPTIONS) {
            return 200;
        }
    }
}
```

## Cache Control
클라이언트(주로 브라우저)에서 캐싱을 하도록 시키는 것이다.

```
add_header Cache-Control "public";
```

---

> [참고자료]  
> https://phsun102.tistory.com/47  
> https://real-dongsoo7.tistory.com/100  
> https://hyeo-noo.tistory.com/205  
> https://developer88.tistory.com/299  
  

#### 이전 글
[(1) 웹서버란? 그리고, Nginx vs Apache](/posts/nginx-vs-apache)  