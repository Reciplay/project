from langchain.chains import ConversationalRetrievalChain
from langchain_openai import OpenAIEmbeddings
from langchain.llms.base import LLM

from pydantic import SecretStr
from typing import Optional, List, Any
import requests
import re
from decouple import config

# === Configuration === #
API_KEY = "S13P12E104-9fba4818-53ba-4f8b-92ce-fcc15166bb33"
BASE_URL = "https://gms.ssafy.io/gmsapi/api.openai.com/v1"
TODO_GENERATOR_LLM_MODEL = "gpt-4.1"
TODO_GENERATOR_EMBED_MODEL = "text-embedding-3-large"


# === LLM Definition === #
class TodoGeneratorLLM(LLM):
    @property
    def _llm_type(self) -> str:
        return "TodoGeneratorLLM"

    def _call(
        self, prompt: str, stop: Optional[List[str]] = None, **kwargs: Any
    ) -> str:
        url = f"{BASE_URL}/chat/completions"
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {API_KEY}",
        }
        data = {
            "model": TODO_GENERATOR_LLM_MODEL,
            "messages": [
                {"role": "system", "content": "answer in korean"},
                {"role": "user", "content": prompt},
            ],
            "max_tokens": 20000,
            "temperature": 0.3,
            "response_format": {"type": "json_object"},
        }
        try:
            response = requests.post(url=url, headers=headers, json=data)
            response.raise_for_status()
            result = response.json()
            return result["choices"][0]["message"]["content"]
        except Exception as e:
            return f"[Internal API Error] {str(e)}"


def get_todo_generator_llm() -> TodoGeneratorLLM:
    return TodoGeneratorLLM()


def get_todo_generator_embeddings() -> OpenAIEmbeddings:
    return OpenAIEmbeddings(
        model=TODO_GENERATOR_EMBED_MODEL,
        api_key=SecretStr(str(API_KEY)),
        base_url=str(BASE_URL),
    )


# === Text cleaning === #
def clean_text(text: str) -> str:
    text = text.replace("\n", " ").strip()
    text = re.sub(r"[^가-힣a-zA-Z0-9 .,!?]", " ", text)
    return text


# === Generating Todos === #
def generate_todos(material_text: str, lecture_info: Optional[str] = None) -> str:
    """Generates a structured to-do list in JSON format based on the provided material and lecture info."""

    prompt_template = """\
You are an assistant that generates STRICT JSON to-do plans for cooking lectures.
- Output MUST be valid JSON that strictly follows the schema.
- Do not add any extra keys.
- Do not include markdown, code fences, or explanations.
- Korean language for all text values.
Schema:
[
    {
        "sequence": 1,
        "title": "string",
        "summary": "string",
        "chapters": [
            {
                "chapterName": "string",
                "sequence": 1,
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
    }
]
다음은 강의 교안(자료)와 강의 메타정보다. 이를 바탕으로 체계적인 TODO JSON을 생성하라.
- section은 (재료 준비/사전 준비/조리/플레이팅/정리/평가 등) 논리별로 적절히 나눌 것
- 각 todo는 가능한 5~20분 단위로 쪼갤 것
- 각 항목에 1부터 순서대로 sequence를 배치할 것
- 각 항목에 걸리는 시간을 추정하여 seconds로 환산하여 작성할 것
- seconds가 있을 경우 type은 TIMER여야 하고, type이 NORMAL일 경우는 seconds는 null로 작성할 것
- JSON만 출력

[강의 정보]
{lecture_info}

[강의 자료]
{material_text}
"""
    prompt = prompt_template.replace(
        "{lecture_info}", lecture_info or "제공되지 않음"
    ).replace("{material_text}", material_text)

    llm = get_todo_generator_llm()
    result = llm._call(prompt)

    print("🤖 LLM Response:", result)
    return result
