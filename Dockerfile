FROM node:alpine
WORKDIR /usr/src/app
COPY package.json yarn.lock /usr/src/app/
RUN yarn set version berry --silent
COPY . .
RUN yarn install
RUN yarn build
CMD ["yarn","start"]