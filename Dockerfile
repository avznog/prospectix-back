FROM node:alpine
# WORKDIR /usr/src/app
# COPY package.json yarn.lock /usr/src/app/
# RUN yarn
# COPY . .
COPY dist/ ./dist
# RUN yarn build
# CMD ["yarn","start"]
# COPY dist/prospectix-back/ /usr/share/nginx/html