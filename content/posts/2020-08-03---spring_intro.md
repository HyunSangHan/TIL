---
title: 스프링 입문
date: "2020-08-03T00:00"
template: "post"
draft: false
slug: "spring-intro"
category: "Spring"
tags:
  - "Spring"
  - "Java"
  - "How to use"
description: "김영한 님의 스프링 입문 강의에 대한 필기내용이다.(내용이 좀 길다.)"
---

> 이번 글은 Inflearn 및 Youtube에 무료로 공개되어있는 <스프링 입문 - 코드로 배우는 스프링 부트, 웹 MVC, DB 접근 기술>(강사: 김영한 님)라는 강의의 필기 내용이다. 주요 내용 위주로 필기했기 때문에, 다른 글에 비해 흐름이 다소 병렬적일 수 있음에 양해바란다.  

# 환경설정
대부분의 환경설정은 생략한다.

## View 환경설정
```java
@Controller // 컨트롤러 어노테이션을 붙여줘야 함. 뭔가 요청이 들어오면 WAS인 톰캣이 컨트롤러에다가 물어보게 된다.
public class HelloController {

  @GetMapping("hello") // 주소가 /hello인 GET요청에 대해서
  public String hello(Model model) { // 모델은 스프링이 넣어주는 거고
    model.addAttribute("data", "hello!!"); // 타임리프 템플릿엔진에서 data라는 변수(=key)에 hello!라는 문자열(=value)을 넣어서
    return "hello"; // resources/templates/hello.html을 리턴해준다.
  }
}

```

## 빌드하고 실행하기
```console
$ ./gradlew build # 빌드하기 
```

빌드하면 build 폴더가 생긴다. 그 안에는 libs 폴더가 있다.
즉, build/libs에 들어가면, jar파일이 생겨있다. 이걸 실행하면 된다.

```console
$ java -jar jar파일명 # 실행하기
```

# 스프링 웹 개발 기초
## 정적 컨텐츠
- `resources/static`에 있는 파일은 `/파일명`으로 접근했을 때 그 html을 브라우저에서 볼 수 있다.
- 무슨 원리냐? 톰캣이 먼저 스프링컨테이너의 컨트롤러 쪽에서 `파일명.html`이 있는지를 찾아본다.(=우선순위다.) 근데 맵핑된 것이 없다. 그럼 resources에서 찾아서 반환해준다.

## MVC와 템플릿 엔진
- MVC: Model, View, Controller로 관심사를 분리한 것
- 아래와 같이 파라미터를 받을 수도 있다.
    ```java
    // controller/HelloController
    @Controller
    public class HelloController {

     ...
        @GetMapping("hello-mvc")
        public String helloMvc(@RequestParam("name") String name, Model model) {
          model.addAttribute("name", name);
          return "hello-template";
        }
    }
    ```
- required가 true면 필수값, false면 그 파라미터는 안넘겨도 되는 것이다.(required는 디폴트가 true이며, 위 예제에선 명시하지 않고 생략했음)
- 아래와 같이 UI에 반영한다.
    ```html
    <!-- templates/hello-template.html -->
    <html xmlns:th="http://www.thymeleaf.org">
      <body>
        <p th:text="'hello ' + ${name}">hello! empty</p> <!--p태그 사이 값은 마크업용이라고 보면 됨. 실제로는 동적으로  th:text가 그걸 치환함.-->
      </body>
    </html>
    ```

## API
- return한 게 뭐, 뷰(html) 그런게 아니라 이 문자 그대로 응답이 된다는 게 이전 패턴들이랑 다르다.
    ```java
    @Controller
    public class HelloController {

    ...
      @GetMapping("hello-string")
      @ResponseBody // "HTTP의 body를 응답에 직접 이용하겠다" 라는 뜻
        public String helloString(@RequestParam("name") String name) {
        return "hello " + name;
      }
    }
    ```
