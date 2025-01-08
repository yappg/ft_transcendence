######################################
# Stage 1: Development stage
######################################
FROM node:alpine AS development

ENV NODE_ENV=development

WORKDIR /app

EXPOSE 3000

CMD ["sh", "-c", \
     "echo 'starting development enviremnt' && \
     yarn install && \
     while true; do yarn dev || echo 'Server crashed, restarting...'; sleep 2; done" \
    ]

######################################
# Stage 2: Build stage
######################################

FROM node:alpine AS builder

ENV NODE_ENV=production
ENV NODE_NO_WARNINGS=1

WORKDIR /app

COPY ./source/package.json ./source/yarn.lock ./

RUN yarn install --frozen-lockfile

COPY ./source ./

RUN yarn build
# CMD [ "tail", "-f", "/dev/null" ]

######################################
# Stage 3: Production build stage
######################################

FROM node:alpine AS production

ENV NODE_ENV=production
ENV NODE_NO_WARNINGS=1

WORKDIR /app

COPY ./source/package.json ./source/yarn.lock ./

RUN yarn install --frozen-lockfile --production

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

EXPOSE 3000

CMD ["yarn", "start"]
# CMD [ "tail", "-f", "/dev/null" ]
