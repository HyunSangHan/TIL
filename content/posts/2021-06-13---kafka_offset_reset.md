---
title: Kafka Offset Reset
date: "2021-06-13T00:00"
template: "post"
draft: false
slug: "kafka-offset-reset"
category: "Kafka"
tags:
  - "Kafka"
  - "Apache"
  - "How to use"
  - "Case study"
description: "[Kafka Case Study] 1편 - Consumer 비즈니스 로직을 변경하기로 한 등등의 사유로, 예전 레코드부터 다시 가져와야 한다면?"
---

#### [Kafka Case Study] 1편 - 예전 레코드부터 다시 가져와야 한다면?

특정 Topic을 컨슘하는 Consumer를 개발해서 deploy했다고 가정하자. 그 컨슈머는 실시간으로 메시지를 가져와서 내부적인 비즈니스 로직을 처리하고 있을 것이다.

그런데 그 비즈니스 로직을 수정해서, 이미 컨슘을 해버린 데이터들을 다시 컨슘해서 처리하고 싶다면?
비즈니스 로직을 수정한다 해도, 이미 지나간 과거로 알아서 되돌아가는 것은 아니다. 특정 시점으로 offset을 되돌려줘야 한다.

## Offset Reset(오프셋 리셋)
kafka 설치경로 내 `bin` 디렉토리에는 `kafka-consumer-groups.sh`가 있으며, 이를 통해 컨슈머 그룹들에 대한 정보를 확인할 수 있는 기본적인 명령어들이 제공된다. 오프셋 리셋도 이를 이용해서 할 수 있다.

```sh
# 특정 컨슈머 그룹의 offset 상태 확인'만' 하기
kafka-consumer-groups.sh --bootstrap-server <host:port> --group <group_id> --describe

# 특정 컨슈머 그룹의 offset reset을 하면 어떻게 될지 결과만 먼저 출력해보기
kafka-consumer-groups.sh --bootstrap-server <host:port> --group <group_id> --topic <topic> --reset-offsets --to-earliest --dry-run

# 특정 컨슈머 그룹의 offset reset을 실제로 실행하기
kafka-consumer-groups.sh --bootstrap-server <host:port> --group <group_id> --topic <topic> --reset-offsets --to-earliest --execute
```

### 설명
- 부트스트랩서버 지정: `--bootstrap-server` 뒤에, 브로커 `host:port` 목록을 입력
- 컨슈머그룹 지정: `--group` 뒤에, current offset을 변경할 컨슈머 `그룹 id`를 입력
- 토픽 지정: `--topic` or `--all-topics`
  - `--topic` 뒤에, current offset을 변경할 관련 `토픽` 입력
  - 만일 `--all-topics` 옵션을 사용하면, 그 컨슈머 그룹이 붙어있는 모든 토픽을 입력한 것과 마찬가지
- offset을 어디로 옮길지에 대한 설정
  - `--to-earliest`: 파티션의 가장 처음(오프셋 최소값)으로 옮기기
  - `--to-latest`: 파티션의 가장 마지막(오프셋 최대값)으로 옮기기
  - `--to-offset`: 특정 offset으로 옮기기
  - `--shift-by`: offset을 '몇', 즉 개수 단위로 옮기기 (양수 음수 모두 가능)
  - `--to-datetime`: 날짜 단위로 옮기고 싶을 때. (형식: `YYYY-MM-DDTHH:mm:SS.sss`)
  - `--by-duration`: 현재의 timestamp로부터 특정 기간 만큼 앞으로 옮기고 싶을 때 (형식: `PnDTnHnMnS`)


## 그밖에 다른 방법
consumer group id를 유지한 상태에서 offset만 변경하고 싶다면 위와 같이 offset을 reset해줘야 하지만, 그렇지 않아도 된다면 consumer group id를 수정하는 방법도 있다. consumer group id를 새로 지정하면, 설정해둔 옵션(`earliest` 혹은 `latest`. 디폴트는 `latest`.)에 따라 새로운 컨슈머 그룹이라고 인지하여 offset이 reset되게 된다.(사실 reset이 아니라 set이 맞는 표현이겠다.)  


> [참고자료]  
> 고승범 외(2018), _카프카: 데이터 플랫폼의 최강자_, 책만.  

---

#### 다음 글
[[Kafka Case Study] 2편 - Consumer에서의 데이터 처리중 Exception이 발생한다면?](/posts/kafka-consumer-exception)
