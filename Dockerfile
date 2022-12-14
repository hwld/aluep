# 依存関係をインストールするステージ
FROM node:18.12-alpine3.16 AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
COPY prisma ./prisma/

RUN npm ci;
RUN npx prisma generate;


# アプリをビルドするステージ
FROM node:18-alpine AS builder
WORKDIR /app
# depsステージで取得したnode_modulesをコピーする
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# ビルド時に必要になるNEXT_PUBLIC系の環境変数を外から受け取る
ARG NEXT_PUBLIC_URL
ENV NEXT_PUBLIC_URL ${NEXT_PUBLIC_URL}

RUN npm run build

# アプリを実行する
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs


COPY --from=builder /app/public ./public

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

CMD ["node", "server.js"]