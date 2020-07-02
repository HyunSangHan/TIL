---
title: "SQL SELECT 쿼리의 작성/실행 순서"
date: "2020-07-03T00:00"
template: "post"
draft: false
slug: "sql-select-query"
category: "Database"
tags:
  - "Database"
  - "SQL"
  - "RDB"
  - "Performance"
description: "SQL에서 SELECT 쿼리를 할 때 작성순서와 별개로 실행순서를 알고 쿼리를 짜면 퍼포먼스 이슈를 방지할 수 있다."
---

SQL에서 SELECT 쿼리를 할 때 작성순서와 다른 `실행순서`까지도 알고 쿼리를 짜면 퍼포먼스 이슈를 방지할 수 있으니 알아두자.

## 쿼리의 작성 순서 및 실행 순서
구분 | 작성 순서 | 실행 순서 | 설명
:--: | :--: | :--: | --
SELECT | 1 | 5 | 필요한 컬럼만 뽑아서
FROM | 2 | 1 | 해당 데이터가 있는 곳을 찾아가서
WHERE | 3 | 2 | 조건에 맞는 데이터를 가져오고
GROUP BY | 4 | 3 | 원하는 데이터로 가공
HAVING | 5 | 4 | 가공한 데이터에서 조건에 맞는 것만
ORDER BY | 6 | 6 | 정렬하고
LIMIT | 7 | 7 | 원하는 개수만큼 남김


실행순서는 문법/권한 검사 순서이기도 하고, Alias 등록 순서 이기도 하다.

---

> [참고자료]  
> https://police84.tistory.com/69
