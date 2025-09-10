FROM node:10


#이미지안에서 어플리케이션소스 가지고있을 디렉토리 생성
#컨테이너 접근시 이게있으면 여기부터 접근
WORKDIR /usr/src/app

COPY package.json ./

RUN npm install

#두번쓰는 이유는 중속성먼저 다운받게해서 캐쉬사용하여 효율적빌드하기
COPY ./ ./

CMD ["node","server.js"]