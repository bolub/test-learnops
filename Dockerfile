FROM node:16-alpine

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./
RUN npm ci --silent
RUN npm install -g serve

COPY . ./

ARG STAGE
ENV REACT_APP_APP_ENV=$STAGE

RUN chown -R node:node /app/node_modules
RUN npm run build

CMD ["npm", "start"]
