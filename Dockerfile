FROM node:16-alpine

WORKDIR '/app'

COPY react_docker/package.json .
RUN npm install

COPY ..

RUN npm run build

FROM nginx
COPY --from=builder /app/build /usr/share/nginx/html