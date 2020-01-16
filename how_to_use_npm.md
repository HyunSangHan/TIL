> [참고자료]  
> 김정환, 모던 프론트엔드 개발 환경의 이해, 68차 토크ON세미나(2020. 1. 15.), T아카데미(SK Planet).  

이번 글은 2020년 1월 15일에 서울대 SKT연구소에서 T아카데미 주관으로 진행된 <모던 프론트엔드 개발 환경의 이해>(강사: 김정환 님)라는 세미나의 필기 내용이다. 주요 내용 위주로 필기했기 때문에, 다른 글에 비해 흐름이 다소 병렬적일 수 있음에 양해바란다. 

# NPM(Node Package Manager)
- 프론트엔드 개발자가 Node.js 최소한이라도 배워야 하는 이유는, 모던 프론트엔드 개발을 위한 개발 환경을 셋팅하려면 적어도 NPM은 쓰게 되는 등 자연스럽게 접하게 되기 때문이다.
- NPM은 Node.js를 설치하면 함께 설치된다.
- NPM은 PHP의 컴포져(Composer)나 자바의 그래들(Gradle)과 같은 역할이다.
- React.js를 다룰 때, CRA(Create React App)를 쓰는 경우가 많아 직접 `npm init`부터 해볼 기회가 많지 않을 수 있는데 그러한 boilerplate의 도움없이 프로젝트를 시작하는 방법을 배워보자.

### 프로젝트 초기화
- `npm init`이라는 명령어를 쓰고, 이어 등장하는 정보입력란에 답하면 package.json이 생긴다.
- 모두 기본값을 사용할 것이라면 `npm init -y` 명령어로 질문을 스킵할 수 있다.

### package.json와 scripts
- 프로젝트의 핵심 정보들을 담고 있다.
  ```
  name : 프로젝트 이름
  version : 프로젝트 버전 정보
  description : 프로젝트 설명
  main : 노드 어플리케이션일 경우 진입점 경로. 프론트엔드 프로젝트일 경우 사용하지 않는다.
  scripts : 프로젝트 명령어를 등록할 수 있다. 초기화시 test 명령어가 샘플로 등록되어 있다.
  author : 프로그램 작성자
  license : 라이센스
  ```

- 참고로, 이 중 scripts 부분은 `npm init`을 했다면 아래와 같이 되어있을 텐데, `npm test` 명령어를 쓰게 되면 "Error: no test specified"라는 메시지를 출력한 뒤 에러 코드 1을 던진다.
  ```json
  {
    "scripts": {
      "test": "echo \"Error: no test specified\" && exit 1"
    }
  }
  ```

- 사용 가능한 NPM 명령어는 다음과 같다. 이 중에서 `start`, `test`, `install`, `uninstall`을 많이 쓴다. 이 명령어들은 `npm start`처럼, 앞에 `npm`을 붙여 쓴다.
  ```
  access, adduser, audit, bin, bugs, c, cache, ci, cit,
  clean-install, clean-install-test, completion, config,
  create, ddp, dedupe, deprecate, dist-tag, docs, doctor,
  edit, explore, get, help, help-search, hook, i, init,
  install, install-ci-test, install-test, it, link, list, ln,
  login, logout, ls, org, outdated, owner, pack, ping, prefix,
  profile, prune, publish, rb, rebuild, repo, restart, root,
  run, run-script, s, se, search, set, shrinkwrap, star,
  stars, start, stop, t, team, test, token, tst, un,
  uninstall, unpublish, unstar, up, update, v, version, view,
  whoami
  ```

- 위 명령어 리스트 중 `build`는 없음을 알 수 있다. 커스텀으로 작성해야하는 명령어이기 때문이다. 커스텀 명렁어의 경우 `npm run`을 앞에 붙여서 사용한다.

- 이 npm script에 커스텀 명령어 `"transfile" : "babel"` 써두고 `npm run transfile`을 실행하면, 먼저 `./node_modules`에서 babel을 찾고
거기서 못찾으면 `전역`으로 설치한 babel을 찾아 실행하게 된다.

#### npx는 뭐야?
매번 `./node_modules/.bin/babel app.js`와 같이 쓰긴 힘드니, `npx babel app.js`라고 대체해서 쓸 수 있다. npm을 깔았으면 npx는 쓸 수 있게 된다.
