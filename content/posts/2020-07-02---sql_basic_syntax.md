---
title: "SQL 기초 문법"
date: "2020-07-02T00:00"
template: "post"
draft: false
slug: "sql-basic-syntax"
category: "Database"
tags:
  - "Database"
  - "SQL"
  - "RDB"
description: "SQL 기초 문법에 대해 전반적으로 훑어본다."
---

#### Manipulation
- `CREATE TABLE`: 새로운 테이블을 만든다.
- `INSERT INTO`: 테이블에 새로운 Row를 추가한다.
- `SELECT`: 테이블로부터 데이터를 질의해온다.
- `ALTER TABLE`: 존재하는 테이블을 수정한다.
- `UPDATE`: 테이블에 있는 Row를 수정한다.
- `DELETE FROM`: 테이블로부터 데이터를 삭제한다.
- 테이블을 만들 때 제약조건을 걸어 Column이 어떻게 사용되는지 정보를 제공할 수 있다.

#### Queries
- `SELECT`: DB로부터 원하는 정보를 쿼리할 때 사용한다.
- `AS`: 쿼리 내에서 Column 이름을 새로 정하거나, Table 이름을 새로 정한다.
- `DISTINCT`: 중복이 제거된, 유니크한 값들만을 남긴다.
- `WHERE`: 특정 조건을 기반으로 쿼리 결과를 필터링한다.
- `LIKE`와 `BETWEEN`: 조건에 의해 비교하여 판별한다.
- `AND`와 `OR`: 여러 조건을 조합한다.
- `ORDER BY`: 결과를 정렬한다.
- `LIMIT`: 쿼리하여 가져올 결과 Row 수의 최대치를 설정한다.
- `CASE`: 조건에 따라 다른 결과를 만들어낸다.

#### Aggregate Functions
- `COUNT()`: Row의 수를 센다.
- `SUM()`: 해당 Column에 있는 값들의 합을 구한다.
- `MAX()`/`MIN()`: 최대/최소값을 구한다.
- `AVG()`: 해당 Column에 있는 값들의 평균을 구한다.
- `ROUND()`: 해당 Column에 있는 값들을 반올림한다.
- `GROUP BY`: Column의 값을 기준으로 데이터를 집계한다.
- `HAVING`: 집계된 값을 기준으로 쿼리 결과를 제한한다.

#### Multiple Tables
- `JOIN`: join조건이 참인 경우에 대해 서로 다른 테이블의 row를 한 row로 합친다.
- `LEFT JOIN`: 왼쪽 테이블은 모든 row가 들어가고 join조건이 참이 아닌 경우 오른쪽 테이블의 column엔 null이 들어간다.
- `Primary key`: 각 Row의 유니크한 식별자 역할을 하는 Column이다.
- `Foreign key`: 다른 테이블의 Primary Key를 하나의 Column으로 가지는 것이다.
- `CROSS JOIN`: 다른 테이블끼리 모든 Row를 병합하게 하는 것이다.
- `UNION`: 서로 다른 테이블 간에 Row를 쌓는다.
- `WITH`: 쿼리 결과물을 마치 일시적인 테이블처럼 사용할 수 있게 해준다.

---

> [참고자료]  
> https://www.codecademy.com/learn/learn-sql  
