---
title: k8s - ConfigMap과 Secret
date: "2021-08-23T00:00"
template: "post"
draft: false
slug: "configmap-and-secret"
category: "k8s"
tags:
  - "kubernetes"
  - "Infra"
  - "Dev-environment"
description: "고작 값 몇개 때문에 컨테이너 이미지를 여러벌 관리하기는 부담이 된다. 예컨대 개발환경, 운영환경 등 경우에 따라 변하는 값은 컨테이너 이미지 외부에서 설정할 수 있는데, 그걸 도와주기 위한 오브젝트가 ConfigMap과 Secret이다."
---

고작 값 몇개 때문에 컨테이너 이미지를 여러벌 관리하기는 부담이 된다. 예컨대 개발환경, 운영환경 등 경우에 따라 변하는 값은 컨테이너 이미지 외부에서 설정할 수 있는데, 그걸 도와주기 위한 오브젝트가 `ConfigMap`과 `Secret`이다.

## ConfigMap vs Secret
- `ConfigMap`과 달리 `Secret`의 경우, 패스워드나 인증키 등 보안적인 요소들을 담는 용도이다.
- `Secret`은 base64로 인코딩 해서 값을 넣어야 한다.
  * 보안을 위해 인코딩 하는 건 아니다.
  * 인코딩해서 값을 넣어도, 컨테이너 환경변수로 주입이 될 때에는 자동으로 디코딩되어서 컨테이너 환경변수에선 원래의 값이 보이게 된다.
- ConfigMap은 key-value를 무한으로 넣을 수 있다. 반면 `Secret`의 경우 **1MB**까지만 가능하다.
- 일반적인 오브젝트 값들은 k8s DB에 보통 저장이 되는데, `Secret`은 메모리에 저장된다. 파일 저장 대비 보안 측면에서 좋기 때문이다.
  * 단, `Secret`은 메모리를 사용하는 만큼, `Secret`을 너무 많이 만들면 시스템 자원에 영향을 미칠 수 있다는 점에 주의한다.

## ConfigMap, Secret을 주입하는 방법
ConfigMap과 Secret을 만들 때
1. 컨테이너의 `환경변수`로 `상수`를 넣는 방법
2. 컨테이너의 `환경변수`로 `파일`을 넣는 방법
3. `볼륨을 마운트`하여 `파일`을 넣는 방법

정도가 있는데 각 방법에 대해 하나씩 간단히 알아본다.

### Env(Literal)
1. configMap과 secret에 대한 yaml 파일을 만든다.
2. 1에서 만든 그 yaml파일의 `metadata.name`을, pod 만드는 yaml파일의 `spec.containers[].envFrom`의 `configMapRef` 또는 `secretRef`에 지정해줘서 참조해온다.
    * `envFrom`: env(환경변수)를 만들건데 어디서 가져오느냐 이다.

#### 예시
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: env-literal-example
spec:
  containers:
    - name: container
      image: phenomenon/init
      envFrom:
      - configMapRef:
          name: cm-example # configMap yaml 파일의 metadata.name
      - secertRef:
          name: sec-example # secret yaml 파일의 metadata.name
```


### Env(File)
1. 아래와 같이 configMap과 secret에 대한 yaml 파일을 만든다.
    ```sh
    # configMap
    kubectl create configmap {지어낼이름} --from-file={./파일명.확장자}

    # secret
    kubectl create secret generic {지어낼이름} --from-file={./파일명.확장자}
    ```
2. Pod를 만드는 yaml파일에서 `spec.containers[].env.valueFrom`의 `configMapKeyRef`, `secretKeyRef`을 통해 레퍼런스한다.

#### 예시
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: env-file-example
spec:
  containers:
    - name: container
      image: phenomenon/init
      env:
        - name: file
          valueFrom:
            configMapKeyRef:
              name: cm-example # 1의 과정에서 {지어낼이름}에 들어갔던 내용
              key: example_file.txt # 1의 과정에서의 {파일명.확장자}
```

### Volume Mount(File)
1. 아래와 같이 configMap과 secret에 대한 yaml 파일을 만든다.
    ```sh
    # configMap
    kubectl create configmap {지어낼이름} --from-file={./파일명.확장자}

    # secret
    kubectl create secret generic {지어낼이름} --from-file={./파일명.확장자}
    ```
2. Pod를 만드는 yaml파일에서 `spec.volumes[]`으로 `configMap` 또는 `secret`을 지정하고, 그걸 container 띄울 때 `spec.containers[].volumeMounts`에 넣는다.

#### 예시
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: mount-file-example
spec:
  containers:
    - name: container
      image: phenomenon/init
      volumeMounts:
      - name: file-volume
        mountPath: /mount
  volumes:
    - name: file-volume
      configMap:
        name: cm-example # 1의 과정에서 {지어낼이름}에 들어갔던 내용
```

#### Env(File)와 Volume Mount(File)의 큰 차이점
`Env(File)`는 주입하면 끝이라서 그 File의 값을 수정해도 컨테이너에 반영되지 않는데(죽였다 다시 띄워야 반영된다.) 반해 `Volume Mount(File)`은 수정된 값이 반영된다.

---

> [참고자료]  
> https://www.inflearn.com/course/%EC%BF%A0%EB%B2%84%EB%84%A4%ED%8B%B0%EC%8A%A4-%EA%B8%B0%EC%B4%88  
> https://kubernetes.io/ko/docs/concepts/configuration/configmap/  
> https://kubernetes.io/ko/docs/concepts/configuration/secret/  
  