FROM node:alpine
WORKDIR /usr/src/app
COPY package.json yarn.lock /usr/src/app/
RUN yarn
COPY . .
COPY src/credentials.dev.json src/credentials.staging.json src/credentials.prod.js ./dist/
# COPY /usr/src/app/dist ./dist
RUN yarn build
CMD ["yarn","start"]