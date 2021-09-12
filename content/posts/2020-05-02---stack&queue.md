---
title: Stack과 Queue
date: "2020-05-02T23:17"
template: "post"
draft: false
slug: "stack-queue"
category: "Data Structure"
tags:
  - "Computer Science"
  - "Data Structure"
description: "선형(linear) 자료구조의 대표적인 것들이다. 스택은 LIFO, 큐는 FIFO의 성질을 가진다."
---

선형(linear) 자료구조의 대표적인 것들이다. 스택과 큐는 우리 주변에 사례가 너무너무 많다. JavaScript에서는 배열을 이용하여 쉽게 구현할 수 있다.

## Stack
- `LIFO`(Last In First Out)의 성질을 가진다. 즉, 나중에 넣은 데이터가 먼저 나온다.
- 보통, 데이터를 넣는 것을 `push`, 빼는 것을 `pop`이라고 부른다.
- 참고로 자바스크립트 엔진의 `Call stack`라든지 브라우저의 `history` 등이 스택으로 이루어져 있다.
- 내역을 남기는 용도로 많이 쓰인다.
- 그래프에서 `DFS`(Depth First Search) 방식으로 탐색할 때 스택을 활용한다.

### Stack 구현

```js
function Stack () {
  this.data = [];
}

Stack.prototype.push = function (newData) {
  this.data.push(newData);
}

Stack.prototype.pop = function () {
  return this.data.pop() || null;
}

Stack.prototype.getSize = function () {
  return this.data.length;
}

const stack = new Stack();

stack.push(3);
stack.push(2);
stack.push(4);
stack.push(6);
console.log(stack.data); // [ 3, 2, 4, 6 ]
console.log(stack.getSize()); // 4
stack.pop();
stack.pop();
console.log(stack.data); // [3, 2]
stack.pop();
console.log(stack.getSize()); // 1

```

## Queue
- `FIFO`(First In First Out)의 성질을 가진다. 즉, 먼저 넣은 데이터가 먼저 나온다.
- 보통, 데이터를 넣은 것을 `enqueue`, 빼는 것을 `dequeue`라고 부른다.
- 참고로 자바스크립트 엔진의 `Task queue` 등이 스택으로 이루어져 있다.
- 순서대로 처리해야 하는 작업을 대기시켜두는 버퍼 용도로 많이 쓰인다.
- 그래프에서 `BFS`(Breadth First Search) 방식으로 탐색할 때 큐를 활용한다.

### Queue 구현

```js
function Queue () {
  this.data = [];
}

Queue.prototype.enqueue = function (newData) {
  this.data.push(newData);
}

Queue.prototype.dequeue = function () {
  return this.data.shift() || null;
}

Queue.prototype.getSize = function () {
  return this.data.length;
}

const queue = new Queue();

queue.enqueue(3);
queue.enqueue(2);
queue.enqueue(4);
queue.enqueue(6);
console.log(queue.data); // [ 3, 2, 4, 6 ]
console.log(queue.getSize()); // 4
queue.dequeue();
queue.dequeue();
console.log(queue.data); // [4, 6]
queue.dequeue();
console.log(queue.getSize()); // 1
```
