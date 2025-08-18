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