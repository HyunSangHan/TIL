---
title: MongoDB 입문
date: "2020-08-06T00:00" # THU
template: "post"
draft: false
slug: "mongodb-intro"
category: "Database"
tags:
  - "MongoDB"
  - "How to use"
  - "NoSql"
description: "데이터 객체들이 Collection 내부에서 독립된 Document로 저장되는, Document 기반의 NoSQL 데이터베이스이다."
---

## MongoDB 특징
- 장점: NoSQL, RDB 모두의 장점을 갖고 있다. **secondary index**가 가능하다.(Hbase에 비해 큰 강점)
- 단점: RDB보다 IO측면(저장 및 조회에 필요한 용량이 약 3배를 차지한다.)
​
## MongoDB vs RDB 용어 비교
MongoDB | RDB
:--: | :--:
Collection | Table
Document | Row
Field | Column

## 몽고DB의 WiredTiger 엔진(v3.0~)
도큐먼트 레벨 Lock이라서 동시성이 훨씬 좋아졌다
​
#### WiredTiger의 데이터 쓰기
- Skip List: 쓰기 빠르게 하기 위해 변경사항을 직접 수정하지 않고 스킵 리스트로 관리
  - 마치 git같이 버전관리 느낌으로 변경사항이 누적되는 걸로 이해됨
  - MVCC(Multi Version Concurrency Control)
- Hazard Pointer: 메모리에서 해제하지 않게끔 해주는 것
- Eviction: 오랫동안 사용하지 않은 캐시 삭제
​
## MongoDB의 복제
- 서버간 데이터 동기화하는 알고리즘: `Raft` 모델 vs `Paxos` 모델
  - 프라이머리에서만 쓰기 가능: Raft
  - 세컨더리에서도 쓰기 가능: Paxos모델
- **몽고DB는 Raft에 가까움**
​
## Replica Set
- Primary와 Secondary
- 읽기 로드 분산

Read<br>Preference<br>Mode | Description | 비고
:--: | -- | --
primary | Default Mode 모든 작업이 프라이머리 멤버에서 수행 Multi-document transaction에서는 항상 같은 멤버에서 쿼리해야 하므로 이 옵션 사 용해야 함 | 디폴트
primaryPreferred | Primary Preference를 default로 하되, Primary가 불가 상태가 될 경우 Secondary 멤버에서 read 처리 |  
secondary | 모든 작업이 Secondary 멤버에서 수행 |  
secondaryPreferred | 권고 사항 – 읽기 부하 분산을 위해 Secondary Preference를 default로 하되, Secondary가 불가 상태 또는 모든 secondary의 복제 지연이 axStalenessSeconds(90초)를 넘어설 경우 Primary 멤버에서 read 처리 | 권장사항
nearest | 네트워크 레이턴시를 기준으로 가장 가까운 멤버에서 read 처리 레플리카 셋 멤버이 글로벌하게 분산되어 멤버 별 쿼리 응답시간에 차이가 있을 경우 유용 |  

- Replica Set의 장점 중 하나는, 복사가 빠르고 쉽다는 것. 새로운 Secondary가 필요하면 기존 Secondary를 Primary와 동기화되지 않게 중지시킨 후 새로 만들 Secondary에 물리복사를 하면 됨
- 정족수: 홀수로 유지하는 게 유리. Primary 정할 때 Vote를 해야하므로.
- 아비터(Arbiter): 프라이머리 선출에 관여하지만 실제 데이터는 없는 것(Primary나 Secondary와 물리적으로 분리되어있는 데몬에 띄워야 됨)
- Read Concern: local(보이다 안보이다 할 수 있지만 빠름) / majority(안정적이지만 약간의 레이턴시) / Linearizable(절대쓰면 안됨. 한대라도 죽으면 전체가 장애가나는 옵션이므로)

## 샤딩
- 샤드란? 데이터를 분산해서 저장할 수 있게하는 여러대의 각각의 서버
- 샤딩이란? 여러 서버에 분산해서 데이터를 저장하고 처리할 수 있는 것(스케일 아웃 방식)
  - 수직샤딩: 컬렉션 단위로 데이터를 나누어 할당
  - 수평샤딩: 한 컬렉션을 여러 서버에 나누어 할당
