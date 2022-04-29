FROM node:16.13-alpine3.14

WORKDIR /usr/src/app1

COPY . .

RUN npm install

EXPOSE 5000

CMD [ "node", "app.js" ]