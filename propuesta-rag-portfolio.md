# Propuesta: Chatbot RAG como complemento del portfolio Angular

> **Formato:** Spec-Driven Development (SDD) → primero **qué** y **por qué** (Spec),
> luego **cómo** (Diseño), y por último **el plan de tareas** ordenado.
> **Importante:** las tareas están escritas para que las ejecute **una persona**
> (tú), aprendiendo y decidiendo en cada paso. No es un guion para que la IA
> genere todo de golpe. Cada tarea lleva su *Definición de Hecho (DoD)* para que
> sepas cuándo darla por cerrada.

---

## 1. Visión

Pasar de la app actual (Gradio que mete todo el CV en el prompt) a un **chatbot
RAG** que:

- Vive como **widget integrado en tu portfolio Angular** (tu diseño, no un iframe).
- Responde **solo con tu información**, recuperando los fragmentos relevantes.
- **Crece sin reentrenar ni programar**: añades documentos y reindexas.
- Cuesta **céntimos** y mantiene el **control de tokens**.

Frase resumen: *de "una app Gradio que mete todo tu CV en el prompt" a "un backend
FastAPI con RAG que Angular consume como widget de chat, alimentado por documentos
que añades tú mismo".*

---

## 2. Especificación (qué queremos)

### 2.1 Requisitos funcionales

| ID | Requisito |
|----|-----------|
| RF-1 | El visitante chatea desde el portfolio Angular con el estilo del sitio. |
| RF-2 | Las respuestas se basan en *mi* documentación (RAG), no en conocimiento general. |
| RF-3 | Si el bot no sabe algo, lo registra (pregunta desconocida) y me avisa. |
| RF-4 | Si el visitante muestra interés, el bot pide y registra su email. |
| RF-5 | Puedo ampliar la base de conocimiento añadiendo ficheros y reindexando, sin tocar el código de la app. |

### 2.2 Requisitos no funcionales

| ID | Requisito |
|----|-----------|
| RNF-1 | Coste objetivo < 5 €/mes, con tope duro de gasto configurado. |
| RNF-2 | La parte RAG (vector DB + embeddings) usa servicios gestionados **serverless con tier gratuito** (Upstash Vector), de coste ~0. *(Revisado: ver decisión 2026-06-22; antes era "local y gratuita".)* |
| RNF-3 | Cada respuesta tiene un límite de tokens (`max_tokens`). |
| RNF-4 | El endpoint está protegido contra abuso (rate limit / CORS restringido a mi dominio). |
| RNF-5 | Desplegable en **Vercel** (función Python serverless), con dev = prod (mismo código en local y en la nube). |

### 2.3 Criterios de aceptación (cuándo está "terminado")

- [ ] Desde el portfolio Angular puedo preguntar y recibir respuesta.
- [ ] Una pregunta sobre algo que NO está en mis documentos se registra como "desconocida".
- [ ] Añado un `.md` nuevo, reindexo, y el bot ya responde a esa nueva info.
- [ ] El panel de OpenAI muestra un tope de gasto mensual configurado.
- [ ] El backend rechaza peticiones de orígenes que no son mi dominio.

---

## 3. Diseño (cómo)

> **Decisión (2026-06-22) — Camino A "Vercel-native":** el backend se despliega como
> **función Python serverless en Vercel** (donde ya vive el portfolio). Eso obliga a
> abandonar embeddings locales (`torch`/`sentence-transformers`) y Chroma-en-disco,
> porque **no caben** en el límite de 500 MB de una función Vercel y no hay disco
> persistente. En su lugar: **vector DB gestionada (Upstash Vector)** con
> **embeddings integrados** (le mandas texto, ella lo embebe; opción "A1"). Efecto
> colateral: desaparece el problema de Smart App Control y no hace falta WSL para
> desarrollar. *(Alternativa "A2": Upstash + embeddings de OpenAI, si algún día
> quieres controlar el modelo de embeddings.)*

### 3.1 Arquitectura

```
┌─────────────────────────┐         HTTP/JSON          ┌───────────────────────────────┐
│   FRONTEND (Angular)    │  ───────────────────────▶  │   BACKEND (Python en Vercel)  │
│  • Portfolio actual     │   POST /chat               │  • Función serverless /chat   │
│  • Componente chat      │   { message, history }     │  • RAG: consulta Upstash      │
│    (tu diseño)          │  ◀─────────────────────── │  • Llama al LLM (OpenAI)       │
└─────────────────────────┘   { reply }                │  • Tools: email / desconocida │
                                                       └───────────┬───────────────────┘
                                                                     │ HTTPS
                                                          ┌──────────▼──────────────┐
                                                          │  Upstash Vector (cloud) │
                                                          │  embeddings + búsqueda  │
                                                          └─────────────────────────┘
```

