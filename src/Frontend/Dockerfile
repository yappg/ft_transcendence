######################################
# Stage 1: Development stage
######################################
FROM node:alpine AS development

ENV NODE_ENV=development

WORKDIR /app

EXPOSE 3000

CMD ["sh", "-c", \
     "echo 'starting development enviremnt' && \
     while true; do yarn dev && echo 'Server crashed, restarting...' && sleep 2; done" \
    ]

######################################
# Stage 2: Production build stage
######################################

FROM node:alpine AS production

ENV NODE_ENV=production
ENV NODE_NO_WARNINGS=1

WORKDIR /app

COPY ./source/package.json ./source/yarn.lock ./

RUN yarn install --frozen-lockfile

COPY ./source ./

RUN yarn build

EXPOSE 3000

CMD ["tail", "-f", "/dev/null"]
# CMD ["yarn", "start"]
