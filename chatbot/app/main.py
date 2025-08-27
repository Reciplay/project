from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from langchain.memory import ConversationBufferMemory
from typing import Dict, List, Optional
from pydantic import BaseModel
import requests
import os
import pdfplumber
import io
import json
from fastapi.responses import PlainTextResponse
import traceback
import sys

from app.chatbot.chatbot import run_chatbot, save_doc
from app.todo_generator.todo_generator import generate_todos

# Define the absolute path for the FAISS index
FAISS_INDEX_PATH = os.path.join(os.path.dirname(__file__), "faiss_index")


app = FastAPI()


@app.exception_handler(Exception)
async def exception_handler(request, exc: Exception):
    tb = "".join(traceback.format_exception(type(exc), exc, exc.__traceback__))
    print(tb, file=sys.stderr)  # 서버 로그에 출력
    return PlainTextResponse(str(exc), status_code=500)


# CORS configuration to allow frontend connections
#주소 넣으면 됨
BASE_URL = "주소"
origins = [
    "http://localhost:3000",
    f"{BASE_URL}:8080",
    f"http://{BASE_URL.split('//')[1]}:8080",
    f"http://{BASE_URL.split('//')[1]}:8081",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory store for user conversation histories
user_memories: Dict[str, ConversationBufferMemory] = {}


class ConnectionManager:
    """Manages active WebSocket connections."""

    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = {}

    async def connect(self, websocket: WebSocket, user_id: str):
        await websocket.accept()
        self.active_connections[user_id] = websocket

    def disconnect(self, user_id: str):
        if user_id in self.active_connections:
            del self.active_connections[user_id]

    async def send_personal_message(self, message: str, user_id: str):
        if user_id in self.active_connections:
            await self.active_connections[user_id].send_text(message)


manager = ConnectionManager()


class Item(BaseModel):
    FileUrl: str


# === Pydantic Models for /generate-todos/ ===
class LectureInfo(BaseModel):
    title: str
    summary: str


class LectureItem(BaseModel):
    material: Optional[str] = None
    lecture: LectureInfo


class TodoResponseItem(BaseModel):
    title: str
    type: str
    seconds: Optional[int] = None
    sequence: int


class Chapter(BaseModel):
    chapterName: str
    sequence: int
    numOfTodos: int
    todos: List[TodoResponseItem]


class RecipeResponse(BaseModel):
    sequence: int
    title: str
    summary: str
    chapters: List[Chapter]


def fetch_material(url: str) -> str:
    """Fetches content from a URL and returns it as a string."""
    try:
        response = requests.get(url, timeout=30)
        response.raise_for_status()
    except requests.RequestException as e:
        raise HTTPException(status_code=400, detail=f"Failed to download file: {e}")

    content_type = response.headers.get("Content-Type", "")

    if "application/pdf" in content_type:
        try:
            with pdfplumber.open(io.BytesIO(response.content)) as pdf:
                return "\n".join(page.extract_text() or "" for page in pdf.pages)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to parse PDF: {e}")
    else:
        # Assume text-based content for other types
        return response.text


"""
새로 정의된 출력 요구 사항
[
    {
        "sequence" : 1,
        "title" : "string",
        "summary" : "string",
        "chapters" : [
            {
                "chapterName": "string",
                "sequence " : 1,
                "numOfTodos": 2,
                "todos": [
                    {
                    "title": "재료 손질하기",
                    "type": "NORMAL",
                    "seconds": null,
                    "sequence": 1
                    },
                    {
                    "title": "5분간 끓이기",
                    "type": "TIMER",
                    "seconds": 300,
                    "sequence": 2
                    }
                ]
            },
            {
                "chapterName": "string",
                "sequence " : 2,
                "numOfTodos": 2,
                "todos": [
                    {
                    "title": "재료 손질하기",
                    "type": "NORMAL",
                    "seconds": null,
                    "sequence": 1
                    },
                    {
                    "title": "5분간 끓이기",
                    "type": "TIMER",
                    "seconds": 300,
                    "sequence": 2
                    }
                ]
            }
        ]
    },

]
"""


@app.post("/generate-todos/", response_model=List[RecipeResponse])
async def generate_todos_endpoint(request_body: List[LectureItem]):
    if not request_body:
        raise HTTPException(status_code=400, detail="Request body cannot be empty.")

    # Assuming we process the first item in the list for now
    item = request_body[0]

    material_text = ""
    if item.material:
        material_text = fetch_material(item.material)

    lecture_info_str = f"Title: {item.lecture.title}\nSummary: {item.lecture.summary}"

    try:
        # Call the LLM to get the raw JSON string
        response_str = generate_todos(
            material_text=material_text, lecture_info=lecture_info_str
        )

        # Parse the JSON string
        response_json = json.loads(response_str)

        # The response_model expects a list. If the LLM returns a single dict, wrap it in a list.
        if isinstance(response_json, dict):
            return [response_json]

        return response_json

    except json.JSONDecodeError:
        raise HTTPException(
            status_code=500, detail="Failed to parse LLM response as JSON."
        )
    except Exception as e:
        print(f"An error occurred: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/chatbot/file/download")
def download_chatbot_file(item: Item):
    file_url = item.FileUrl
    file_name = file_url

    if len(file_url) > 1000:
        raise HTTPException(status_code=400, detail="URL too long")

    # if not file_url.startswith("https://reciplay-media.s3"):
    #     raise HTTPException(status_code=400, detail="Invalid file URL")

    try:
        response = requests.get(file_url)
        response.raise_for_status()
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"파일 다운로드 실패: {str(e)}")

    safe_dir = "downloads/chatbot"
    os.makedirs(safe_dir, exist_ok=True)

    file_name = os.path.basename(file_name)[:40]
    file_path = os.path.join(safe_dir, file_name)

    with open(file_path, "wb") as f:
        f.write(response.content)

    save_doc(file_path, index_path=FAISS_INDEX_PATH)
    return {"message": "다운로드 성공", "저장 경로": file_path}


@app.websocket("/chat/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: str):
    """
    Handles the WebSocket connection for a chat session.
    - Establishes a connection for a given user_id.
    - Retrieves or creates a conversation memory for the user.
    - Listens for incoming messages, processes them with the chatbot,
      and sends the response back to the client.
    - Handles disconnection gracefully.
    """
    await manager.connect(websocket, user_id)

    # Retrieve or create a conversation memory for the user
    memory = user_memories.setdefault(
        user_id,
        ConversationBufferMemory(
            memory_key="chat_history",
            input_key="question",
            output_key="answer",
            return_messages=True,
        ),
    )

    try:
        while True:
            # Wait for a message from the client
            data = await websocket.receive_text()

            # Get the chatbot's response using the existing function
            chatbot_response = run_chatbot(memory, data, index_path=FAISS_INDEX_PATH)

            # Send the response back to the client
            await manager.send_personal_message(chatbot_response, user_id)

    except WebSocketDisconnect:
        manager.disconnect(user_id)
        # Clean up user memory on disconnect
        if user_id in user_memories:
            del user_memories[user_id]
        print(f"Client #{user_id} disconnected.")
