# =========================
# Reciplay Frontend Dockerfile (SSR/ISR)
# Multi-stage: build -> run (standalone)
# =========================

# --- Build stage ---
FROM node:20-alpine AS builder
WORKDIR /app

# (권장) 네이티브 모듈 대비 기본 패키지
# sharp 등 이미지 관련 네이티브 모듈이 있을 수 있어 libc6-compat 추가
RUN apk add --no-cache libc6-compat

# 종속성 설치 (캐시 최적화)
COPY package*.json ./
RUN npm ci

# 소스 복사 및 빌드
COPY . .
# next.config.(js|ts) 에 output: 'standalone' 이 있어야 standalone 산출
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# --- Run stage ---
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000

# 보안: non-root 권장. node 유저는 공식 이미지에 내장
USER node

# standalone 파일 및 정적 리소스만 복사 → 실행 가벼움
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

# (선택) 헬스체크: 서버가 기동된 후 200 응답 확인
# HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
#   CMD wget -qO- http://localhost:3000/ || exit 1

# Next.js standalone는 server.js를 포함
CMD ["node", "server.js"]