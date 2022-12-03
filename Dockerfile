FROM node:16.14-alpine3.14

WORKDIR /usr/app

COPY . .

RUN yarn install

RUN yarn build

CMD [ "yarn", "start" ]
