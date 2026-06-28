from dotenv import load_dotenv
from upstash_vector import Index
import vector_store
import sys

# Carga las variables desde el archivo .env
load_dotenv()

# Lee las variables de entorno
index = Index.from_env()

def recuperar(pregunta, k=4):
    return vector_store.buscar(pregunta, k)

if __name__=="__main__":
    pregunta = sys.argv[1]
    for (texto, origen, score) in recuperar(pregunta, k=4):
        print(f"[{score:.3f}] ({origen}) {texto[:120]}")