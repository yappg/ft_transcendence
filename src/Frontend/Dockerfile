######################################
# Stage 1: Development stage
######################################
FROM node:alpine AS development

ENV NODE_ENV=development

WORKDIR /app

COPY ./source/package.json ./
# ./source/yarn.lock ./

RUN yarn install

EXPOSE 3000

CMD ["sh", "-c", "while true; do yarn dev || echo 'Server crashed, restarting...'; sleep 5; done"]
# CMD ["tail", "-f", "/dev/null"]

######################################
# Stage 2: Build stage
######################################

FROM node:alpine AS builder

ENV NODE_ENV=production

WORKDIR /app/source

COPY ./source/package.json  ./

RUN yarn install --frozen-lockfile --production

COPY . /

RUN yarn build

######################################
# Stage 3: Production build stage
######################################

FROM node:alpine AS production

ENV NODE_ENV=production

WORKDIR /app

COPY --from=builder /app /app

EXPOSE 3000

ENTRYPOINT [ "sh", "../config/autoDeploy.sh" ]
CMD ["yarn", "start"]
# CMD [ "tail", "-f", "/dev/null" ]
