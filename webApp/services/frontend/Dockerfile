FROM node:12.14.1-alpine

ENV NPM_CONFIG_LOGLEVEL warn
ARG app_env
ENV NODE_ENV $app_env

RUN mkdir -p /frontend
WORKDIR /frontend

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 80
EXPOSE 3000

CMD ["sh", "./scripts/run.sh"]
