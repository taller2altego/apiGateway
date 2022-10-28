FROM node:16
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
RUN NODE_ENV=asd
COPY . .
EXPOSE 5000
ENTRYPOINT ["npm", "start"]