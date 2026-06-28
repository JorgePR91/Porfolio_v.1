import os
from openai import OpenAI
from dotenv import load_dotenv
load_dotenv()

MODELO = "gpt-4o-mini"          # punto único de cambio (mañana: Ollama)
MAX_TOKENS = 500                # tope por respuesta (RNF-3)

cliente = OpenAI()              # lee OPENAI_API_KEY del entorno

def responder(messages, tools=None):
    return cliente.chat.completions.create(
        model = MODELO,
        messages = messages,
        tools = tools,
        max_tokens = MAX_TOKENS,
    )
