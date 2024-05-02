FROM node:slim AS base

# Install Google Chrome Stable and fonts
# Note: this installs the necessary libs to make the browser work with Puppeteer.
RUN apt-get update && apt-get install gnupg wget -y && \
  wget --quiet --output-document=- https://dl-ssl.google.com/linux/linux_signing_key.pub | gpg --dearmor > /etc/apt/trusted.gpg.d/google-archive.gpg && \
  sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' && \
  apt-get update && \
  apt-get install google-chrome-stable -y --no-install-recommends && \
  rm -rf /var/lib/apt/lists/*

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV CHROMIUM_PATH=/usr/bin/chromium-browser

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