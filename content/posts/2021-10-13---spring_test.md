---
title: 스프링 테스트(Spring Test)
date: "2021-10-13T00:00" # WED
template: "post"
draft: false
slug: "spring-test"
category: "Spring"
tags:
  - "Spring"
  - "Test"
  - "Java"
description: "ApplicationContext를 만들고 관리하는 작업을 할 수 있도록 JUnit의 기능을 확장해준다."
---

## 테스트 작성 흐름
1. `Given`(준비): 시나리오 진행에 필요한 값을 설정, 테스트의 상태를 설정
2. `When`(실행): 시나리오 진행 필요 조건 명시, 테스트하고자 하는 행동
3. `Then`(검증) : 시나리오를 완료했을 때 보장해야하는 결과를 명시, 예상되는 변화 설명

## Test 원칙 - F.I.R.S.T
- `Fast`: 테스트 코드를 실행하는 일은 오래 걸리면 안된다.
- `Independent`: 독립적으로 실행이 되어야한다.
- `Repeatable`: 반복 가능해야한다.
- `Self Validation`: 매뉴얼 없이 테스트 코드만 실행해도 성공, 실패 여부를 알 수 있어야한다.
- `Timely`: 바로 사용 가능해야한다.
 
## JUnit
전체 프로젝트(특히 WAS)를 구동하지 않고 단위(유닛) 테스트를 할 수 있게 해주는 라이브러리
- `@Test`: 테스트를 수행하는 메서드를 지정
- `@Ignore`: 테스트를 실행하지 않도록 지정
- `@BeforeEach` / `@AfterEach`: 테스트 메서드가 실행되기 전, 후로 항상 실행되는 메서드를 지정
- `@BeforeAll` / `@AfterAll`: (각각의 메서드가 아닌) 해당 클래스에서 딱 한번만 수행

#### JUnit 확장기능 구현하기
- JUnit version이 5미만이라면, 테스트 클래스 앞에 어노테이션으로 `@RunWith`를 붙여주고 원하는 Runner class를 넣어준다.
  - ex: `@RunWith(SpringRunner.class)`, `@RunWith(MockitoJUnitRunner.class)` 등
- JUnit version이 5이상이라면, 테스트 클래스 앞에 어노테이션으로 `@ExtendWith`를 붙여주고 원하는 Extension class를 넣어준다.
  - ex: `@ExtendWith(SpringExtension.class)`, `@ExtendWith(MockitoExtension.class)` 등 

## Spring Test
_(여기서 `Spring Test`라 함은 `@SpringBootTest`를 의미하는 건 아니고, 광의의 Spring Test를 의미한다.)_

ApplicationContext를 만들고 관리하는 작업을 할 수 있도록 JUnit의 기능을 확장해준다. 원래 JUnit에서는 테스트 메소드별로 객체를 따로 생성해 관리하는 반면, Spring Test 라이브러리로 확장된 JUnit에서는 컨테이너 기술을 써서 싱글톤으로 관리되는 객체(= Bean)를 사용해 모든 테스트에 사용하게 된다.

JUnit기능 확장은 위에 작성한 `JUnit 확장기능 구현하기` 내용을 참고하면 되고, 환경설정 파일을 명시하기 위해`@SpringApplicationConfiguration(classes = AppConfig.class)`와 같이 스프링 환경설정 어노테이션을 붙여준다. 환경설정파일이 xml이라면 `@ContextConfiguration(locations = "classpath:xml파일위치")`을 붙여준다.

### SpringBootTest
만일 스프링부트라면 `@SpringBootTest` 어노테이션을 이용할 수 있다. 이 경우 `@ExtendWith(SpringExtension.class)`을 이미 포함하고 있는 것이므로 `@ExtendWith` 따위를 굳이 안붙여줘도 된다.

`@SpringBootTest`를 붙일 때, `@SpringBootTest(webEnvironment=SpringBootTest.WebEnvironment.MOCK)` 이런식으로 옵션을 줄 수 있다.

- `MOCK`: WebApplicationContext를 로드하고 서블릿 컨테이너 환경을 mocking 한다. 내장된 서블릿 컨테이너는 전혀 시작되지 않는다.
- `RANDOM_PORT`: EmbeddedWebApplicationContext를 로드하고 내장된 서블릿 컨테이너가 시작되는데 요청을 받아들이는 port를 랜덤하게 바꾸고 시작한다.
- `DEFINED_PORT`: EmbeddedWebApplicationContext를 로드하는데, 지정한 포트를 가지고 요청을 받아들인다. (default는 `8080`)
- `NONE`: ApplicationContext를 로드하기는 하지만 서블릿 컨테이너 환경을 제공하지 않는다.


### Mock Framework - `Mockito`
- 실제 역할(DB와 연동 등)을 하지 않으면서 메서드를 호출할 수 있는 객체을 만들어 사용하게 해주는 것이다.
- `@RunWith(MockitoJuitRunner.class)`나 `@ExtendWith(MockitoExtension.class)`로 기존 JUnit을 확장해서 쓴다.
- Mock 객체를 주입할 때에는 마치 `@Autowired`와 비슷한 컨셉으로,
  * `@Mock`를 통해 Mock 객체를 등록해주고
  * 그렇게 등록된 Mock 객체를 `@InjectMocks`를 통해 자동주입 가능하다.
  * 예컨대 `@Mock`이 repository에 붙었다면 `@InjectMocks`는 service에 붙이는 거겠다.

### Mock vs Spy
- Mock은 껍데기뿐인 Bean을 스프링 컨텍스트에 새로 등록해주는 컨셉이다.
- Spy은 실제 있는 스프링 Bean을 감싸는 프록시 객체의 컨셉이다.(따라서 해당 인터페이스에 맞는 Bean이 실제로 스프링 컨텍스트에 존재해야만 한다.)
 스파이는 stub한것만 

### Mock과 MockBean
`@Mock`
- Mokito에 있고,
- `@InjectMocks`로 Mock 객체를 자동 주입한다.

`@MockBean`
- `@Mock`비슷한 역할을 하지만 스프링부트영역에 있다.
- `@SpringBootTest`와 함께 쓰므로 `@Autowired`로 Mock 객체를 자동 주입한다.

### DB 테스트할 때 DB에 반영되지 않게 하기
`@SpringBootTest`와 함께 `@Transactional`을 테스트용 Class에 붙이면, 테스트 실행할 때 트랜잭션 실행 후 롤백해준다. 그래서 DB에 넣었던 데이터가 반영이 안된다. 그럼에도 불구하고 굳이 변경사항을 commit하고 싶은 케이스가 있으면 그 메서드에 `@Commit`을 붙여주면 된다.  
  