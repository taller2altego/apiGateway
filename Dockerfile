FROM node:16
WORKDIR /usr/src/app
COPY package*.json ./

ENV NODE_ENV local

RUN npm install
RUN npm i -g nodemon

COPY . .
EXPOSE 5000
ENTRYPOINT ["npm", "start"]