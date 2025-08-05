# 1. 기본 이미지 설정 (OpenJDK 1.7)
# Alpine Linux 기반의 경량 이미지를 사용하여 이미지 크기를 최소화합니다.
FROM openjdk:17-jdk-slim

# 2. 작업 디렉터리 설정
# 컨테이너 내에서 명령어가 실행될 기본 경로를 설정합니다.
WORKDIR /app

# 3. JAR 파일 복사
# 호스트의 빌드된 JAR 파일을 컨테이너의 작업 디렉터리로 복사하고, 이름을 'app.jar'로 변경합니다.
# 이렇게 하면 CMD 명령어에서 파일 이름이 바뀌어도 Dockerfile을 수정할 필요가 없습니다.
COPY build/libs/ReciplayWebsocket-0.0.1-SNAPSHOT.jar app.jar

# 4. 포트 노출
# Spring Boot 애플리케이션의 기본 포트인 8080을 외부에 노출하도록 설정합니다.
EXPOSE 8081

# 5. 애플리케이션 실행
# 컨테이너가 시작될 때 실행할 명령어를 정의합니다.
# 'java -jar app.jar' 명령어로 애플리케이션을 실행합니다.
CMD ["java", "-jar", "app.jar"]