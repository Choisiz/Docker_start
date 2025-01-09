FROM node:10

WORKDIR /usr/src/app

COPY package.json ./

RUN npm install

#두번쓰는 이유는 중속성먼저 다운받게해서 캐쉬사용하여 효율적빌드하기
COPY ./ ./

CMD ["node","server.js"]