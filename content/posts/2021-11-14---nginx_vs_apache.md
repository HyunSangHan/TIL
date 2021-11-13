---
title: Nginx - (1) 웹서버란? 그리고, Nginx vs Apache
date: "2021-11-14T00:00"
template: "post"
draft: false
slug: "nginx-vs-apache"
category: "Nginx"
tags:
  - "Nginx"
  - "Web"
  - "Network"
  - "Comparison"
description: "비동기 Event-driven 기반의 웹서버인 Nginx는 다수의 연결을 효과적으로 처리 가능하고 일반적으로 Apache보다 리소스를 적게 사용하면서, 초당 처리량은 높다는 장점을 가지고 있다."
---

## 웹서버란?
- HW로서의 웹서버: web server의 소프트웨어(HTTP server)와 website의 컴포넌트 파일들을 저장하는 장비
  * 컴포넌트 파일: HTML 문서, images, CSS stylesheets, 그리고 JavaScript files
- SW로서의 웹서버: 클라이언트(웹 브라우저 등)로부터 HTTP 프로토콜로 요청을 받아 응답해주는 소프트웨어

![Web Server](/media/what_is_webserver.png)

정리하자면, _정적 파일들(HTML/CSS/JS/Images)을 들고 있다가 HTTP프로토콜의 요청이 왔을 때 이를 응답해주는 서버_ 를 웹서버라고 한다.
Nginx도 그중 하나이다.

#### 점유율(2021년 말 기준)
![Web Server](/media/webserver_market_share.png)

## Nginx(현 1위) vs Apache(구 1위, 현 2위)
### Nginx
- 비동기 Event-Driven 기반 구조
- 다수의 연결을 효과적으로 처리 가능
- 일반적으로 Apache보다 리소스를 적게 사용하며, 초당 처리량이 높음

### Apache
- 쓰레드 / 프로세스 기반 구조로 요청 하나당 쓰레드 하나가 처리하는 구조
- 사용자가 많으면 많은 쓰레드 생성, 메모리 및 CPU 낭비가 심함
- `하나의 클라이언트 - 하나의 쓰레드`라는 구조
- prefork: 실행 중인 프로세스 복제하여 프로세스를 미리 띄워 놓고 클라이언트 요청 시 자식 프로세스가 반응하게 되는 방식
- c10k Problem: 자식 프로세스는 최대 1024개까지만 가능함

## Nginx의 Event Driven Model
- Nginx는 하나의 마스터 프로세스와 소수의 워커 프로세스(보통 코어수만큼 생성되며 설정 파일에서 정의됨)로 동작한다. 
- 마스터 프로세스는 nginx의 conf 파일을 읽고 그에 맞는 세팅과 워커 프로세서들을 생성한다.
- 마스터 프로세스는 설정 파일을 읽고, 유효성을 검사한다. 그리고 워커 프로세스를 관리한다. 모든 요청은 Worker Process에서 처리된다. 
- 이벤트를 받는 Reactor와 이벤트를 실제 처리를 위한 worker로 전달하기위한 handler등으로 구성되어 처리단위로 동작하게된다. Reactor는 event가 들어오면 알맞은 handler로 dispatch를 해주며 Handler는 이 dispatch된 event를 받아서 처리하는 역할을 수행한다.

![Nginx structure](/media/nginx_structure.png)

- 싱글 프로세스이므로 Context switching에 의한 오버헤드가 발생하지않아 빠른 처리가 가능하다. 또한 비동기처리로 인해 적은 메모리로 운영이 가능하다.  

---

> [참고자료]  
> https://m.blog.naver.com/jhc9639/220967352282  
> https://icarus8050.tistory.com/57  
> https://phsun102.tistory.com/47  
> https://hyeo-noo.tistory.com/205  
> https://news.netcraft.com/archives/category/web-server-survey/  
  