# Reciplay 문서 기반 챗봇

이 프로젝트는 FastAPI와 LangChain을 사용하여 구축된 문서 기반의 AI 챗봇입니다. 사용자의 질문에 대해 주어진 문서의 내용을 기반으로 답변을 생성하며, 대화 기록을 관리하여 맥락을 유지하는 기능을 제공합니다.

## 🌟 주요 기능

- **문서 기반 Q&A**: RAG(Retrieval-Augmented Generation) 아키텍처를 활용하여 문서 내용에 근거한 답변을 생성합니다.
- **대화 기록 관리**: 사용자별로 대화 기록을 관리하여 연속적인 대화가 가능합니다.
- **FastAPI 백엔드**: 비동기 웹 프레임워크인 FastAPI를 사용하여 안정적이고 빠른 API 서버를 제공합니다.
- **커스텀 LLM 연동**: LangChain의 `LLM` 클래스를 상속하여 내부 시스템 또는 특정 LLM API와 유연하게 연동할 수 있습니다.

## 🛠️ 기술 스택

- **Backend**: FastAPI
- **AI/LLM**: LangChain, OpenAI (GPT-4.1-mini, text-embedding-3-small)
- **Vector Database**: FAISS
- **Configuration**: python-decouple

## 📂 프로젝트 구조

```
.
├── app/
│   ├── chatbot/
│   │   ├── .env                 # API 키 등 환경 변수 설정 파일
│   │   ├── faiss_index/         # FAISS 벡터 인덱스 저장 폴더
│   │   ├── chatbot_test.py      # 챗봇 핵심 로직 (RAG, LangChain)
│   │   └── test_document.txt    # 인덱싱할 샘플 문서
│   └── main.py                # FastAPI 애플리케이션
└── readme.md
```

## 🚀 시작하기

### 1. 프로젝트 클론

```bash
git clone <repository-url>
cd reciplay_chatbot
```

### 2. 가상 환경 생성 및 활성화

```bash
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
```

### 3. 의존성 설치

프로젝트에 필요한 라이브러리를 설치합니다. (`requirements.txt` 파일이 필요합니다)

```bash
pip install fastapi uvicorn langchain langchain-openai faiss-cpu python-decouple
```

### 4. 환경 변수 설정

`app/chatbot/` 경로에 `.env` 파일을 생성하고 아래 내용을 채워넣으세요.

```env
GMS_API_KEY="YOUR_API_KEY"
GMS_URL="YOUR_API_BASE_URL"
```

### 5. 문서 인덱싱

챗봇이 참고할 문서를 벡터 인덱스로 만들어야 합니다. `save_doc` 함수를 실행하여 인덱스를 생성할 수 있습니다.

예시: `test_document.txt` 파일을 인덱싱하려면 아래와 같이 파이썬 스크립트를 작성하여 실행할 수 있습니다.

**`create_index.py`**
```python
from app.chatbot.chatbot_test import save_doc
import os

# 인덱싱할 문서 경로
doc_path = os.path.join("app", "chatbot", "test_document.txt")
# 인덱스를 저장할 경로
index_path = os.path.join("app", "chatbot", "faiss_index")

if __name__ == "__main__":
    save_doc(doc_path, index_path)
```

**실행**
```bash
python create_index.py
```

### 6. 서버 실행

FastAPI 서버를 실행합니다.

```bash
uvicorn app.main:app --reload
```

## 💬 API 사용법

서버가 실행되면 `http://127.0.0.1:8000/chat/` 엔드포인트로 POST 요청을 보내 챗봇과 대화할 수 있습니다. `user_id`를 헤더에 포함하여 사용자별 대화 기록을 관리할 수 있습니다.

### cURL 예시

```bash
curl -X POST "http://127.0.0.1:8000/chat/" \
-H "Content-Type: application/json" \
-H "user_id: user123" \
-d '{"message": "안녕하세요?"}'
