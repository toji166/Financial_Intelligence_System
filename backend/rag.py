import hashlib
import json
import os
import re

from database import SessionLocal
from models import Document


DOCUMENT_PATH = os.path.join(
    os.path.dirname(__file__),
    "data",
    "documents.json"
)

VECTOR_DIMENSIONS = int(os.getenv("PGVECTOR_DIMENSIONS", "1536"))


def load_documents():
    if not os.path.exists(DOCUMENT_PATH):
        return []

    with open(DOCUMENT_PATH, "r", encoding="utf-8") as file:
        return json.load(file)


def _generate_embedding(text: str, dimensions: int = VECTOR_DIMENSIONS):
    text = (text or "").lower()
    tokens = re.findall(r"[a-z0-9]+", text)

    if not tokens:
        return [0.0 for _ in range(dimensions)]

    vector = [0.0 for _ in range(dimensions)]

    for i in range(dimensions):
        token = tokens[i % len(tokens)]
        digest = hashlib.sha256(f"{token}:{i}".encode("utf-8")).hexdigest()
        numeric_value = int(digest[:8], 16)
        vector[i] = ((numeric_value % 10000) / 10000.0) * 2 - 1

    return vector


def sync_documents_to_db():
    db = SessionLocal()
    try:
        existing_docs = db.query(Document).count()
        if existing_docs > 0:
            return

        for doc in load_documents():
            db.add(
                Document(
                    external_id=doc["id"],
                    title=doc["title"],
                    symbol=doc["symbol"].upper(),
                    content=doc["content"],
                    embedding=_generate_embedding(doc["content"]),
                )
            )

        db.commit()
    finally:
        db.close()


def retrieve_documents(symbol: str, query: str = ""):
    symbol = symbol.upper()
    sync_documents_to_db()

    db = SessionLocal()
    try:
        if query:
            q_vector = _generate_embedding(query)
            matching = (
                db.query(Document)
                .filter(Document.symbol == symbol)
                .order_by(Document.embedding.cosine_distance(q_vector))
                .limit(3)
                .all()
            )
        else:
            matching = (
                db.query(Document)
                .filter(Document.symbol == symbol)
                .limit(3)
                .all()
            )

        if not matching:
            return {
                "status": "degraded",
                "documents": [],
                "message": "No financial document available for this symbol."
            }

        return {
            "status": "success",
            "documents": [
                {
                    "id": document.external_id,
                    "title": document.title,
                    "symbol": document.symbol,
                    "content": document.content,
                }
                for document in matching
            ],
        }
    finally:
        db.close()