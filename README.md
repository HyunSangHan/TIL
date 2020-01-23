# Today I Learned
Gatsby.js를 기반으로, [TILLOG](https://tillog.netlify.com/)를 오픈했습니다!(`release` 브랜치에서 관리)

새로 공부한 내용을 토픽 단위로 Markdown을 활용하여 정리하고 있습니다.  
여러 주제를 하나의 문서로 다루기 보다는, 하나의 개념만 하나의 문서로 컴팩트하게 짧은 호흡으로 다루는 것을 지향합니다.  

잘못된 내용이 있다면 [Pull Request](https://github.com/HyunSangHan/TIL/pulls)로 고쳐주시거나 혹은 [Issue](https://github.com/HyunSangHan/TIL/issues)를 통해 알려주시면 감사하겠습니다!  
**간단한 오타에 대한 수정이라도 기여는 늘 환영합니다.**  

### 브랜치
- 내용에 대한 수정 PR은 `master` 브랜치를 대상으로 올려주세요.
- 템플릿에 대한 수정은 `release` 브랜치를 대상으로 PR 올려주셔도 괜찮지만, 가급적 Issue의 형태로 제안해주시면 좋겠습니다.

### 파일명 작성 규칙(master branch 기준)
- 소문자만 사용
- 띄어쓰기는 언더스코어를 이용하여 표시
- 두 개 이상의 개념을 함께 다룰 때, 비교/대조 중심이면 `vs`로 연결
  * 예시: `uri_vs_url`
- 두 개 이상의 개념을 함께 다룰 때, 서로 이웃한 개념이라면 `&`로 연결
  * 예시: `process&thread`
- shorten name이 full name보다 보편적으로 많이 쓰이는 경우에 한해 줄여서 쓰고, 그 외에는 full name을 사용
- 개념을 다루는 게 아니라 사용법을 다루는 경우 `how_to_use_`를 앞에 붙여서 구분