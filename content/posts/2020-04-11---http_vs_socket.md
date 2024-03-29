---
title: Http vs Socket
date: "2020-04-11T23:24"
template: "post"
draft: false
slug: "http-vs-socket"
category: "Web"
tags:
  - "Web"
  - "Network"
  - "Comparison"
description: "네트워크를 통해 서버로부터 데이터를 가져오기 위한 통신 방식은 Http 통신과 Socket 통신 2가지가 있다. 전자는 단방향이고, 후자는 양방향이다."
---

`Protocol`이란 컴퓨터나 원거리 통신장비 사이에서 데이터를 주고 받기 위한 약속을 의미하는데, 소개하고자 하는 `HTTP`와 `Socket`은 프로토콜의 일종이다. 전자는 단방향이고 후자는 양방향이다.

# Http 통신
- Client의 요청(Request)이 있을 때만 서버가 응답(Response)하여 해당 정보를 전송하고 곧바로 연결을 종료하는 방식이며 단방향 통신이다.
- 실제로 대다수 경우, 필요한 경우에만 Server로 정보를 요청하는 경우가 많다보니 주로 사용되는 방식이며, 유지보수 등 대부분의 방면에서 좋다.

### 참고 : Http로 양방향처럼 통신하기
- 2005년 경 Ajax가 소개되며 많은 사람들이 양방향 통신 방법을 찾기 시작했다.
- 서버가 클라이언트에 데이터를 전송한다는 착각을 일으키는 가장 일반적인 트릭 중 하나는 롱 폴링(Long polling)이다. 클라이언트가 서버에 대한 HTTP 연결을 열고 응답을 받을 때까지 이를 계속 열어두는 것이다. 서버는 전송할 새로운 데이터가 생길 때 마다 이를 응답으로 전송한다. 하지만 이는 오버헤드가 될 수 있다는 단점이 있으니 소켓 통신을 활용하는 게 좋겠다.

# Socket 통신
- Http 통신과 달리, Server와 Client가 특정 Port를 통해 실시간으로 양방향 통신을 하는 방식이다.
- 계속 연결을 유지하는 연결지향형 통신이기 때문에 실시간 통신이 필요한 경우에 사용된다.(실시간 동영상 스트리밍, 온라인 게임, 채팅 등)
- 카카오의 DAUM 뉴스에서는 댓글과 좋아요에 소켓 통신을 활용해서 실시간성을 부여했는데, 주목받는 뉴스의 경우 특히 생동감이 느껴져 개인적으로 감명깊었던 기억이 난다.

---

> [참고자료]  
> https://engineering.huiseoul.com/자바스크립트는-어떻게-작동하는가-웹소켓-및-http-2-sse-1ccde9f9dc51
