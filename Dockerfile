FROM node:alpine
WORKDIR /usr/src/app
COPY package.json yarn.lock /usr/src/app/
RUN yarn install
COPY . .
COPY src/credentials.web.dev.json src/credentials.web.staging.json src/credentials.web.prod.json ./dist/
# COPY /usr/src/app/dist ./dist
RUN yarn build
CMD ["yarn","start"]