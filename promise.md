> [참고자료]  
> https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Promise

# Promise

## Promise가 뭐야?
비동기 상황에서, 동기적으로 바로 알아낼 수 없는 값을 위한 대리자. 비동기 연산이 종료된 이후의 결과값이나 실패 이유를 처리하기 위한 처리기를 연결할 수 있도록 한다. 프로미스를 사용하면 비동기 메서드에서 마치 동기 메서드처럼 값을 반환할 수 있다. 다만 최종 결과 대신 일단 프로미스를 반환해서 미래의 어떤 시점에 결과를 제공하며, 성공과 실패에 따라 메서드를 분기해서 수행할 수 있게 해준다.

#### 그래서, 왜 쓴다는 거야?
싱글쓰레드인 자바스크립트에서 비동기 처리를 위해서 콜백(callback)을 사용해왔다. 그 단점은 비동기 처리를 순차적으로 실행할 필요가 있는 경우에 비동기 처리를 중첩시켜서 표현하므로 에러, 예외처리가 어렵다는 것과 중첩으로 인한 복잡도가 증가(a.k.a `콜백지옥`)하는 것이다. 이를 해결하기 위해 유용하게 쓰인다.

## 프로미스의 상태
참고로, `fulfilled`와 `rejected`의 경우(즉, `pending`이 아닌 경우)를 `settled`라고 한다.
- 대기(pending): 이행하거나 거부되지 않은 초기 상태
- 이행(fulfilled): 연산이 성공적으로 완료됨
- 거부(rejected): 연산이 실패함

## 이해를 돕기 위한 예시들
예시를 보면서 활용 방법을 살펴보자.
- 일반적인 활용법 :  
  아래와 같이, 조건에 따라 `resolve`와 `reject`를 정의해둔다.
  ```js
  const promiseTest = function(param){
    return new Promise(function(resolve,reject){
      if(param){
        resolve("천재");
      }
      else{
        reject("바보");
      }
    });
  }
  //프로미스 실행
  promiseTest(true).then(function(result){
    console.log(result); // 천재
  }, function(err){
    console.log(err); // 바보
  });
  ```

- 비동기적으로 발생하는 에러를 캐치하지 못하는 경우
  ```js
  try {
    setTimeout(() => {
      throw new Error('안 잡히는 에러!');
    }, 1000);
  } catch (err) {
    console.log("캐치한 에러는..." + err); // error를 캐치해지 못함
  }
  ```

  프로미스를 활용한다면 에러 캐치가 가능할 것이다.
    ```js
    new Promise(function(resolve,reject){
      setTimeout(() => {
        reject(new Error('잡히는 에러!'));
      },1000);
    }).catch(err => console.log("캐치한 에러는..." + err)); // error를 캐치함
    ```

- 프로미스를 계속 이어받아 작업하는 경우(체이닝 가능)
  ```js
  getData(userInfo)
    .then(parseValue)
    .then(auth)
    .then(diaplay);
  ```

## 그 외 알아둘 점
- `Promise.all`을 쓰면 복수 개의 프로미스가 이행된 이후에 작업을 진행한다.
  ```js
  // 예시
  Promise.all([promise1, promise2]).then(function (values) {
    console.log("모두 완료됨", values);
  });
  ```

- 비동기 메서드들이 연쇄적으로 프로미스 객체를 리턴한다면, `.then`이나 `.catch`를 통해 계속 체이닝이 가능하다.
- 에러를 중간에서 캐치할 필요가 없다면, 이 계속되는 체이닝 맨 마지막에만 `.catch`를 작성해줘도 괜찮다.

## 실제 빈번하게 사용되고 있는 사례들
앞서 살펴봤던 것들처럼 프로미스를 직접 작성해서 활용해줘도 되지만, 실제로 이미 우리가 쓰고 있는 것들 중에도 내부적으로 프로미스를 이용하여 작동하는 사례가 많이 있다. 모르고 쓰는 것보다, 프로미스를 이해하고 쓰면 훨씬 좋을 것 같다.
- `axios` : axios를 통한 AJAX요청의 결과 프로미스 객체를 리턴한다! fulfilled된 경우 우리는 `.then`에서 그 response값을 받아올 수 있고, rejected된 경우 `.catch`에서 에러를 처리한다.
- `async-await` : 이 또한 실행순서를 보장받기 위해 콜백함수를 써야하는 괴로움에서 벗어나게 해준다. async가 적용된 함수에서는, await가 이행된 이후에야 그 다음 라인의 코드가 실행된다. 즉, await 다음 라인부터는 모두 `.then`안에 들어가는 이치다.  
아래 예시를 보자.(예시에서 `fetchUser`는 서버에서 사용자 정보를 받아오는 메서드라고 가정한다.)
  ```js
  // async & await 적용 전(콜백 형태)
  function logName() {
    const user = fetchUser('domain.com/users/1', function(user) {
      if (user.id === 1) {
        console.log(user.name);
      }
    });
  }
  ```

  ```js
  // async & await 적용 후
  async function logName() {
    const user = await fetchUser('domain.com/users/1');
    if (user.id === 1) {
      console.log(user.name);
    }
  }
  ```
  참고로, aysnc함수 안에서는 `try-catch`문을 활용해 에러를 캐치한다. 예컨대 아래와 같이.
  ```js
  async initialize() {
    try {
      const response = await axios.get('https://phenomenon.kr');
      this.setState({
        data: response.data
      });
    } catch (e) {
      console.log(e);
    }
  }
  ```