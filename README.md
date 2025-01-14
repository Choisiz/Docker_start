## 도커명령어

- docker 커맨드(상위/하위) (옵선) 대상 (인자)
- docker create <이름>: 도커 컨테이너 생성
- docker start <컨테이너 이름 or id>: 도커 컨테이너 실행(실행만 하고 아무런 메세지없음)
  - docker start -a <컨테이너 이름 or id>: 도커 컨테이너 실행(메세지o)
  - docker start -i
- docker run <이름>: <이름>의 도커실행(컨테이너 생성과 동시에 실행)
  - docker run = docker pull + docker create + docker start
  - docker run <이름> ls: <이름>의 구조(파일스냅샷 있을경우 가능)
  - docker run <이름> ping localhost: <이름>을 실행하고 핑보내보기
  - docker run -e
  - docker run -i
  - docker run -t
  - docker run -v
  - docker run -p <로컬port>:<컨테이너port>: 만든 이미지 연결
    - 실행되고 있는 도커파일을 다른pc 혹은 다른 네트워크를 통해서 보고싶다면 매핑해줘야 가능하다.
  - docker run -d: 도커실행후 터미널에서 바로 빠져나오기
    - ex) docker run -d -p 5000:8080 choisis/node:lastest
- docker ps: 실행중인 컨테이너 보기
- docker ps -a : 모든 컨테이너 보기
- docker ps --format 'table{{.<컨테이너이름>}}\table{{.Image}': 원하는 컨테이너만 보기
- docker stop <컨테이너 이름 or id>: 해당 컨테이너 중지(작업완료후 중지:그레이스풀)
- docker kill <컨테이너 이름 or id>: 해당 컨테이너 중지(즉시 중지)
- docker rm <컨테이너 이름 or id>: 컨테이너 삭제(중지후 가능)
- docker rm 'docker ps -a -q': 모든 컨테이너 삭제(중지후 가능)
- docker rmi <이미지id>: 도커이미지 삭제
- docker system prune: 중지된컨테이너 + 태그없는 이미지 삭제(실행중인것은 영향x)
- docker exec <컨테이너 아이디> <명령어>: 이미 실행중인 컨테이너에 명령하기
- docker run redis: redis 컨테이너 실행
  - redis-cil: redis클라이언트 실행 -> 그러나 실행불가 (이유는 도커바깥에서 명령어를 전달했기때문)
  - docker exec -it <컨테이너 id> redis-cil: redis클라이어트 실행
  - -it는 뭔가요?: 없으면 redis-cil을 실행하고 바깥으로 나와버림
- docker exec -it <컨테이너 이름 or id> sh: 쉘환경접근(명령어 간단해짐)
- docker build ./: 도커 이미지 만들기(도커파일을 도커클라이언트랑 연결해줌)
  - 내부적: 임시컨테이너 생성 -> 컨테이너 참고하여 이미지 생성 -> 이미지 완성 -> 임시컨테이너 삭제
  - 임시컨테이너 생성이유: 이미지를통해 컨테이너를 만들지만, 반대도 가능(즉 컨테이너 만드는것은 이미지를 만드는행위)
- docker build -t <도커아이디>/<도커명>:버전 ./: 해당 디렉토리에 도커이미지 국롤 이름생성방법

  - ex) 빌드: docker build -t choisis/hello:lastest ./
  - ex) 실행: docker run -it choisis/hello

- docker-compose up: 이미지없을때, 이미지 빌드후 컨테이너 시작
  <<<<<<< HEAD
- docker-compose up --build: 이미지 유무상관없이, 이미지 빌드후 컨테이너 시작

## 도커이미지생성

=======

- docker-compose up --build: 이미지 유무상관없이, 이미지 빌드후 컨테이너 시작,수정시 보통이것사용
- docker-compose down: 도커컴포즈를 통해 동작시간 컨테이너들을 중지
  도커이미지생성

1. 도커파일을 작성한다.
2. 도커클라이언트에게 도커파일을 전달한다. ex) docker build -t <원하는 이미지 이름> .
3. 도커클라이언트가 도커서버에 요청
4. 이미지가 생성된다

## 도커파일만들기

1. 베이스 이미지를 명시해준다.
2. 필요한 파일 다운을 명시해준다.
3. 컨테이너 명령어를 작성해준다.
4. 도커파일 보기(node 환경)
   - COPY: ./ ./ : 왼쪽은 로컬소스의 복사할경로(이름도 지정가능 ex).package), 오른쪽은 붙여넣기할 도커의 경로
   - COPY ./ ./ -> RUN npm install: 해야하는이유: 도커내에 로컬소스, 특히 package.json이 있어야 설치가능
   - WORKDIR: 도커에 폴더를 만들어주는것
   - 안쓰고 COPY시: 파일스냅샷1,파일스냅샷2,소스1,소스2,소스3....: 파일정리가안됨
   - /usr/src/app: 파일스냅샷1,파일스냅샷2,usr/src/app/소스1,소스2,소스3..: 정리가좋다.
