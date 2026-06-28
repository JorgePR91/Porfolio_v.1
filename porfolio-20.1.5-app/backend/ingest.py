# Indexar (offline, una vez por cada vez que cambian tus documentos): trocear tus textos, convertirlos en vectores y guardarlos en una base de datos vectorial.
import os
from langchain_core.documents import Document 
from langchain_text_splitters import RecursiveCharacterTextSplitter 
from dotenv import load_dotenv
import vector_store

# Carga las variables desde el archivo .env
load_dotenv()

CARPETA_DOCS = "me/"
CHUNK_SIZE     = 400      # caracteres por fragmento (punto de decisión)
CHUNK_OVERLAP  = 100      # solapamiento entre fragmentos contiguos

# 2. Cargar documentos:
#      para cada fichero en me/ (recursivo):
#          leer su texto
#          crear un "documento" con: { texto, metadatos: {origen: nombre_fichero} }
#      (los metadatos sirven luego para saber DE DÓNDE salió cada fragmento)
def cargar_documentos(carpeta = CARPETA_DOCS):
    documentos = []
    for fichero in os.listdir(carpeta):
        ruta_completa = os.path.join(carpeta, fichero)
        if os.path.isfile(ruta_completa):
            _, extension = os.path.splitext(ruta_completa)
            if extension in ('.md','.txt'):
                with open(ruta_completa, 'r', encoding='utf-8') as archivo:
                    texto = archivo.read()
                    documentos.append(Document(
                        page_content=texto,
                        metadata={"origen": fichero}
                    ))
    return documentos


if __name__ == "__main__":
    documentos = cargar_documentos()
    splitter = RecursiveCharacterTextSplitter(chunk_size=CHUNK_SIZE, chunk_overlap=CHUNK_OVERLAP)
    chunks = splitter.split_documents(documentos)

    vector_store.index.reset()
    vector_store.subir(chunks)   

    print(f"Documentos = {len(documentos)} | Chunks subidos = {len(chunks)}")
