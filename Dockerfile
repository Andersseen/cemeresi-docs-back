FROM node:20-alpine AS base

RUN npm i -g pnpm
RUN npm i -g @nestjs/cli

FROM base AS dependencies

WORKDIR /usr/src/app

# Set production environment
ENV NODE_ENV=production
ENV DATABASE_URL={$DATABASE_URL}

COPY package.json pnpm-lock.yaml ./
RUN pnpm install


FROM base AS build

WORKDIR /usr/src/app
COPY . .
COPY --from=dependencies /usr/src/app/node_modules ./node_modules
COPY prisma-client ./prisma-client
RUN npx puppeteer browsers install chrome

RUN pnpm build
RUN pnpm prune --prod




EXPOSE 3000

CMD [ "node", "dist/main.js" ]