- API스럽게 JSON 방식으로 응답하려면 먼저 객체(및 getter, setter)를 만들어서 응답해주는 게 일반적이다. 객체가 응답되면 (JsonConverter라는 녀석이) 내부적으로 JSON스타일로 변환하여 응답한다.
    ```java
    @Controller
    public class HelloController {

    ...    
      @GetMapping("hello-api")
      @ResponseBody
      public Hello helloApi(@RequestParam("name") String name) {
        Hello hello = new Hello();
        hello.setName(name);
        return hello;
      }
      static class Hello {
        private String name;
        public String getName() {
          return name;
        }
        public void setName(String name) {
          this.name = name;
        }
      }
    }
    ```
- (위와 관련 없지만 하나 알게된 점!) 참고로 HTTP 요청 시 accpet헤더에 포맷을 정의하면, 그 포맷대로 응답을 받을 수도 있다.

# 회원 관리 예제 - 백엔드 개발

## 비즈니스 요구사항 정리
- (예제를 위해 가상으로 요구사항을 만들어오셨음)
- 일반적인 웹 애플리케이션 계층 구조는 아래와 같다고 한다.
  - 컨트롤러: 웹MVC의 컨트롤러 역할(노드에서 라우터 느낌으로 이해함)
  - 서비스: 핵심 비즈니스 구현
  - 리포지토리: DB에 접근
  - 도메인: 비즈니스 도메인 객체

## 회원 도메인과 리포지토리 만들기
- (코드는 강의자료에 있으므로 생략함)
- 도메인에는 가장 핵심이 되는 객체를 생산할 class를 두는 것 같다.
- `Optional.ofNullable()`로 감싸 return함으로써 null에 대비 가능

## 회원 리포지토리 테스트 케이스 작성
- 컨벤션으로, 예컨대 `MemoryMemberRepository`를 테스트한다면 테스트파일은 `MemoryMemberRepositoryTest`와 같이 `Test`를 붙여서 이름짓는다.
- test 클래스 앞에는 public을 붙이지 않아도 되네. 어디서 갖다쓸 게 아니니까.
- `@Test`라는 어노테이션을 붙이면 그 메서드를 실행시킬 수 있다.(고로 테스트가 가능해진다.)
- `Assertions.assertEquals(기대값, 실제값);`을 통해서 테스트를 assert할 수 있다.
    ```java
    public class MemoryMemberRepositoryTest {
    
      MemberRepository repository = new MemoryMemberRepository();
    
      @Test
      public void save() {
        Member member = new Member();
        member.setName("아무거나");
    
        repository.save(member);
    
        Member result = repository.findById((member.getId())).get();
        Assertions.assertEquals(member, result);
      }
    }
    ```
- 테스트케이스는 순서 보장이 안된다. 순서에 의존적으로 짜면 안된다!
- 따라서 순서가 섞여 어떤 테스트는 실패해버릴 수도 있는데, 클린업 코드를 통해 매번을 독립시행으로 만들어줄 수 있다. afterEach를 통해서. 참고로 `@AfterEach` 어노테이션을 붙여준다. 강의에서는 MemoryMemberRepository에다가 clearStore라는 메서드를 정의해서, `store.clear()`가 되도록 했다.

## 회원 서비스 개발
- null일 가능성이 있으면 Optional을 쓰는데, Optional 형태에 데이터가 감싸져있으면 또 좋은점이 옵셔널에 있는 여러 메서드들을 이용할 수 있다는 것이다.
- Optional 안의 데이터를 꺼내려면 get메서드를 쓰면 된다.
- 그리고 코드 내의 어떤 특정 로직을 메서드로 뽑아내고 싶으면 `ctrl + t`를 눌렀을 때 리팩토링과 관련된 여러 기능들이 나오는데, 그중 (extract) method를 쓰면 된다.
- repository는 보통 그냥 DB에 넣었다 뺐다 수준의 메서드인 반면, service는 좀더 비즈니스와 가깝게 메서드 네이밍을 한다. 

## 회원 서비스 테스트
- service에 있는 메서드들에 대한 테스트코드를 작성할 때, 직접 파일을 만들 수도 있지만 해당 Class에서 `command + shift + t`를 누르면 자동으로 테스트 파일을 만들어주기도 한다.
- 테스트는 `given` - `when` - `then` 순서로 구분지어 작성하는 걸 추천한다.
  - `given`: 주어진 상황
  - `when`: 어떤 걸 실행했을 때를 검증?
  - `then`: 이렇게 되어야 한다.
