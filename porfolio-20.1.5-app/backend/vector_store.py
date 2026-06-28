from dotenv import load_dotenv
from upstash_vector import Index
from upstash_vector.types import Data

# Carga las variables desde el archivo .env
load_dotenv()

# Lee las variables de entorno
index = Index.from_env()               

# ---------- SUBIR (ingest) ----------
def subir(chunks):
    items = []
    for i, chunk in enumerate(chunks):
        id_chunk = f"{chunk.metadata['origen']}#{i}"
        items.append( Data(
            id = id_chunk,
            data = chunk.page_content,
            metadata = { 'origen': chunk.metadata['origen'] }
        ))
    index.upsert(items)

# ---------- BUSCAR (retrieval) ----------
def buscar(pregunta, k=4):
    resultados = index.query(
        data = pregunta,
        top_k = k,
        include_metadata = True,
        include_data = True
    )
    return [ (r.data, r.metadata['origen'], r.score) for r in resultados]

if __name__ == "__main__": 
    print(index.info())