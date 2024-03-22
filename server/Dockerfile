FROM node:18.17.1

RUN mkdir -p /app
WORKDIR /app

COPY package.json ./

RUN npm i
CMD ["npm", "run", "start"]