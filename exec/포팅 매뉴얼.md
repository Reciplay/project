Reciplay porting manual
## docker network 생성
docker network create --driver bridge reciplay-bridge

## secret값을 .env 파일로 배포 환경에 저장.
배포에 필요한 API나 암호화 관련 키 값을 .env 파일로 배포 환경에 저장합니다.
  /home/ubuntu/.env

## git clone
프로젝트를 git clone 합니다.

## gradlew clean build
API 서버와 WebSocket 서버는 모두 gralde 기반의 Spring boot 프로젝트로 구현되어 있습니다. 이들의 각 프로젝트 루트에서 gradlew 명령을 통해 jar 파일을 빌드합니다.

## docker copse up 실행
docker compose --env-file /home/ubuntu/.env up --build -d || true
clone한 프로젝트 루트에서 위 명령을 실행합니다.

## NGINX 적용
NGINX를 적용하여 /api/v1 요청을 8080 포트로, /ws 요청을 8081 포트로 라우팅합니다. 또, upgrade를 적용하여 Websocket 연결이 가능하도록 조치합니다.


## Jenkins 파이프라인 설정 (선택)
```
#!/bin/bash
echo "remove pre-exist containers"
docker ps -a --filter "name=reciplay" -q | xargs -r docker stop
docker ps -a --filter "name=reciplay" -q | xargs -r docker rm

echo "MySQL, Redis start"
docker run -d --name reciplay-mysql --network reciplay-bridge --net-alias mysql -e MYSQL_ROOT_PASSWORD=ssafy -e MYSQL_DATABASE=reciplay_db -e MYSQL_USER=e104 -e MYSQL_PASSWORD=e104 -p 3306:3306 -v /var/docker-volumes/reciplay/mysql/data:/var/lib/mysql -v /var/docker-volumes/reciplay/mysql/initdb:/docker-entrypoint-initdb.d mysql:8.0

docker run -d --name reciplay-redis --network reciplay-bridge --net-alias redis -p 6379:6379 -v /var/docker-volumes/reciplay/redis/data:/data redis

echo "⏳ Waiting for MySQL and Redis to be ready..."
sleep 15  # 최소한의 대기. 필요 시 healthcheck로 대체 가능

# Build
# 1. 스프링 프로젝트 빌드
# 1.1 API 서버 빌드
echo "build api server"
cd /var/lib/jenkins/workspace/Common\ project\ E104/Backend || exit 1
bash ./gradlew clean build

# 1.2. 웹 소켓 서버 빌드
echo "build socket server"
cd /var/lib/jenkins/workspace/Common\ project\ E104/WebsocketServer/ReciplayWebsocket || exit 1
bash ./gradlew clean build

echo "livekit Server disposal"
docker compose up -d --no-deps --force-recreate livekit-server

# 2. 도커 컴포즈 실행
cd /var/lib/jenkins/workspace/Common\ project\ E104
echo "Compose up"
docker compose --env-file /home/ubuntu/.env up --build -d || true
```


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

##기타

필요한 API KEY

NAVER_CLIENT_ID

NAVER_CLIENT_SECRET

GOOGLE_CLIENT_ID

GOOGLE_CLIENT_SECRET

KAKAO_CLIENT_ID

KAKAO_CLIENT_SECRET

NEXTAUTH_SECRET

NEXTAUTH_URL

NEXT_PUBLIC_API_BASE

PICOVOICE_SECRET

GMS_KEY

##시연 시나리오

1. 강사
1-1. 로그인(강사 역할 유저 or 학생 역할 유저)

1-1-1. 학생일 경우 강사 신청

1-1-2. 강사 신청 승인

1-1-3. 강사 정보 입력(주소, 자격 사항)

1-2-1. 강좌 등록(강좌명, 강의 시간, 총 강의 수, 주제, 강의 자료 등 입력)

1-2-2. 강좌 등록 승인

1-2-3. 강의 개설 후 입장

1-3-1. crossed Arm 제스처 테스트(질문 처리 제스처)

1-3-2. clap 제스터 테스트(todo 갱신)


2. 학생

2-1. 로그인(or 회원가입 or 소셜 로그인)

2-2. 수강 신청

2-3. 강의 입장

2-4-1. 주먹 쥐기 제스처 테스트(강사에게 질문 전송)

2-4-2. 따봉 제스처 테스트(Todo 넘어가기)
