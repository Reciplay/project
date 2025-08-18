# =========================
# Reciplay Frontend Dockerfile (SSR/ISR)
# Multi-stage: build -> run (standalone)
# =========================

# --- Build stage ---
FROM node:20-alpine AS builder
WORKDIR /app

# (권장) 네이티브 모듈 대비 기본 패키지
RUN apk add --no-cache libc6-compat

# 종속성 설치 (캐시 최적화)
COPY package*.json ./
RUN npm ci

# .env 포함: 빌드 시 NEXT_PUBLIC_* 등이 필요할 수 있음
COPY .env* ./

# 소스 복사 및 빌드
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# --- Run stage ---
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000

# 1) 루트 권한으로 디렉토리 준비 및 소유권 설정
#    - /app 및 .next 디렉토리를 미리 만들고 node 유저에게 소유권 부여
RUN mkdir -p /app/.next/cache && chown -R node:node /app

# 2) 빌드 산출물 복사 (소유권을 node:node로 맞춰서 복사)
COPY --chown=node:node --from=builder /app/.next/standalone ./
COPY --chown=node:node --from=builder /app/public ./public
COPY --chown=node:node --from=builder /app/.next/static ./.next/static

# (옵션) 런타임에서도 .env 읽도록 포함 (필요 시에만)
COPY --chown=node:node --from=builder /app/.env ./.env
# COPY --chown=node:node --from=builder /app/.env.production ./.env.production

# 3) non-root로 실행 (이 시점 이후)
USER node

EXPOSE 3000

# HEALTHCHECK 사용 시 필요한 패키지 설치 후 활성화 가능
# (alpine에서 wget 사용 예시)
# USER root
# RUN apk add --no-cache wget
# USER node
# HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
#   CMD wget -qO- http://localhost:3000/ || exit 1

# Next.js standalone는 server.js를 포함
CMD ["node", "server.js"]