- Mongos: 라우터 데몬(클라이언트와 통신하는 것). Mongos가 Shard와 통신함(쿼리 및 머지). 전적으로 라우터 역할만 해줌

## 샤드키(Shard Key)
- `레인지 샤딩` vs `해시 샤딩`
  - 참고로 몽고DB는 엄밀한 의미로는 레인지 샤딩밖에 안됨
- 지역기반 샤딩(Zone Sharding)도 있음
- 브로드캐스트 쿼리 vs 타겟 쿼리
  - 샤드키가 포함되어있지 않느냐, 포함되어있느냐 차이

## 청크(Chunk)
- 샤드키를 기준으로 나뉘어진 데이터의 조각
- 청크의 단위는 64MB가 디폴트
- 청크밸런싱: 샤드 간 데이터 불균형을 피하기 위해 각 샤드의 청크수를 동일하게 만드는 작업
- 청크스플릿: 청크 사이즈가 너무 크거나(주로 64MB 이상), 25만 건 이상의 도큐먼트를 가지면 청크는 분할됨

## 샤딩으로 인한 제한
- 유니크 인덱스가 유니크하지 않음. 로컬 인덱스이므로, 각 샤드에서는 유니크하지만 전체에선 유니크하지 않을 수 있다는 것

## 몽고DB 쿼리 특징
- 자바스크립트의 문법/몇가지 메소드를 쓸 수 있다.
- 임베딩(도큐먼트 안에 서브 도큐먼트 넣기)은 함부로 쓰면 안된다. 왜냐면 도큐먼트 레벨 락이 걸리기 때문에 누군가 댓글을 쓰고 있을 때 게시물 자체를 아무도 못보게 될 수도 있다.
- insert를 할 때 `ordered: true`옵션을 주면 데이터를 쓰는 순서를 보장받을 수 있다.
- 없는 db, 없는 collection이어도 insert를 하면 자동생성되면서 들어간다.(DDL도 가능하단 얘기)

## CRUD
#### CREATE
`insert`: 참고로 `insertOne`과 `insertMany`의 기능 모두를 포함한다. 이 둘은 예전 버전에 대한 하위호완성을 지키기 위해 남겨둔 것이다. 앞으로는 insert만 알면 된다.

#### READ
> `find`: 찾기

```js
/* [예시1] status가 "A"인 사람들에 대해 (_id 필드를 제외하고) user_id만 가져옴 */
db.people.find(
  { status: "A" }, // filter
  { user_id: 1, _id: 0} // projection
)

/* [예시2] 15 초과 30 이하의 age를 가진 사람들에 대한 모든 정보를 가져옴 */
db.people.find(
  { age: { $gt: 15, $lte: 30} }
)

/* [예시3] 15, 20, 25, 30의 age를 가진 사람들에 대한 모든 정보를 가져옴 */
db.people.find(
  { age: { $in: [15, 20, 25, 30]} }
)

/* [예시4] status가 "A"이거나 age가 50인 사람들에 대한 모든 정보를 가져옴 */
db.people.find(
  { $or: [{ status: "A" }, { age: 50 }] }
)

/* [예시5] status가 "A"이면서 age가 50인 사람들에 대한 모든 정보를 가져옴 */
db.people.find(
  { $and: [{ status: "A" }, { age: 50 }] }
)
// (또는)
db.people.find(
  { status: "A", age: 50 }
)

/* [예시6] user_id가 있는 사람들에 대한 모든 정보를 가져옴 */
db.people.find(
  { user_id: { $exists: true } }
)

/* [예시7] children중에서 name이 "Phenomenon"인 사람들에 대한 모든 정보를 가져옴 */
db.people.find(
  { "children": { $elemMatch: { "name": "Phenomenon" } } }
)
// (또는)
db.people.find(
  { "children.name": "Phenomenon" } // array임에도 그냥 곧바로 체이닝 해서 표현할 수 있음
)
```

