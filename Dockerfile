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
# (같은 디렉토리에 있는 .env, .env.production 등 모두 복사)
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

# 보안: non-root 실행
USER node

# standalone 파일 및 정적 리소스만 복사 → 실행 가벼움
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/static ./.next/static

# (옵션) 런타임에서도 .env 읽도록 포함 (서버 전용 env가 필요할 때)
# Next.js는 기본적으로 런타임에 .env를 자동 로딩하진 않지만,
# node -r dotenv/config 등의 방식이나 커스텀 로직을 쓰는 경우를 대비해 둠.
# 필요 없으면 아래 두 줄은 제거 가능.
COPY --from=builder /app/.env ./.env
COPY --from=builder /app/.env.production ./.env.production

EXPOSE 3000

# HEALTHCHECK 사용 시 curl 필요 -> apk add curl (runner 단계에서 root 필요)
# 여기서는 주석 처리
# HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
#   CMD wget -qO- http://localhost:3000/ || exit 1

# Next.js standalone는 server.js를 포함
CMD ["node", "server.js"]
