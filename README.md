<div align="center">
  <img src="https://raw.githubusercontent.com/Reciplay/resources/refs/heads/main/mainmock.png"/>
</div>

<br/>

<div align="center">

[![Homepage](https://img.shields.io/badge/Homepage-000000?style=for-the-badge&logo=firefox&logoColor=white)](https://i13e104.p.ssafy.io/)
&nbsp;
[![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=white)](http://i13e104.p.ssafy.io:8080/swagger-ui/index.html)
&nbsp;
[![Notion](https://img.shields.io/badge/Notion-000000?style=for-the-badge&logo=notion&logoColor=white)](https://www.notion.so/SSAFY-2-2227e3c3551e80889293c5391b2508cb)

</div>




---
# 화상 요리 코칭 프로그램

## 프로젝트 개요
- **프로젝트명:** 화상 요리 코칭 프로그램  
- **프로젝트 기간:** 2025.07.14 ~ 2025.08.18 
- **프로젝트 형태:** 팀 프로젝트 (실시간 화상 수업 + AI 융합 서비스)  
- **목표:** 제스처 기반 조작, 실시간 화상 수업, STT 기반 챗봇을 결합한 **상호작용형 요리 학습 플랫폼 개발**  
- **주요 타겟 사용자:** 요리 학습을 원하는 일반 사용자 및 강사  

---

## 프로젝트 소개

### 프로젝트 배경
기존 온라인 요리 강의는 단순 영상 시청 위주로,  
- 손이 자유롭지 않아 **조작이 불편**하고  
- 강의 **진도를 놓치기 쉽고 집중도가 낮으며**  
- 강사와 **실시간 상호작용이 제한**되는 문제점이 있었습니다.  

👉 이를 해결하기 위해 본 프로젝트는 **실시간 화상 통신, 제스처 인식, STT 챗봇, AI 보조**를 융합하여 **양방향 학습 경험**을 제공합니다.  

---

## 프로젝트 목표
1. **실시간 상호작용 강화**  
   - 제스처 인식을 통한 직관적 강의 제어  
   - WebSocket 기반 실시간 소통  

2. **학습 편의성 증대**  
   - STT 기반 **자동 질문 생성**  
   - LLM + RAG 기반 **문맥형 AI 응답 제공**  

3. **안정적이고 확장 가능한 플랫폼 구축**  
   - LiveKit 기반 **저지연 미디어 서버**  
   - AWS S3 기반 **안정적 자료 관리 및 확장성 확보**  

---

## 주요 기능
### 제스처 기반 강의 제어
- 손동작으로 챕터 이동 및 화면 제어  
- 조작 부담 최소화 → 학습 집중도 향상  

### 실시간 화상 코칭
- **LiveKit + WebSocket** 기반 화상 강의  
- 200ms 내 알림/모달 표시로 즉각 소통  

### STT + AI 챗봇
- 학습자가 발화 → STT 변환 → 질문 자동 생성  
- LLM + RAG 기반으로 레시피·강의 자료에 맞춘 답변 제공

### AI 기반 강의 자료 생성
- AI가 요리 주제에 맞는 **레시피, 단계별 가이드, 시각 자료**를 자동 생성  
- 강사의 부담을 줄이고, 학습자는 최신 자료를 손쉽게 제공받을 수 있음  

### 안정적인 강의 자료 관리
- **AWS S3 + Presigned URL**  
- 강의 영상, 레시피 PDF 안전하게 업로드/다운로드  

### 관리자/강사 기능
- 강의 등록 및 자료 관리  
- 수강자 참여도 모니터링  

---
## Architecture
<img src="http://github.com/Reciplay/resources/blob/main/%EC%95%84%ED%82%A4%ED%85%8D%EC%B3%90%20%EC%84%A4%EA%B3%84.png?raw=true"/>

## 기술 스택
<table>
  <thead>
    <tr>
      <th>분류</th>
      <th>기술 스택</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>프론트엔드</td>
      <td>
        <img src="https://img.shields.io/badge/Next.js-000000?style=flat&logo=nextdotjs&logoColor=white"/>
        <img src="https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=white"/>
        <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white"/>
        <img src="https://img.shields.io/badge/SCSS-CC6699?style=flat&logo=sass&logoColor=white"/>
        <img src="https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white"/>
        <img src="https://img.shields.io/badge/Zustand-1572B6?style=flat&logo=react&logoColor=white"/>
        <img src="https://img.shields.io/badge/NextAuth-000000?style=flat&logo=auth0&logoColor=white"/>
        <img src="https://img.shields.io/badge/Jest-C21325?style=flat&logo=jest&logoColor=white"/>
      </td>
    </tr>
    <tr>
      <td>백엔드</td>
      <td>
        <img src="https://img.shields.io/badge/Java-007396?style=flat&logo=openjdk&logoColor=white"/>
        <img src="https://img.shields.io/badge/Spring%20Boot-6DB33F?style=flat&logo=springboot&logoColor=white"/>
        <img src="https://img.shields.io/badge/Spring%20Security-6DB33F?style=flat&logo=springsecurity&logoColor=white"/>
        <img src="https://img.shields.io/badge/JWT-000000?style=flat&logo=jsonwebtokens&logoColor=white"/>
        <img src="https://img.shields.io/badge/Hibernate-59666C?style=flat&logo=hibernate&logoColor=white"/>
        <img src="https://img.shields.io/badge/Spring%20Data%20JPA-6DB33F?style=flat&logo=spring&logoColor=white"/>
        <img src="https://img.shields.io/badge/QueryDSL-005571?style=flat&logo=spring&logoColor=white"/>
        <img src="https://img.shields.io/badge/MySQL-4479A1?style=flat&logo=mysql&logoColor=white"/>
        <img src="https://img.shields.io/badge/JUnit5-25A162?style=flat&logo=junit5&logoColor=white"/>
        <img src="https://img.shields.io/badge/Gradle-02303A?style=flat&logo=gradle&logoColor=white"/>
      </td>
    </tr>
    <tr>
      <td>AI & 챗봇</td>
      <td>
        <img src="https://img.shields.io/badge/Python-3776AB?style=flat&logo=python&logoColor=white"/>
        <img src="https://img.shields.io/badge/FastAPI-009688?style=flat&logo=fastapi&logoColor=white"/>
        <img src="https://img.shields.io/badge/STT-Speech--to--Text-FF6F00?style=flat&logo=google&logoColor=white"/>
        <img src="https://img.shields.io/badge/LLM-GPT-8A2BE2?style=flat&logo=openai&logoColor=white"/>
        <img src="https://img.shields.io/badge/RAG-009688?style=flat&logo=elastic&logoColor=white"/>
        <img src="https://img.shields.io/badge/AI%20자료%20생성-FF1493?style=flat&logo=apachespark&logoColor=white"/>
      </td>
    </tr>
    <tr>
      <td>실시간 & 미디어</td>
      <td>
        <img src="https://img.shields.io/badge/STOMP-4B32C3?style=flat&logo=apachekafka&logoColor=white"/>
        <img src="https://img.shields.io/badge/WebRTC-333333?style=flat&logo=webrtc&logoColor=white"/>
        <img src="https://img.shields.io/badge/OpenVidu-0E76A8?style=flat&logo=data:image/svg+xml;base64,PHN2Zy8+&logoColor=white"/>
        <img src="https://img.shields.io/badge/LiveKit-121212?style=flat&logo=data:image/svg+xml;base64,PHN2Zy8+&logoColor=white"/>
      </td>
    </tr>
    <tr>
      <td>인프라 & DevOps</td>
      <td>
        <img src="https://img.shields.io/badge/Amazon%20EC2-FF9900?style=flat&logo=amazonec2&logoColor=white"/>
        <img src="https://img.shields.io/badge/Amazon%20S3-569A31?style=flat&logo=amazons3&logoColor=white"/>
        <img src="https://img.shields.io/badge/Nginx-009639?style=flat&logo=nginx&logoColor=white"/>
        <img src="https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white"/>
        <img src="https://img.shields.io/badge/Redis-DC382D?style=flat&logo=redis&logoColor=white"/>
        <img src="https://img.shields.io/badge/Jenkins-D24939?style=flat&logo=jenkins&logoColor=white"/>
        <img src="https://img.shields.io/badge/GitHub%20Actions-2088FF?style=flat&logo=githubactions&logoColor=white"/>
        <img src="https://img.shields.io/badge/GitLab-FC6D26?style=flat&logo=gitlab&logoColor=white"/>
        <img src="https://img.shields.io/badge/Ubuntu-E95420?style=flat&logo=ubuntu&logoColor=white"/>
      </td>
    </tr>
    <tr>
      <td>문서화 & 협업</td>
      <td>
        <img src="https://img.shields.io/badge/Swagger%203%20(OpenAPI)-85EA2D?style=flat&logo=swagger&logoColor=white"/>
        <img src="https://img.shields.io/badge/Notion-000000?style=flat&logo=notion&logoColor=white"/>
      </td>
    </tr>
    <tr>
      <td>성능/품질</td>
      <td>
        <img src="https://img.shields.io/badge/JMeter-D22128?style=flat&logo=apache&logoColor=white"/>
      </td>
    </tr>
  </tbody>
</table>

## MySQL기반 인증 과정
<img src="https://raw.githubusercontent.com/Reciplay/resources/refs/heads/main/MySQL%EA%B8%B0%EB%B0%98%20%EC%9D%B8%EC%A6%9D.png"/>

## 레디스기반 인증 과정
<img src="https://raw.githubusercontent.com/Reciplay/resources/refs/heads/main/%EB%A0%88%EB%94%94%EC%8A%A4%EA%B8%B0%EB%B0%98%20%EC%9D%B8%EC%A6%9D.png"/>

## 팀원 소개
| 이름 | 역할 | Contact | 블로그 |
|:----:|:----:|:----:|:----:|
| 이재익 | 팀장 & FE & AI | [Git](https://github.com/onearmedoflepanto) |  |
| 강태욱 | FE & Design | [Git](https://github.com/sunshinemoongit) |  |
| 배준재 | BE | [Git](https://github.com/baejjyee) | [블로그](https://baejjyeestory.tistory.com/) |
| 이지언 | FE & Design | [Git](https://github.com/leejieok) |  |
| 이원준 | BE & Infra | [Git](https://github.com/moe-lee) | [블로그](https://velog.io/@cosmos334/posts) |
| 윤지욱 | BE | [Git](https://github.com/Yun-JW) |  |

## 문서 자료

- [포팅 메뉴얼](https://github.com/Reciplay/exec/blob/main/README.md)
- [발표 자료](https://github.com/Reciplay/resources/blob/main/%ED%99%94%EC%83%81%EC%9A%94%EB%A6%AC%EC%BD%94%EC%B9%98%ED%94%84%EB%A1%9C%EA%B7%B8%EB%9E%A8.pdf)
- [API 가이드 라인](https://github.com/Reciplay/.github/blob/main/API_%EA%B0%80%EC%9D%B4%EB%93%9C%EB%9D%BC%EC%9D%B8.pdf)

---
