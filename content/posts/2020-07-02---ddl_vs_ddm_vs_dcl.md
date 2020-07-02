---
title: "DDL vs DDM vs DCL"
date: "2020-07-02T01:00"
template: "post"
draft: false
slug: "sql-ddl-ddm-dcl"
category: "Database"
tags:
  - "Database"
  - "SQL"
  - "RDB"
  - "Comparison"
description: "DDL(Data Definition Language)은 데이터 정의어, DML(Data Manipulation Language)은 데이터 조작어, DCL(Data Control Language)은 데이터 제어어를 의미한다."
---

## DDL(Data Definition Language, 데이터 정의어)
데이터베이스나 테이블을 다루며, 데이터의 전체 골격을 결정하는 역할의 언어를 말한다.
- `CREATE`, `ALTER`, `DROP`, `TRUNCATE` 등

## DML(Data Manipulation Language, 데이터 조작어)
테이블에 들어있는 레코드를 다루며, 저장된 데이터를 실질적으로 처리하는데 사용하는 언어를 말한다.
- `SELECT`, `INSERT`, `UPDATE`, `DELETE` 등

## DCL(Data Control Language, 데이터 제어어)
데이터베이스에 접근하거나 객체에 권한을 주는 등의 역할을 하는 언어를 말한다.
- `GRANT`, `REVOKE`, `COMMIT`, `ROLLBACK` 등

---

> [참고자료]  
> https://cbw1030.tistory.com/71   
