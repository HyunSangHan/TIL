---
title: Service - Headless, Endpoint, ExternalName
date: "2021-08-09T08:00"
template: "post"
draft: false
slug: "service-headless-endpoint-externalname"
category: "k8s"
tags:
  - "kubernetes"
  - "Infra"
  - "Dev-environment"
  - "Network"
description: "DNS를 통해 Pod에 접근하기 위해 어떤 방법들을 더 활용할 수 있는지 알아본다."
---

들어가기에 앞서, 쿠베 클러스터에는 DNS server가 별도 존재한다는 사실을 알아두자. DNS를 통해 Pod(그 Pod에 연결된 IP가 외부 IP일지언정)에 접근하기 위해 어떤 방법들을 더 활용할 수 있는지 알아본다.

### Headless 서비스 만드는 방법
DNS상으로 Service에다가 그에 연결된 모든 Pod IP들을 넣음으로써, Pod ip를 통해 Pod에 접근하고 싶으면 `Headless` 서비스를 만들면 된다.
- 서비스에서, `clusterIP: None`을 넣어주면 된다.
- 그 Headless에 붙을 Pod에서, `hostname`에 도메인이름을, `subdomain`에 서비스이름을 넣어주면 된다.

헤들레스 서비스에 의해 DNS에 등록되면서, 마치 Pod IP에 직접 접근하는 듯한 효과가 있다.

### Endpoint 만드는 방법
그간 Service에 selector를, Pod에 label을 넣어 서로 연결짓는 것이 가장 기본적인 방법이었을 것이다. 그런데 `Endpoint`라는 오브젝트를 사용하면, 이 둘을 간접적으로 연결해줄 수 있다.
- Endpoint 이름을 Service와 동일하게 설정하고, Endpoint 안에는 Pod의 접속정보를 넣어준다.
  * 이를 통해, Endpoint가 중간에 껴서 서비스와 팟이 연결되게 된다.
  * 만약 여기서 Pod이 아니라 외부 IP를 가리키면 외부 IP와 서비스가 연결된다.

### ExternalName 속성을 붙인 서비스 만드는 방법
위에서 봤던, Endpoint에서 외부 IP연결하는 건 한계가 있다. IP가 변할 수 있기 때문이다. 서비스에 `ExternalName`이라는 속성을 달아둔다면 도메인네임을 넣을 수 있다.
고로 Pod는 Service만 가리키고 있게 하고, 변경 필요 시 Service만 수정해주면 Pod를 수정하고 재배포할 일은 없어지게 되어 편리하다.

---

> [참고자료]  
> https://www.inflearn.com/course/%EC%BF%A0%EB%B2%84%EB%84%A4%ED%8B%B0%EC%8A%A4-%EA%B8%B0%EC%B4%88  
  