- 테스트 내에서 `fail()`을 쓰면 그 부분에서 테스트가 실패로 인식된다.
- OOOService에서 만든 OOORepository 인스턴스랑 OOOServiceTest에서 만든 OOORepository 인스턴스랑 달라져버리면 제대로된 테스트라고 보기 어려우므로 하나의 OOORepository를 써야 할 것이다. 이럴 땐 어떻게 하느냐? OOOService 내에서 OOORepository를 `new OOORepository();`처럼 직접 생성하지 말고, OOORepository를 OOOService에 들어가도록 인자로 넣어준다. 이런 걸 **DI(의존성 주입)** 라고 한다. 직접 인스턴스를 만든 게 아니라 외부에서 디펜던시를 주입받았기 때문이다.(여기선 OOOService가 OOORepository에 의존하고 있는 상황인데, OOORepository를 주입받았다는 것.)

# 스프링 빈과 의존관계
## 방법1) 컴포넌트 스캔과 자동 의존관계 설정
- 컨트롤러에서 서비스를 직접 new로 생성해서 쓸 수도 물론 있겠지만, 그러면 여러 컨트롤러에서 중복으로 서비스 인스턴스를 생성하는 문제가 생긴다. 이를 공통으로 쓰기 위해서, 스프링 컨테이너에 등록을 하고 꺼내 쓰면 된다. 그럼 스프링 컨테이너가 뜰 때 싱글톤으로 단 1번 서비스 인스턴스가 생기게 되는데 이는 싱글톤이므로 여러 컨트롤러에서 DI를 받아서 공통으로 쓸 수 있다. 
- `@Autowired`를 붙이면 거기에 빈을 주입해준다. 컨트롤러 앞에는 `@Controller`, 서비스 앞에는 `@Service`, 리포지토리 앞에는 `@Repository`를 붙여서 빈으로 등록한다. 이렇게 등록하면 Component Scan을 통해 스프링이 뜰 때 스프링 컨테이너로 가져와서 빈으로 등록해주는 것이다.
- `@Component` 어노테이션도 아닌데 웬 컴포넌트 스캔이냐고? `@Controller`, `@Service`, `@Repository` 모두 내부적으로 `@Component` 어노테이션이 있기 때문에 컴포넌트 스캐닝 대상이다.
- 참고로, 동일 패키지 내에서만 컴포넌트 스캔을 한다. 메인메서드가 있는 위치가 특정 패키지 내라서 그렇다.
- 참고로, DI에는 (1) 생성자주입, (2) 필드주입, (3) setter주입이 있다. 생성자주입을 권장한다.

## 방법2) 자바 코드로 직접 스프링 빈 등록하기
- config파일을 만들어서 `@Configuration` 어노테이션을 붙인 클래스를 작성하고, 그 안에 예컨대 OOOService나 OOORepository 등의 함수를 작성한 후 거기에 `@Bean` 어노테이션을 붙여주면 된다. 그럼 이 둘이 빈에 등록되는 것이다.
- 과거엔 xml문서로 설정을 했었는데(아마 pom.xml을 의미하는 듯) 요즘은 이렇게 자바코드로 작성한다.
- 방법1이 주로 간편은 하지만, 방법2가 간편할 때가 있다. 예컨대 이 예제에서 MemoryMemberRepository를 JdbcMemberRepository로 통째로 바꿔치기 할 때, config파일에서 딱 1줄만 고치면 되었다.

# 회원 관리 예제 - 웹 MVC 개발
## 회원 웹 기능 - 홈 화면 추가
- (필기할 만한 내용은 없었음)

## 회원 웹 기능 - 등록
- html에서 form과 input태그로 뭔가를 입력받아 DB에 저장하는 과정을 실습했다.
- input태그에서의 name이 바로 컨트롤러에서 쓰는 OOOForm의 멤버변수와 이름이 같아야 그 값을 가져올 수 있다.
  - 약간.. 여기서 Form이 곧 node에서 bodyParser 느낌인 것 같다.
