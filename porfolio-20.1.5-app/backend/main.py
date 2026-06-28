from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import json
from dotenv import load_dotenv
from rag import recuperar
from llm import responder
import tools                      # tools.tools (lista) + las funciones

from fastapi import Request, HTTPException
from upstash_ratelimit import Ratelimit, FixedWindow
from upstash_redis import Redis

load_dotenv()

app = FastAPI()

app.add_middleware(CORSMiddleware,
    allow_origins=["http://localhost:4200", "https://jorgepr91.github.io/Porfolio_v.1/"],   # RNF-4
    allow_methods=["POST"],
    allow_headers=["*"])

class ChatRequest(BaseModel):     # valida el cuerpo del POST
    message: str
    history: list = []

redis = Redis.from_env()        # lee UPSTASH_REDIS_REST_URL / _TOKEN
limitador = Ratelimit(
    redis = redis,
    limiter = FixedWindow(max_requests=10, window=60),   # 10 peticiones por minuto
)

NOMBRE = "Jorge Perigüell Rubio"

def construir_system_prompt(fragmentos):
    # fragmentos = lista de (texto, origen, score) que devuelve recuperar()

    persona = f"""Actúas como {NOMBRE}. Respondes en su sitio web preguntas
        sobre su trayectoria, formación, habilidades y experiencia.
        Tono profesional y cercano, como ante un posible cliente o empleador."""

    reglas = """
        - Responde ÚNICAMENTE con la información del CONTEXTO de abajo.
        - Si la respuesta NO está en el contexto, NO la inventes: usa la
          herramienta 'record_unknown_question' para registrar la pregunta.
        - Si el visitante muestra interés en contactar, pídele su email y
          regístralo con 'record_user_details'."""

    # ensamblar el contexto a partir de los fragmentos
    contexto = ""
    for (texto, origen, _) in fragmentos:
        contexto += f"### Fuente: {origen}\n{texto}\n\n"

    return persona + "\n" + reglas + "\n\n## CONTEXTO\n" + contexto

@app.post("/chat")
def chat(req: ChatRequest, request: Request):
    # 1) PRIMERO el rate limit
    ip = request.headers.get("x-forwarded-for", request.client.host).split(",")[0].strip()
    if not limitador.limit(ip).allowed:
        raise HTTPException(status_code=429, detail="Demasiadas peticiones, inténtalo más tarde.")

    # 2) LUEGO lo que ya tenías (recuperar, prompt, bucle de tools, return reply)
    fragmentos = recuperar(req.message, k=4)
    system = construir_system_prompt(fragmentos)
    messages = [{"role": "system", "content": system}] + req.history + \
               [{"role": "user", "content": req.message}]

    while True:
        respuesta = responder(messages, tools=tools.tools)
        msg = respuesta.choices[0].message

        if respuesta.choices[0].finish_reason == "tool_calls":
            messages.append(msg)                     # el modelo "pide" herramientas
            for tool_call in msg.tool_calls:
                nombre = tool_call.function.name
                args = json.loads(tool_call.function.arguments)
                funcion = getattr(tools, nombre)     # busca la función por nombre
                resultado = funcion(**args)
                messages.append({
                    "role": "tool",
                    "content": json.dumps(resultado),
                    "tool_call_id": tool_call.id,
                })
            # vuelve a iterar: ahora el modelo responde teniendo el resultado
        else:
            return {"reply": msg.content}            # respuesta final
        