### 3.2 Decisiones técnicas

| Pieza | Elección | Por qué |
|-------|----------|---------|
| Frontend | Componente de chat en **Angular** | Integrado en tu portfolio, tu diseño |
| Backend | **Función Python serverless en Vercel** | Donde ya vive el portfolio; sin servidor que mantener |
| Vector DB | **Upstash Vector** (gestionada, serverless) | Free tier, ligera (cabe en Vercel), sin disco persistente propio |
| Embeddings | **Integrados en Upstash** — índice *Dense* con `openai/text-embedding-3-small` (multilingüe) | No requiere `torch`; le mandas texto y Upstash lo embebe (BGE-M3 no estaba disponible en consola) |
| LLM | **OpenAI gpt-4o-mini** | Calidad alta, céntimos, con topes de tokens |
| Despliegue | **Vercel Hobby** (gratis, uso no comercial) | 0 € de infra; dev = prod |

> **Punto desacoplado:** la llamada al LLM se aísla en una función. Cambiar de
> OpenAI a Ollama local sería tocar `base_url` + nombre de modelo, sin rehacer el RAG.
> Lo mismo con los embeddings: aislar el "embeber" permite pasar de A1 (Upstash) a
> A2 (OpenAI) tocando un solo sitio.

### 3.3 Estructura de carpetas objetivo

```
backend/                      ← la app Python (se despliega en Vercel)
├── me/                       ← documentos fuente del RAG (md, txt, pdf). Vacía hasta Fase 1; se llena con tu corpus.
├── ingest.py                 ← trocea me/ y SUBE los chunks a Upstash Vector (script local, manual)
├── rag.py                    ← consulta Upstash y recupera los top-k fragmentos
├── llm.py                    ← llamada al LLM aislada (OpenAI hoy, Ollama mañana)
├── tools.py                  ← record_user_details / record_unknown_question + push
├── vector_store.py           ← cliente Upstash aislado (upsert / query). Punto único de cambio A1↔A2
├── requirements.txt          ← SIN torch/chroma: openai, upstash-vector, langchain-text-splitters…
└── .env                      ← claves: OPENAI_API_KEY, UPSTASH_VECTOR_REST_URL, UPSTASH_VECTOR_REST_TOKEN, PUSHOVER_* (a .gitignore)

# La función /chat para Vercel vivirá en api/ (convención de Vercel) — se concreta en Fase 4.
# Ya NO hay vectorstore/ local: los vectores viven en Upstash (cloud).
```

---

## 4. Plan de implementación (tareas para humano)

> Orden recomendado: vertical y por fases. Termina y **valida** cada fase antes de
> pasar a la siguiente. Cada tarea indica su *Definición de Hecho (DoD)*.

### Fase 0 — Preparación del entorno

> **Decisión (2026-06-19):** se **abandona la versión Gradio** como fallback
> arrancable. `app.py` queda **solo de referencia** para portar su lógica en la
> Fase 2. En consecuencia, `me/` puede quedar **vacía hasta la Fase 1** (no hacen
> falta `linkedin.pdf`/`summary.txt`) y `requirements.txt` **no** incluye las
> dependencias de Gradio.

- [x] **T0.1 Crear la carpeta `backend/`** y mover ahí `me/`, `app.py` (solo de referencia, no se mantiene arrancable) y `requirements.txt`.
  - *DoD:* la estructura de 3.3 existe. (Sin exigir que arranque la versión vieja.)
- [x] **T0.2 Añadir dependencias** a `requirements.txt` e instalarlas en un venv.
  - *DoD:* `pip install -r requirements.txt` termina sin errores (en un venv creado en `backend/`).
  - ⚠️ *Revisado (Camino A, 2026-06-22):* el set pesado original (`langchain-chroma`, `chromadb`, `langchain-huggingface`, `sentence-transformers`…) **se sustituye** por uno ligero: `openai`, `upstash-vector`, `langchain-text-splitters`, `python-dotenv`, `requests`. (Sin `torch`: por eso ya no aplica Smart App Control.) Se rehará al empezar la Fase 1.
