---
title: Linked List
date: "2019-12-01T20:40:32.169Z"
template: "post"
draft: false
slug: "linked-list"
category: "Data Structure"
tags:
  - "Computer Science"
  - "Data Structure"
description: "노드를 저장할 때 그 다음 순서의 자료가 있는 위치를 데이터에 포함시키는 방식으로 자료를 저장하는 구조이다."
# socialImage: "/media/image-3.jpg"
---

<!-- # Linked List -->

# Linked List(연결리스트)가 뭐야?
노드를 저장할 때 그 다음 순서의 자료가 있는 위치를 데이터에 포함시키는 방식으로 자료를 저장하는 구조이다.


# 링크드리스트 vs 배열
둘은 얼추 비슷한 느낌이지만 분명 다르다.  
추가/삭제가 많다면 링크드리스트, 탐색/정렬이 많다면 배열을 사용하는 게 유리하다.  

둘 다 선형 데이터 구조지만, 배열은 물리적으로도 연속된 메모리를 사용하고 링크드리스트는 다음 노드의 위치를 저장함으로써 흩어진 메모리를 연결해서 쓴다는 게 둘 사이의 차이점을 만드는 주요한 요인이다.

- 링크드리스트
  * 장점: 데이터의 추가/삽입 및 삭제가 용이하다. 즉, 새로운 노드를 끼워넣기 쉽다.
  길이를 동적으로 조절 가능
  * 단점: 인덱스없이 연결관계만 있기 때문에 특정 노드를 불러내기 어렵다. (일반적으로) O(N)이 걸리며 순차적으로 탐색하게 되기 때문이다.(B+tree자료구조 등은 예외) 거꾸로 탐색하기도 어렵다. 정렬은 O(NlogN)이 걸린다.

- 배열
  * 장점: 자료마다 인덱스가 있어서 특정 자료를 불러내기 편하다.
  * 단점: 연속된 메모리 공간을 할당받아야 하다보니 크기를 크게 키우기가 어렵다. 또한, 안 쓰는 공간까지 전부 예약해두고 있어야 하므로 공간 낭비가 생긴다. 데이터 추가/삽입 과정에서 데이터를 옮기는 연산작업이 생긴다.

# 링크드리스트의 종류
- 단순 연결 리스트 (Singly Linked List)
- 이중 연결 리스트 (Doubly Linked List)
- 원형 연결 리스트 (Circular linked list)
- 청크 리스트 (Chunked List)

# Python으로 단순연결리스트 구현하기

## 구현방식
노드를 아래와 같이 구현한다.
```python
class Node:
  def __init__(self, data):
    self.data = data
    self.next = None
```

그리고 다음 노드는 아래와 같은 방식으로 참조시킨다.
```python
head = Node(5)
next_node = Node(12)
head.next = next_node
```

단순연결 리스트의 클래스는 이렇게 만들었다. 첫 번째 노드 삽입, 중간 노드 삽입, 마지막 노드 삽입, 노드 삭제 메서드를 구현할 때, 모두 이 클래스 안에 작성했다.
```python
class SingleLinkedList:
  def __init__(self, data):
    new_node = Node(data)
    self.head = new_node
    self.list_size = 1
```

## 첫번째 노드 삽입
```python
def insertFirst(self, data):
  new_node = Node(data)       # 새로운 노드 생성
  temp_node = self.head       # 기존 헤드를 잠시 보관
  self.head = new_node        # 헤드를 새로운 노드로 변경
  self.head.next = temp_node  # 새로 생성된 헤드의 링크를
                              # 기존 헤드의 링크로 변경
  self.list_size += 1
```

## 노드 선택
```python
def selectNode(self, num):
  if self.list_size < num:
    return # 오버플로우
  node = self.head
  count = 0
  while count < num:
    node = node.next
    count += 1
  return node
```

## 중간 노드 삽입
```python
def insertMiddle(self, num, data):
  if self.head.next == None:
    # 헤더가 만들어진 직후에 메서드를 사용하는 경우
    insertLast(data)
    return
  node = self.selectNode(num)
  new_node = Node(data)
  temp_next = node.next
  node.next = new_node
  new_node.next = temp_next
  self.list_size += 1
```

## 마지막 노드 삽입
```python
def insertLast(self, data):
  node = self.head
  while True:
    if node.next == None: # 다음 링크가 없으면
      break
    node = node.next
  
  new_node = Node(data)
  node.next = new_node      # 마지막 노드로 링크
  self.list_size += 1
```

## 노드 삭제
```python
def deleteNode(self, num):
  if self.list_size < 1:
    return # 언더플로우
  elif self.list_size < num:
    return # 오버플로우

  if num == 0:
    self.deleteHead()
    return
  node = self.selectNode(num - 1) # 이전 노드의 링크를 다다음 노드와 연결하기 위해
                                  # 이전 노드를 선택하였다
  node.next = node.next.next
  del_node = node.next
  del del_node
```

## 헤드 노드 삭제
```python
def deleteHead(self):
  node = self.head
  self.head = node.next
  del node
```

## 출력해보기
```python
if __name__ == "__main__":
  m_list = SingleLinkedList(1)
  m_list.insertLast(5)
  m_list.insertLast(6)
  print('LinkedList :', m_list)
  print('LinkedList Size() :', m_list.size())
  print('LinkedList SelectNode(1) :', m_list.selectNode(1))

  m_list.insertMiddle(1, 15)
  print('LinkedList Insert Middle(1, 15) :', m_list)
  
  m_list.insertFirst(100)
  print('LinkedList Insert First(100) : ', m_list)
  print('LinkedList SelectNode(0) :', m_list.selectNode(0))

  m_list.deleteNode(0)
  print('LinkedList Delete Node(0) : ', m_list)
  m_list.deleteNode(1)
  print('LinkedList Delete Node(1) : ', m_list)
```

## 출력 결과
```
LinkedList : [ 1, 5, 6 ]
LinkedList Size() : 3
LinkedList SelectNode(1) : 5
LinkedList Insert Middle(1, 15) : [ 1, 5, 15, 6 ]
LinkedList Insert First(100) :  [ 100, 1, 5, 15, 6 ]
LinkedList SelectNode(0) : 100
LinkedList Delete Node(0) :  [ 1, 5, 15, 6 ]
LinkedList Delete Node(1) :  [ 1, 15, 6 ]
```

---

> [참고자료]  
> https://lsjsj92.tistory.com/461?category=828186  
> https://baejino.com/programing/python/datastructure-1-linked-list