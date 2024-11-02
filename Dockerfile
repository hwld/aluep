
# 依存関係をインストールするステージ
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat make gcc g++ python3
WORKDIR /app
COPY package.json package-lock.json ./
COPY prisma ./prisma/

RUN npm ci;
RUN npx prisma generate;


# アプリをビルドするステージ
FROM node:20-alpine AS builder
WORKDIR /app
# depsステージで取得したnode_modulesをコピーする
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# ビルド時に必要になるNEXT_PUBLIC系の環境変数を外から受け取る
ARG NEXT_PUBLIC_URL
ENV NEXT_PUBLIC_URL ${NEXT_PUBLIC_URL}

ARG NEXT_PUBLIC_CONTACT_URL
ENV NEXT_PUBLIC_CONTACT_URL ${NEXT_PUBLIC_CONTACT_URL}

ARG NEXT_PUBLIC_RECAPTCHA_KEY
ENV NEXT_PUBLIC_RECAPTCHA_KEY ${NEXT_PUBLIC_RECAPTCHA_KEY}

RUN npm run build

# アプリを実行する
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs


COPY --from=builder /app/public ./public

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

CMD ["node", "server.js"]