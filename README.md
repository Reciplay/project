## 1. NPM BUILD

```bash
npm run build
```

## 2. 빌드 중 오류

### prettier 에러

```bash
npx prettier --write .
```

## 3. 도커 허브 빌드 & 푸쉬

```bash
docker buildx build \
  --platform linux/amd64 \
  -t sunshinemoon/reciplay-frontend:v1.0.23 \
  --push .
```

## 4. 로컬에 도커 허브 풀 & 업데이트(선택)

```bash
docker pull sunshinemoon/reciplay-frontend:v1.0.23

docker rm -f reciplay-frontend 2>/dev/null || true
```

## 5. 로컬에서 도커 실행(선택)

```bash
docker run -d --name reciplay-frontend \
  --restart unless-stopped \
  --env-file C:/Users/SSAFY/Desktop/project/reciplay_frontend/.env \
  -p 3000:3000 \
  sunshinemoon/reciplay-frontend:v1.0.23
```

## 6. mobaXterm에서 프론트 풀 & 실행 순서

1. 기존 컨테이너 중지 및 삭제
    
    ```bash
    sudo docker stop frontend-container
    sudo docker rm frontend-container
    ```
    
2. 최신 이미지 받기 (필요시)
    
    ```bash
    sudo docker pull sunshinemoon/reciplay-frontend:v1.0.23
    ```
    
3. 새 컨테이너 실행
    
    ```bash
    sudo docker run -d --name frontend-container -p 3000:3000 sunshinemoon/reciplay-frontend:v1.0.23
    ```