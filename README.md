도커명령어
- docker create <이름>: 도커 컨테이너 생성
- docker start <컨테이너 이름 or id>: 도커 컨테이너 실행(실행만 하고 아무런 메세지없음)
- docker start -a <컨테이너 이름 or id>: 도커 컨테이너 실행(메세지o)
- docker run <이름>: <이름>의 도커실행(컨테이너 생성과 동시에 실행)
- docker run <이름> ls: <이름>의 구조(파일스냅샷 있을경우 가능)
- docker run <이름> ping localhost:  <이름>을 실행하고 핑보내보기
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
- docker run -p <로컬port>:<컨테이너port>: 만든 이미지 연결
   - 실행되고 있는 도커파일을 다른pc 혹은 다른 네트워크를 통해서 보고싶다면 매핑해줘야 가능하다.
- docker run -d: 도커실행후 터미널에서 바로 빠져나오기
   - ex) docker run -d -p 5000:8080 choisis/node:lastest
- docker-compose up: 이미지없을때, 이미지 빌드후 컨테이너 시작
- docker-compose up --build: 이미지 유무상관없이, 이미지 빌드후 컨테이너 시작,수정시 보통이것사용
- docker-compose down: 도커컴포즈를 통해 동작시간 컨테이너들을 중지
도커이미지생성
1. 도커파일을 작성한다.
2. 도커클라이언트에게 도커파일을 전달한다. ex) docker build -t <원하는 이미지 이름> .
3. 도커클라이언트가 도커서버에 요청
4. 이미지가 생성된다

도커파일만들기
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
    - 2. 1번 업그레이드
     - docker volumes사용: 복사가 아니라 참조를 하는방법이다.
     - 변경사항 반영이 쉽다.
     - -v -v: 왼쪽 로컬의참초안할부분, 오른쪽: 매핑할것(로컬디렉토리:도커디렉토리)
     - ex) docker run -p 5050:8080 -v/usr/src/app/node_modules -v $(pwd):/usr/src/app imageID
     - (pwd)란?: 현재 작업중인 디렉토리의 이름을 제공

도커컴포즈
 - 여러 컨테이너를 사용하는 것을 연결해주는것, 즉 컨테이너를 연결해주는것
 - docker-compose.yml 을 작성시 명령어로 간단하게 여러 컨테이너를 일괄적 관리 실행 가능
 - yml로 컨테이너를 감싸는것
 - 구조설명
   - version: 도커컴포즈버전
   - services: 실행하려는 개별컨테이너를 정의하는 부분
     - web: 서비스를 빌드하기 위한 설정
       - context: 해당 디렉토리를 빌드 컨텍스트로 사용
       - dockerfile: 이미지를 빌드할 도커파일
       - ports: 컨테이너와 호스트간 매핑(로컬: 컨테이너 포트)
       - volumes: 컨테이너와 호스트 간 파일공유, .붙이면 공유 없으면 공유x정의