- [X] **T0.3 Configurar `.gitignore`** para `vectorstore/` y `.env`.
  - *DoD:* `git status` no lista esas rutas. *(Ojo: la regla de `.env` debe cubrir `backend/.env`, no solo la raíz.)*
- *Aprendizaje:* repasa qué es un *entorno virtual* y por qué la BD y las claves no se versionan.

### Fase 1 — RAG (el cerebro de datos)

> **Camino A (Upstash):** ya no hay índice local en disco. `ingest.py` **sube** los
> fragmentos a Upstash Vector y `rag.py` los **consulta** por HTTPS. Crea primero un
> índice gratuito en Upstash y guarda sus credenciales en `.env`.

- [X] **T1.0 Revisar `requirements.txt` + alta en Upstash:** dejar el set ligero (sin `torch`/Chroma) y crear un índice en Upstash Vector (con embeddings integrados). Guardar `UPSTASH_VECTOR_REST_URL` y `UPSTASH_VECTOR_REST_TOKEN` en `.env`.
  - *DoD:* `pip install` sin errores y un script mínimo se conecta a Upstash sin fallo de credenciales.
- [x] **T1.1 Preparar el corpus y escribir `ingest.py`:** primero **coloca en `me/` tus documentos fuente** (`.md`/`.txt`/`.pdf`) —tras la Fase 0 está vacía—; luego `ingest.py` lee los docs, los trocea en *chunks* solapados y **los sube (upsert) a Upstash** (con metadatos: origen del fragmento). Con A1, mandas el texto y Upstash lo embebe.
  - *DoD:* `me/` contiene al menos un documento real **y**, tras ejecutar `ingest.py`, el panel de Upstash muestra los vectores subidos.
- [x] **T1.2 Escribir `rag.py`:** función que recibe una pregunta y devuelve los *top-k* (3–4) fragmentos más relevantes **consultando Upstash**.
  - *DoD:* un script de prueba imprime fragmentos coherentes (con su origen) para una pregunta sobre tu información.
- [x] **T1.3 Probar la calidad de recuperación** con 5–6 preguntas reales y ajustar tamaño de chunk y *k* si hace falta.
  - *DoD:* las preguntas devuelven el fragmento correcto.
- *Aprendizaje:* conceptos de *chunking*, *embeddings*, *similitud por coseno* y *top-k*. Es el núcleo del RAG.
- *Punto de decisión:* tamaño de chunk y *k* (afecta calidad, velocidad y coste de tokens).

### Fase 2 — Backend FastAPI (el cerebro de lógica)

- [x] **T2.1 Portar `tools.py`:** mover `record_user_details`, `record_unknown_question` y `push` (Pushover) tal cual.
  - *DoD:* las funciones siguen funcionando y mandan push.
- [x] **T2.2 Escribir `llm.py`:** aislar la llamada al modelo (cliente OpenAI, `model`, `max_tokens`). Una sola función `responder(messages, tools)`.
  - *DoD:* cambiar de modelo se hace en un único sitio.
- [x] **T2.3 Refactor del `system_prompt`:** prompt fino = personaje + hueco para "contexto recuperado" + instrucción explícita *"responde solo con el contexto; si no está, usa la tool de pregunta desconocida"*.
  - *DoD:* el prompt ya NO incluye el CV entero, solo los fragmentos del RAG.
- [x] **T2.4 Escribir la app (FastAPI):** endpoint `POST /chat` que recibe `{message, history}`, recupera contexto de **Upstash** (Fase 1), llama al LLM con el bucle de tool-calling y devuelve `{reply}`. Configurar **CORS** restringido a tu dominio. *(FastAPI corre en local con `uvicorn` y se despliega tal cual como función serverless en Vercel — ver Fase 4.)*
  - *DoD:* `uvicorn` arranca en local y puedes chatear con `curl`/Postman.
- [x] **T2.5 Añadir rate limiting** por IP. *(En serverless lo natural es usar Upstash Ratelimit, que ya tienes a mano.)*
  - *DoD:* superar el límite devuelve 429.
- *Aprendizaje:* qué es un endpoint REST, CORS y por qué importa, y cómo sobrevive el bucle de tool-calling al cambio de Gradio → API.

### Fase 3 — Frontend Angular (la cara)

- [x] **T3.1 Crear un `ChatService`** en Angular que haga `POST /chat` (con `HttpClient`) y la URL del backend en `environment.ts`.
  - *DoD:* el service devuelve la respuesta del backend.
