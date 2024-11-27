FROM node:alpine

COPY . /app

WORKDIR /app/source

RUN yarn install

# RUN yarn build

EXPOSE 3000

ENTRYPOINT [ "sh", "../config/autoDeploy.sh" ]
CMD ["yarn", "run", "dev"]



# # Stage 1: Build stage (common for both dev and prod)
# FROM node:alpine AS builder

# # Set working directory
# WORKDIR /app

# # Install dependencies (only dev dependencies here)
# COPY package.json yarn.lock ./
# RUN yarn install --frozen-lockfile

# # Copy source code
# COPY . .

# # Stage 2: Development stage (for dev environment)
# FROM node:alpine AS development

# # Set working directory
# WORKDIR /app

# # Copy dependencies from the builder stage
# COPY --from=builder /app /app

# # Expose development port
# EXPOSE 3000

# # Set NODE_ENV to development
# ENV NODE_ENV=development

# # Command to run the app in dev mode (with hot-reloading)
# CMD ["yarn", "dev"]

# # Stage 3: Production build stage
# FROM node:alpine AS production

# # Set working directory
# WORKDIR /app

# # Copy only production dependencies
# COPY --from=builder /app/package.json /app/yarn.lock /app/

# # Install production dependencies
# RUN yarn install --frozen-lockfile --production

# # Copy the rest of the app
# COPY --from=builder /app /app

# # Build the app (e.g., Next.js build)
# RUN yarn build

# # Expose production port
# EXPOSE 3000

# # Set NODE_ENV to production
# ENV NODE_ENV=production

# # Command to run the app in production mode
# CMD ["yarn", "start"]
