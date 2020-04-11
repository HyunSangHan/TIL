> [참고자료]  
> https://wnsgml972.github.io/network/2018/08/14/network_cloud-computing/  

# IaaS vs PaaS vs SaaS

먼저 `클라우드 컴퓨팅`의 개념을 알아보자. IT자원을 필요한 만큼 사용료를 주고 쓰는, 종량제 같은 형태를 말한다. `IaaS`가 레고 공장이라면, `PaaS`는 레고 블럭, `SaaS`가 이미 완성된 레고 구조물이라고 비유할 수 있다.

## IaaS(Infrastructure as a Service) : `컴퓨팅 인프라`를 필요한 만큼 쓰자
서버를 운영하기 위한 서버 자원, IP, Network, Storage, 전력 등 인프라를 구축하기 위해 필요한 기반을 가상의 환경을 통해 제공하게 된다. 기존 서버 호스팅보다 하드웨어의 확장성이 좋고 탄력적이며 빠른 제공을 할 수 있는 가상화 기술을 이용한다. Amazon EC2 같은 사례가 있다.

## PaaS(Platform as a Service) : `개발자를 위한 프레임워크/API`로 개발 효율성 극대화하자
서비스를 개발할 수 있는 안정적인 환경(Platform)뿐만 아니라 응용 프로그램을 개발 할 수 있는 API까지 제공하는 형태다. Heroku 같은 사례가 있다.

## SaaS(Software as a Service) : `완성된 서비스` 형태로 설치 없이 사용하자
시스템이 무엇으로 이루어져 있고 어떻게 동작 하고 있는지 등을 알 필요없이, 필요하면 언제든지 공간도 늘려서 서비스를 받을 수 있는 형태다. Google Docs, 파파고와 같은 사례가 있다.