- `@PostMapping`을 해줌으로써 DB에 뭔가(여기선 회원)를 저장하는 컨트롤러를 작성해야 한다.
- `redirect:/`을 리턴하면, 웰컴페이지(루트 경로의 페이지)로 리다이렉트 시키라는 뜻의 로직이다.
- 원리: Controller가 URL을 맵핑해서 로직을 선정해주고, 그게 Service의 메서드(여기선 join)를 쓰고 있을 것이다. 그런데 서비스의 메서드는 Repository의 메서드(여기선 save)를 쓰므로 DB에 저장을 하게 된다.

## 회원 웹 기능 - 조회
- (필기할 만한 내용은 없었음)

# 스프링 DB 접근 기술
## H2 데이터베이스 설치
- H2는 테스트용으로 쓰곤 하는 간단한 데이터베이스다.

## 순수 JDBC
- 옛날엔 이렇게 짰다. 코드량이 어마어마하다.
- `build.gradle`에다가 JDBC를 디펜던시로 추가해줘야 한다. DB로 쓰기로한 H2도 마찬가지로 추가.
- `application.properties`에 `spring.datasource.url = jdbc:h2:tcp://localhost/~/test`이런식으로 추가해주고, `spring.datasource.driver-class-name`에도 예컨대 `org.h2.Driver` 같이 추가해준다. 그다음 코끼리 모양 아이콘을 눌러서 Gradle을 리프레시해준다.
- 기존에 이 예제에서 `MemberRepository`라는 인터페이스가 있었고, `MemoryMemberRepository`라는 구현체를 만들어서 메모리DB를 썼었다. 이제는 예컨대 `JdbcMemberRepository`라는 파일을 만들어서 또다른 구현체를 만든다.
- 스프링이 `dataSource`를 만들어서 주입해주면, 그걸 `JdbcMemberRepository`가 받아서 `dataSource.getConnection()`으로 커넥션을 만들어낸다. 그걸 connection이라는 객체에 담아서, prepareStatement라는 메서드에다가 sql문을 넣는다. 그다음, setString 메서드를 사용해서 데이터를 넣고 executeUpdate라는 메서드를 사용해서 실제 쿼리를 던진다.
- 더이상 실무에서 잘 쓰지 않는다.

## 스프링 통합 테스트
- 스프링도 띄우고 DB까지 다 연결해서 테스트하는, 통합 테스트를 해보는 실습.
- `@SpringBootTest` 어노테이션을 활용한다. 스프링 컨테이너와 함께 테스트를 실행하겠다는 의미다.
- `@Transactional` 어노테이션을 활용하면, 트랜잭션을 이용하게 된다. 따라서 `@Commit` 어노테이션을 명시해주지 않는 한, 롤백이 되어버린다. 따라서 각 메서드별 테스트 시 독립시행처럼 이루어진다.(테스트간 서로 영향을 주지 않게 된다.)

## 스프링 JdbcTemplate
- JDBC에서의 반복코드를 제거해준다. 
- 단, SQL은 직접 작성해야 한다.
- RowMapper라는 걸 만들어, SQL의 결과를 객체화 해서(= 객체에 맵핑해서) 리턴해준다. 그렇게 리턴된 rowMapper 객체를 화룡해서 최종 결과를 얻는다. 뭔가 이 RowMapper를 따로 빼서 정의해두고, 이를 공통으로 씀으로써 반복코드를 제거하는 것으로 이해했다.