- [x] **T3.2 Crear el componente de chat** (burbuja flotante o sección) con tu diseño, gestionando el historial en el estado del componente.
  - *DoD:* puedes conversar desde el portfolio en local.
- [x] **T3.3 Estados de UX:** "escribiendo…", manejo de errores, deshabilitar input mientras espera.
  - *DoD:* la UI no se rompe si el backend tarda o falla.
- *Aprendizaje:* `HttpClient`, observables/`async`, y manejo de estado en un componente Angular.

### Fase 4 — Despliegue en Vercel y coste

- [ ] **T4.1 Desplegar la función en Vercel:** adaptar la app FastAPI a la convención de Vercel (carpeta `api/`), declarar las **variables de entorno** en el panel de Vercel (`OPENAI_API_KEY`, `UPSTASH_VECTOR_REST_URL`, `UPSTASH_VECTOR_REST_TOKEN`, `PUSHOVER_*`) y desplegar. Apuntar el `environment.prod.ts` de Angular a la URL del endpoint.
  - *DoD:* el portfolio publicado habla con `/chat` en Vercel, **con tu PC apagado**.
- [ ] **T4.2 Configurar control de coste:** tope de gasto mensual en el panel de OpenAI + verificar `max_tokens` y `k` bajos. Comprobar que sigues en **free tier** de Vercel y Upstash.
  - *DoD:* existe un límite duro de gasto; una respuesta no supera el tope de tokens.
- [ ] **T4.3 Verificar límites del Hobby:** función serverless < 500 MB, uso **no comercial** (un portfolio personal encaja), y revisar timeouts/cold-start del endpoint.
  - *DoD:* el `/chat` responde dentro del límite de tiempo de la función.
- *Aprendizaje:* qué es una función serverless, por qué no tiene disco persistente ni proceso siempre vivo, y cómo se inyectan secretos por variables de entorno en la nube.

### Fase 5 — Bucle de mejora (lo que hace que "crezca")

- [ ] **T5.1 Revisar las preguntas desconocidas** que te llegan por Pushover.
- [ ] **T5.2 Redactar la respuesta** y guardarla como un `.md` nuevo en `me/`.
- [ ] **T5.3 Reejecutar `ingest.py`** (sube los nuevos chunks a Upstash) y comprobar que el bot ya responde.
  - *DoD:* una pregunta antes "desconocida" ahora se contesta, sin tocar código.
- *Este es el flujo permanente:* el chatbot mejora con el uso, no con desarrollo.

---

## 5. Control de tokens y coste (resumen)

| Capa | Medida |
|------|--------|
| Modelo | `gpt-4o-mini` (barato) |
| Por respuesta | `max_tokens` con tope |
| Por consulta | RAG mete solo *k* fragmentos, no el CV entero |
| Embeddings | Integrados en Upstash (A1): incluidos en su free tier |
| Infra | Vercel Hobby + Upstash free tier = **0 € de infraestructura** |
| Por mes | Tope de gasto duro en panel de OpenAI |
| Anti-abuso | Rate limit (Upstash Ratelimit) + CORS al dominio del portfolio |

---

## 6. Glosario rápido

- **RAG (Retrieval-Augmented Generation):** recuperar fragmentos relevantes y pasárselos al modelo como contexto, en vez de meter todo o reentrenar.
- **Embedding:** representación numérica (vector) de un texto que permite buscar por significado.
- **Chunk:** fragmento en que se trocea un documento antes de indexarlo.
- **Vector DB (Upstash Vector):** base de datos gestionada en la nube que guarda embeddings y busca los más parecidos a una consulta vía HTTPS. Con embeddings integrados, además convierte el texto en vector por ti.
- **Serverless (Vercel):** modelo de ejecución sin servidor propio: la función se levanta al recibir una petición y se apaga; no tiene disco persistente ni proceso siempre vivo.
- **top-k:** los *k* fragmentos más relevantes que se recuperan.
- **CORS:** mecanismo del navegador que decide qué dominios pueden llamar a tu API.
- **Tool calling:** el modelo decide invocar funciones tuyas (registrar email / pregunta desconocida).

---

## 7. Qué NO cambia de lo que ya tienes

- Las dos herramientas (`record_user_details`, `record_unknown_question`) y el push de Pushover.
- El bucle de tool-calling.
- La idea del *system prompt* como personaje "tú".

Lo que cambia es el **envoltorio** (Gradio → FastAPI), **de dónde sale el contexto**
(CV entero → fragmentos RAG) y **la cara** (Gradio → componente Angular).
