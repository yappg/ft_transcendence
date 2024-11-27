######################################
# Stage 1: Development stage
######################################
FROM node:alpine AS development

WORKDIR /app

COPY ./source/package.json ./source/yarn.lock ./

RUN yarn install

EXPOSE 3000

CMD ["yarn", "dev"]

######################################
# Stage 2: Build stage
######################################

FROM node:alpine AS builder

WORKDIR /app/source

COPY ./source/package.json ./source/yarn.lock ./

RUN yarn install --frozen-lockfile --production

COPY . /

RUN yarn build

######################################
# Stage 3: Production build stage
######################################

FROM node:alpine AS production

WORKDIR /app

COPY --from=builder /app /app

EXPOSE 3000

ENTRYPOINT [ "sh", "../config/autoDeploy.sh" ]
CMD ["yarn", "start"]

###### subject to change ######
