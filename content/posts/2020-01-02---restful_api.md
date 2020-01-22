---
title: "RESTful API"
date: "2020-01-02T22:40:32.169Z"
template: "post"
draft: false
slug: "restful-api"
category: "Concept"
tags:
  - "Concept"
  - "Web"
description: "'REpresentational State Transfer'라는 용어의 약자로서 웹의 장점을 최대한 활용할 수 있는 아키텍처 중 하나. 자원(Resource), 행위(Verb), 표현(Representations)로 구성된다."
# socialImage: "/media/image-0.jpg"
---

# REST가 뭐야?
'`RE`presentational `S`tate `T`ransfer'라는 용어의 약자로서 웹의 장점을 최대한 활용할 수 있는 아키텍처 중 하나.

# RESTful API 구성
1. 자원(Resource) - URI
2. 행위(Verb) - HTTP METHOD
3. 표현(Representations)

# RESTful API의 특징
1. Uniform
- URI로 지정한 리소스에 대한 조작을 통일되고 한정적인 인터페이스로 수행하는 아키텍처 스타일이다.

2. Stateless
- 상태가 없다는 의미는 사용자나 클라이언트의 컨텍스트를 서버쪽에 유지 하지 않는다는 의미한다.
세션이나 쿠키등을 별도로 관리하지 않아도 되어 API서버는 요청만을 들어오는 메시지로만 처리하기 때문에 구현이 단순해진다.

3. Cacheable
- REST의 가장 큰 특징 중 하나로, HTTP라는 기존 웹표준을 그대로 사용하므로 HTTP가 가진 캐싱 기능이 적용 가능하다. HTTP 프로토콜 표준에서 사용하는 Last-Modified태그나 E-Tag를 이용하면 캐싱 구현이 가능하다.

4. Self-descriptiveness
- 동사(Method) + 명사(URI) 로 이루어져있어 어떤 메서드에 무슨 행위를 하는지 알 수 있으며, 메시지 포맷 역시 JSON을 이용해서 직관적으로 이해가 가능한 구조로, REST API 메시지만 보고도 이를 쉽게 이해할 수 있게 된다.

5. Client - Server Architecture
- REST 서버는 API를 제공하고, 제공된 API를 이용해서 비즈니스 로직 처리 및 저장을 책임진다.
클라이언트의 경우 사용자 인증이나 컨텍스트(세션,로그인 정보)등을 직접 관리하고 책임진다. 이렇게 역할이 구분되어 서로간의 의존성이 줄어들게 된다.

6. 계층형 구조
- 클라이언트 입장에서는 REST ApI 서버만 호출한다.
REST 서버는 다중 계층으로 구성될 수 있다. 예를 들어 보안, 로드 밸런싱, 암호화, 사용자 인증 등을 추가하여 구조상의 유연성을 줄 수 있다.

### URI 설계시 주의할 점
URI는 정보의 자원을 표현해야하기 때문에 설계할 때 몇 가지 지켜야 할 것들이 있다.
- 슬래시 구분자(/)는 계층 관계를 나타내는데 사용
- URI 마지막 문자로 슬래시(/)를 포함하지 않는다.
- 하이픈(-)은 URI 가독성을 높이는데 사용한다.
- 밑줄(_)은 URI에 사용하지 않는다.
- URI 경로에는 소문자가 적합하다.
- 파일확장자는 URI에 포함하지 않는다.

# 대표적인 HTTP 메소드 4가지
1. GET: 해당 리소스를 조회
2. POST: 해당 URL를 요청하면 리소스를 생성
3. PUT/PATCH: 해당 리소스를 수정
4. DELETE: 해당 리소스를 삭제

# RESTful API의 예시 (블로그를 구현한다고 가정)
|Method | URI | Meaning of API |
|---|---|---|
| `GET` | `/blog` |  List all blogs |
| `POST` | `/blog` | Create a new blog |
| `GET` |`/blog/:id` | Get a blog |
| `PUT` | `/blog/:id` | Update a blog |
| `DELETE` | `/blog/:id` | Delete a blog and its comments |
| `GET` |`/blog/:id/comment` | Get a blog comment |
| `PUT` | `/blog/:id/comment`| Update a blog comment |
| `DELETE` | `/blog/:id/comment`| Delete a blog comment |

---

> [참고자료]  
> https://nesoy.github.io/articles/2017-02/REST  
> https://velog.io/@ejchaid/RESTful-API-%EA%B7%B8%EA%B2%8C-%EB%AD%90%EC%95%BC  
> 그리고, 기존에 알고 있던 지식들 포함    