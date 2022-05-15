FROM node:alpine
WORKDIR /usr/src/app
COPY package.json yarn.lock /usr/src/app/
RUN yarn
COPY . .
COPY /usr/src/app/dist ./dist
RUN yarn build
CMD ["yarn","start"]