#### Update **(주의)**
`update`: 조건에 맞는 1개만 업데이트한다. 여러개 업데이트하려면 `updateMany`를 써야 한다.
- [주의!] 업데이트할 때 `$set`연산자를 반드시 사용하자. 그렇지 않고 업데이트 쿼리를 하면, 명시하지 않은 필드 값은 다 날라가버린다.
  * `$set`를 안쓰면 PUT, 쓰면 PATCH처럼 동작한다는 걸로 이해됨

#### Delete
`remove`: 조건에 맞는 모든 것을 지운다. 한개만 지우려면 `deleteOne`을 써야한다. _(`update`와는 반대임)_
- 개수 제한은 아직 안됨. RDB에 비해 아직 몽고가 약한 부분인 것 같다.
- MapReduce 제공한다. 근데 그것보다 Aggregation 함수들 쓰는 게 나을 듯하다.
- `$lookup`: left-OuterJoin과 비슷. 다른 컬렉션과 조인할 수 있는 기능

## MongoDB의 Index
- 몽고DB는 RDB처럼의 `클러스터링 인덱스`가 없다.
  - `클러스터링 인덱스`: 비슷한 값끼리 물리적으로 인접한 장소에 묶어서 저장될 수 있도록 하는 인덱스 방법
- index 조회에는 이점이 있지만 쓰기는 오히려 느려질 수 있다. 따라서 필요한 인덱스만 딱 지정하는 게 좋다.
- 인덱스 오름차순, 내림차순은 리프노드 레벨에서의 인덱스 정렬 순서라고 보면 되겠다.
- 샤드 클러스터에서는 여러개의 샤드가 논리적으로 묶여있는데, 샤드별 인덱스는 유니크하지만 클러스터 단위에서는 유니크하지 않다.
- 해시 인덱스: 해시샤딩 시에 사용되는 인덱스
 - `index hint`: 엉뚱한 인덱스를 타는 경우도 있음. 어떤 인덱스를 타야 할지 강제로 알려주는 것. 
- `explain`을 통해 쿼리플랜을 확인할 수 있다. `IXSCAN`이 나오면 인덱스 스캔인 거고, `COLLSCAN`은 풀 스캔을 한 거다.

## MongoDB의 Lock
- 글로벌락, 데이터베이스락, 컬렉션락, 도큐먼트락 등이 있음
  - 글로벌/데이터베이스/컬렉션락은 몽고DB 차원에서 지원
  - 도큐먼트락은 스토리지엔진인 Wiredtiger 차원에서 지원
- Lock의 종류
  - Shared Lock: 현재 쓰레드가 **참조**하는 데이터를 다른 쓰레드가 변경하지 못하게 막는 것. 읽기를 허락함. 공유/읽기 잠금
  - Exclusive Lock: 현재 쓰레드가 **변경**하는 데이터를 다른 쓰레드가 변경하지 못하게 막는 것. 읽기도 불가함. 배타/쓰기 잠금
  - Intent Lock: (Intent shared lock, Intent exclusive lock이 있음)

## MongoDB의 ACID
- **A**tomicity: 3.6버전까지는 Single-Document Transaction가 보장되었으나, 4.0버전부터 Multi-Document Transaction도 가능함(명시적으로 선언 해야함. 단, 여러 샤드에 나눠진 상황에서는 보장 안됨)
- **C**onsistency: Read & Write Concern을 통해 지원
  - Read Concern - Majority: 클러스터 구성된 노드의 과반수 동기화한 후 응답
  - Write Concern - Majority: 다수의 멤버가 가진 최신의 데이터를 반환
- **I**solation: 격리수준은 Snapshot(RDB로 치면 Repeatable Read)임. MongoDB는 쓰기충돌이 RDB보다 더 취약함
- **D**urability: Write Concern가 Journaled인 것 - 저널로그에 기록되어야만 커밋이 되었다고 클라이언트에서 응답을 받을 수 있음

---

> [참고자료]  
> 사내 강연  
