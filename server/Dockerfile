FROM node:TAG

RUN mkdir -p /app
WORKDIR /app

COPY package.json ./

RUN npm i
CMD ["npm", "run", "start"]