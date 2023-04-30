FROM node:alpine
WORKDIR /usr/src/app
COPY package.json yarn.lock /usr/src/app/
RUN yarn set version berry --silent
COPY . .
# COPY /usr/src/app/dist ./dist
COPY src/credentials.web.dev.json src/credentials.web.staging.json src/credentials.web.prod.json ./dist/
RUN yarn install
RUN yarn build
CMD ["yarn","start"]