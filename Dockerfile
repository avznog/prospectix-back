FROM node:latest
WORKDIR /usr/src/app
COPY package.json yarn.lock .yarn .yarnrc.yml ./
RUN yarn install
COPY . .
COPY src/credentials.web.dev.json src/credentials.web.staging.json src/credentials.web.prod.json ./dist/
COPY /usr/src/app/dist ./dist
# FROM node:alpine
# WORKDIR /usr/src/app
# COPY package.json yarn.lock /usr/src/app/
# RUN yarn set version berry --silent
# RUN yarn install
# COPY . .

# RUN yarn build
# CMD ["yarn","start"]