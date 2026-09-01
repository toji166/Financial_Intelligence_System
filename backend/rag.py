import json
import os


DOCUMENT_PATH = "data/documents.json"


def load_documents():

    if not os.path.exists(DOCUMENT_PATH):
        return []

    with open(DOCUMENT_PATH, "r", encoding="utf-8") as file:
        return json.load(file)


def retrieve_documents(symbol: str, query: str = ""):

    documents = load_documents()

    symbol = symbol.upper()

    matching = [
        doc for doc in documents
        if doc["symbol"].upper() == symbol
    ]

    if not matching:
        return {
            "status": "degraded",
            "documents": [],
            "message": "No financial document available for this symbol."
        }

    return {
        "status": "success",
        "documents": matching[:3]
    }