5. 소스코드 변경시 반영방법

   - docker build ./ -> docker run ~: 변경 소스코드 반영
   - 그러나 매번 소스코드 변경할때 마다 위 작업 반복너무 불편
   - 해결법
   - 1. 도커파일변경(종속성)

        - 기존: COPY ./ ./ RUN npm install => 매번 빌드시 종속성재설치o
        - 수정: COPY package.json RUN npm install COPY ./ ./ => 종속성은 변한부분이 없다면 종속성은 재설치 x

   - 2. docker volumes: 1번 업그레이드(빌드사용자제하기)

        - docker volumes사용: 복사가 아니라 참조(매핑)를 하는방법이다.
        - 변경사항 반영이 쉽다. 소스가 변경될때마다 이미지를 빌드할필요없다.
        - -v -v: 왼쪽 로컬의참초안할부분, 오른쪽: 매핑할것(로컬디렉토리:도커디렉토리)
        - ex) docker run -p 5050:8080 -v/usr/src/app/node_modules -v $(pwd):/usr/src/app imageID
        - (pwd)란?: 현재 작업중인 디렉토리의 이름을 제공

## 도커컴포즈

- 여러 컨테이너를 사용하는 것을 연결해주는것
- docker-compose.yml 을 작성시 명령어로 간단하게 여러 컨테이너를 일괄적 관리 실행 가능
- 구조설명
  - version: 도커 컴포즈 버전정의
  - services: 개별컨테이너(실행하려는 컨테이너)를 정의하는 부분
    - web: 서비스를 빌드하기 위한 설정
      - context: 해당 디렉토리를 빌드 컨텍스트로 사용
      - dockerfile: 이미지를 빌드할 도커파일
      - ports: 컨테이너와 호스트간 매핑
      - volumes: 컨테이너와 호스트 간 파일공유, .붙이면 공유, 없으면 공유x
- 예시

```
version: '3'                       // 도커컴포즈 버전
services:                          // 실행하려는 컨테이너 정의
  react:                          // 리액트 컨테이너 실행
    build:                        // build 설정
      context: .                  // 이미지구성위한 파일,폴더위치
      dockerfile: Dockerfile.dev  //빌드할 도커파일
    ports:                        //포트번호
      - "3000:3000"               //로컬:도커
    volumes:                      //참조(매핑)설정
      - /usr/src/app/node_modules //로컬node_modules는 참조x
      - ./:usr/src/app            // ./현재디렉토리를 매핑. ~/app: 도커에있는 이 워킹디렉토리에
    stdin_open: true              //리액트한정, 리액트앱끌때
```

## 간단한 앱만들기

### 리액트: 이미지 생성후 도커로 실행하기

1. 리액트앱설치: npx create-react-app
2. 도커이미지 생성(도커파일 작성)

   - Dockerfile.dev 생성
   - docker build ./ => error : Dockerfile.dev 은 임의로 빌드시 사용할 도커 파일임을 지정해줘야함
   - 방법: docker build -f Dockerfile.dev
   - build시 로컬 node_modules 을 지워주자, 왜냐하면 dockerfile.dev에 RUN npm install COPY ./ ./일때
     RUN에서 도커에 node_moduls를 설치, 이후 실행되는 COPY는 모든 로컬파일을 복사하므로, 로컬의 node_modules를 한번 더 설치
     하게 되므로 중복설치를 막기위해서이다.

3. 만든 리액트 도커 이미지 / 컨테이너 실행하기

   - docker run <이름>
   - localhost:3000 접속 => error: 로컬포트와 도커포트 연결안해줬기때문
   - 방법: docker run -it -p 3000:3000 <이름>

4. 도커볼륨으로 소스코드변경후 실행하기

   - docker run -p 3000:3000 -v /usr/src/app/node_modules -v $(pwd):/usr/src/app imageID
   - 왼쪽 -v를 통해서 참조(매핑)안할 파일지정하기: node_modules을 한 이유는 도커에는 node_modules이 있지만, 로컬에는 지웠기때문
     혹여나 패키지버전,라이브러리가 변경되도 node_modules는 도커에 있는것을 참조할것이기 때문에 서로 대응할 필요 x
   - 오른쪽 -v를 통해서 $(pwd)는 현재 작업중인 로컬경로이름 : 도커경로
   - 실제로 로컬에서 리액트 코드 변경해보기 => 도커로 켜진 3000접속시(localhost:3000) 바로 바뀐것을 볼수 있다.

5. 도커컴포즈로 실행해보기

   - 너무김: docker run -p 3000:3000 -v /usr/src/app/node_modules -v $(pwd):/usr/src/app imageID
   - 도커컴포즈로 해결하자(yml 작성)
   - yml작성하기(위 도커컴포즈 참고)
   - docker-compose up: 빌드후 컨테이너 시작
   - localhost:3000 접속 => 정상도착
   - 실제로 로컬에서 리액트 코드 변경해보기 => 도커로 켜진 3000접속시(localhost:3000) 바로 바뀐것을 볼수 있다.
   - 참고) yml수정시: docker-compose up --build으로 빌드후 컨테이너 시작

6. 도커환경에서 리액트 테스트
   - docker run -it <이름> npm run test
   - 참고) 도커 컨테이너안에서 테스트 위해서는 도커안에 node_modules 있어야함
   - 테스트도 소스 변경시 바로 반영위해서는? 도커 컴포즈에 추가로 작성(아래 코드 참고)
   - docker-compose up --build으로 빌드후 컨테이너 시작

```
tests:
  build:
    context: .
    dockerfile: Dockerfile.dev
  volumes:
    - /usr/src/app/node_modules
    - ./:/usr/src/app
  command: ["npm", "run", "test"]
```