## JPA
- ORM기술이며, SQL쿼리까지 JPA가 대신 DB에 날려주어 개발생산성이 매우 올라간다. SQL보다는 객체 중심의 설계가 가능해진다.
- `build.gradle`에다가 data-jpa를 디펜던시로 추가해줘야 한다. DB로 쓰기로한 H2도 마찬가지로 추가.
- `application.properties`에 `spring.jpa.show-sql=true`, `spring.jpa.hibernate.ddl-auto=none`으로 설정해두고 시작하자.
- domain에서 `@Entity`라는 어노테이션을 붙여준다. 그리고 그 안에서 pk인 애는 `@Id`를 붙여준다. 자동으로 id(시퀀스)를 관리하게 만들 거라면 `@GeneratedValue(strategy = GenerationType.IDENTITY)`도 붙여준다.
- 만약 DB의 컬럼이름이 username인데 우리 도메인 객체에서 name이면 `@Column(name = "username")` 이런식으로 어노테이션을 붙여준다.
- JPA는 EntityManager라는 걸로 모든 게 동작한다. 즉, JPA를 쓰려면 리포지토리 내에서 EntityManager를 주입받아야한다. 
- JPQL이란? SQL이랑 비슷한 문법이긴 한데, 객체(정확히는 Entity)를 대상으로 쿼리를 날리는 거. 본 실습에서는 findByName이랑 findAll을 구현할 때 사용했다.
- JPA를 쓰려면, Service 계층에 `@Transactional`을 걸어놔야한다.
- JPA는 사실 인터페이스고, 구현체인 Hibernate가 쿼리를 날려준다.

## 스프링 데이터 JPA
- 마법처럼, 인터페이스만으로 구현을 완료할 수 있다.
- 많은 경우 메서드 이름만으로도 개발을 끝내버릴 수 있다.
- `findByName`이나 `findById`, `findAll` 등 보편적인 메서드(기본적인 CRUD 등)는 이미 구현을 해두었기 때문에, 그 경우에 대해 인터페이스만으로 구현이 끝난다는 뜻으로 이해했다.
- 물론 이렇게 공통 메서드 모두를 지원해주진 못한다. 모든 걸 공통하는 건 불가능하기 때문에.
- ORM으로 모든 걸 해결할 수 없다고 보고, 네이티브 SQL 쿼리도 쓸 수 있게 되어있다.

# AOP
## AOP가 필요한 상황
- "모든 메서드에 시간(성능)측정 로직을 추가해라"라는 오더가 떨어진다면? 모든 메서드마다 노가다로 이를 끼워 넣을 것인가? 그건 너무 불편하다. 메서드를 사용해 공통로직으로 뽑는다? 그게 어려운 경우가 많다. AOP를 이용하면 이를 해결할 수 있다.
- 시간측정 로직 같은 것들은 핵심 관심 사항(core concern)이 아니라, 공통 관심 사항(cross-cutting concern)이다. 이를 유지보수하기 쉽게 해주는 게 바로 **AOP**다.

## AOP 적용
- AOP는 관점지향 프로그래밍을 뜻한다.
- (이 예제에서는) 각 메서드별로 시간측정 로직을 넣는 게 아니라, 시간측정 로직을 한곳에 모으고 원하는 곳들에 적용하는 거다.
- 자세한 사용법은 가이드문서를 보면서 하면 된다고 한다. 사용이 필요하게 되면 가이드를 찾아보면서 하자.
- aop라는 패키지(디렉터리)를 하나 만들고, 그 하위에 `OOOOAop`라고 class(java)파일을 만든다.
- 정형화된 놈들(Controller, Service, Repository)은 어노테이션으로 빈으로 등록해줘도 괜찮지만, Aop는 config파일에서 직접 `@Bean`으로 등록해주는 게 좋다. 정형화되었다기 보다는 딱 목적이 있는 것이므로.
- AOP파일에서 `@Around` 어노테이션을 이용해서 어디에 적용할지를 적어준다.
- AOP의 작동 원리?
  - 원래 컨트롤러가 서비스에 의존하게 되는데, AOP가 적용되고 나면 컨트롤러가 프록시(가짜) 서비스에 의존하게 된다. 그리고 거기서 `joinPoint.proceed()`를 통해 진짜 서비스가 호출된다. 참고로, Proxy가 출력되는지는 콘솔에 출력해서 확인해볼 수 있다.

---

> [참고자료]  
> https://www.youtube.com/watch?v=-oeeqfRVrzI&list=PLumVmq_uRGHgBrimIp2-7MCnoPUskVMnd
