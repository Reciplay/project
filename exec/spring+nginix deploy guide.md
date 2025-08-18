Reciplay porting manual
1. docker network 생성
docker network create --driver bridge reciplay-bridge
2. secret값을 .env 파일로 배포 환경에 저장.
배포에 필요한 API나 암호화 관련 키 값을 .env 파일로 배포 환경에 저장합니다.
  /home/ubuntu/.env

3. git clone
프로젝트를 git clone 합니다.

4. gradlew clean build
API 서버와 WebSocket 서버는 모두 gralde 기반의 Spring boot 프로젝트로 구현되어 있습니다. 이들의 각 프로젝트 루트에서 gradlew 명령을 통해 jar 파일을 빌드합니다.

5. docker copse up 실행
docker compose --env-file /home/ubuntu/.env up --build -d || true
clone한 프로젝트 루트에서 위 명령을 실행합니다.

6. NGINX 적용
NGINX를 적용하여 /api/v1 요청을 8080 포트로, /ws 요청을 8081 포트로 라우팅합니다. 또, upgrade를 적용하여 Websocket 연결이 가능하도록 조치합니다.