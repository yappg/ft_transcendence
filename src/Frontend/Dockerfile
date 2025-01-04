######################################
# Stage 1: Development stage
######################################
FROM node:alpine AS development

ENV NODE_ENV=development

WORKDIR /app

COPY ./source/package.json ./
# COPY ./source/package.json ./source/yarn.lock ./

# RUN yarn install

EXPOSE 3000

# CMD ["sh", "-c", "while true; do yarn dev || echo 'Server crashed, restarting...'; sleep 5; done"]
CMD [ "tail", "-f", "/dev/null" ]

######################################
# Stage 2: Build stage
######################################

FROM node:alpine AS builder

ENV NODE_ENV=production

WORKDIR /app

COPY ./source/package.json  ./

RUN yarn install --frozen-lockfile

COPY . ./

CMD [ "tail", "-f", "/dev/null" ]
# RUN yarn build

######################################
# Stage 3: Production build stage
######################################

FROM node:alpine AS production

ENV NODE_ENV=production

WORKDIR /app

COPY ./source/package.json ./source/yarn.lock ./

RUN yarn install --frozen-lockfile --production

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000

CMD ["yarn", "start"]
# CMD [ "tail", "-f", "/dev/null" ]
