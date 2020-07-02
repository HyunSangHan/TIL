---
title: "DELETE vs TRUNCATE vs DROP"
date: "2020-07-03T01:00"
template: "post"
draft: false
slug: "sql-delete-truncate-drop"
category: "Database"
tags:
  - "Database"
  - "SQL"
  - "RDB"
  - "Comparison"
description: "DELETE FROM, TRUNCATE, DROP 모두 테이블의 데이터를 삭제하는 기능을 한다. 어떤 차이가 있는지 알아본다."
---

## DELETE (DELETE FROM)
테이블의 존재가 유지되며 데이터는 지우지만 디스크 공간을 반납하지 않고 auto_increment 값도 유지된다.

## TRUNCATE
테이블의 존재가 유지되며 데이터를 지우면서 디스크 공간도 반납하고 auto_increment 값도 초기화된다.

## DROP
테이블 자체를 없애버린다.

---

> [참고자료]  
> https://cbw1030.tistory.com/71   
