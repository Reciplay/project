from langchain_community.document_loaders import TextLoader
from langchain_core.documents import Document
from langchain_core.prompts import PromptTemplate
from langchain.chains import ConversationalRetrievalChain
from langchain.memory import ConversationBufferMemory
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import FAISS
from langchain.llms.base import LLM

from pydantic import SecretStr
from typing import Optional, List, Any
import requests
import re
from decouple import config
import os
import pdfplumber

# === Configuration === #
API_KEY = "S13P12E104-9fba4818-53ba-4f8b-92ce-fcc15166bb33"
BASE_URL = "https://gms.ssafy.io/gmsapi/api.openai.com/v1"
CHATBOT_LLM_MODEL = "gpt-4.1-mini"
EMBED_MODEL = "text-embedding-3-small"


# === LLM Definition === #
class ChatbotLLM(LLM):
    @property
    def _llm_type(self) -> str:
        return "MycompanyLLM"

    def _call(
        self, prompt: str, stop: Optional[List[str]] = None, **kwargs: Any
    ) -> str:
        url = f"{BASE_URL}/chat/completions"
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {API_KEY}",
        }
        data = {
            "model": CHATBOT_LLM_MODEL,
            "messages": [
                {"role": "system", "content": "answer in korean"},
                {"role": "user", "content": prompt},
            ],
            "max_tokens": 4096,
            "temperature": 0.3,
        }
        try:
            response = requests.post(url=url, headers=headers, json=data)
            response.raise_for_status()
            result = response.json()
            return result["choices"][0]["message"]["content"]
        except Exception as e:
            return f"[Internal API Error] {str(e)}"


def get_chatbot_llm() -> ChatbotLLM:
    return ChatbotLLM()


def get_embeddings() -> OpenAIEmbeddings:
    return OpenAIEmbeddings(
        model=EMBED_MODEL,
        api_key=SecretStr(str(API_KEY)),
        base_url=str(BASE_URL),
    )


# === Text cleaning === #
def clean_text(text: str) -> str:
    text = text.replace("\n", " ").strip()
    text = re.sub(r"[^가-힣a-zA-Z0-9 .,!?]", " ", text)
    return text


# === Save vector index === #
def save_doc(path: str, index_path: str):
    docs = []
    if path.endswith(".pdf"):
        try:
            with pdfplumber.open(path) as pdf:
                content = "\n".join(page.extract_text() or "" for page in pdf.pages)
                docs.append(Document(page_content=content, metadata={"source": path}))
        except Exception as e:
            print(f"PDF 처리 중 오류 발생: {e}")
            return
    else:
        loader = TextLoader(path, encoding="utf-8")
        docs = loader.load()

    for i, doc in enumerate(docs, 1):
        print(f"--- 문서 {i} ---\n{doc.page_content[:500]}\n")

    splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
    chunks = splitter.split_documents(docs)

    for chunk in chunks:
        chunk.page_content = clean_text(chunk.page_content)
        chunk.metadata["source"] = path

    embedding = get_embeddings()

    if os.path.exists(index_path):
        db = FAISS.load_local(
            index_path, embedding, allow_dangerous_deserialization=True
        )
        db.add_documents(chunks)
    else:
        db = FAISS.from_documents(chunks, embedding)
    db.save_local(index_path)
    print(f"저장 성공, {index_path}")


# === Run chatbot === #
def run_chatbot(
    memory: ConversationBufferMemory,
    user_input: str,
    index_path: str,
):
    embedding = get_embeddings()
    db = FAISS.load_local(index_path, embedding, allow_dangerous_deserialization=True)
    retriever = db.as_retriever()

    prompt = PromptTemplate(
        input_variables=["context", "chat_history", "question"],
        template="""
당신은 문서 기반 AI 요리 보조 강사입니다. 아래 제공된 참고 문서에서 관련 내용을 찾아 사용자 질문에 답변하세요.
만약 참고 문서에 없는 내용을 질문할 때, 요리와 관련 없는 내용이면 그대로 답변하고, 요리과 관련 있는 내용은 문서에 없어서 모르겠다고 답변하세요.

[참고 문서]
{context}

[대화 히스토리]
{chat_history}

[사용자 질문]
{question}

[AI의 답변]
(참고 문서에서 근거를 바탕으로 한 문단 이내로 간결하게 작성하세요.)
""",
    )

    qa = ConversationalRetrievalChain.from_llm(
        llm=get_chatbot_llm(),
        retriever=retriever,
        memory=memory,
        combine_docs_chain_kwargs={"prompt": prompt},
        return_source_documents=True,
        output_key="answer",
        verbose=False,
    )

    result = qa.invoke({"question": user_input})
    print("🤖 챗봇:", result["answer"])
    return result["answer"]
