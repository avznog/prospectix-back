FROM node:alpine
WORKDIR /usr/src/app
COPY package.json yarn.lock .yarn .yarnrc.yml /usr/src/app/
RUN yarn install
COPY /usr/src/app/dist ./dist
COPY src/credentials.web.dev.json src/credentials.web.staging.json src/credentials.web.prod.json ./dist/
# RUN yarn set version berry --silent
COPY . .
RUN yarn build
CMD ["yarn","start"]