import os
os.environ["TRANSFORMERS_NO_TF"] = "1"

from fastapi import FastAPI
from pydantic import BaseModel
from typing import List

# 🔹 Global models
bias_model = None
embed_model = None
category_model = None

# 🔹 Label Mapping
label_map = {
    "entailment": "left",
    "contradiction": "right",
    "neutral": "center"
}

# 🔹 Categories (you can expand later)
CATEGORIES = [
    "Politics",
    "Sports",
    "Cricket",
    "Technology",
    "Business",
    "Health",
    "Entertainment"
]

# 🔹 FastAPI App
app = FastAPI(title="NEWZON News API 🚀")

# 🔹 Request Models
class Article(BaseModel):
    title: str
    description: str
    source: str
    url: str

class RequestModel(BaseModel):
    articles: List[Article]

# 🔹 Load models ON STARTUP
@app.on_event("startup")
def load_models():
    global bias_model, embed_model, category_model

    from transformers import pipeline
    from sentence_transformers import SentenceTransformer

    print("🔄 Loading models...")

    bias_model = pipeline(
        "text-classification",
        model="krishna1705/newzon-political-bias",
        tokenizer="krishna1705/newzon-political-bias"
    )

    # 🔥 Category model (zero-shot classification)
    category_model = pipeline(
        "zero-shot-classification",
        model="facebook/bart-large-mnli"
    )

    embed_model = SentenceTransformer("all-MiniLM-L6-v2")

    print("✅ All models loaded!")

# 🔹 Category Function
def get_category(text):
    result = category_model(text, CATEGORIES)
    return result["labels"][0]

# 🔹 Core Processing
def process_articles(articles):

    texts = [
        f"{a.get('title','')}. {a.get('description','')}"
        for a in articles
    ]

    # 🔹 Bias
    bias_results = bias_model(texts, batch_size=8)

    # 🔹 Embeddings
    embeddings = embed_model.encode(texts)

    # 🔹 Clustering
    from sklearn.cluster import KMeans
    n_clusters = min(5, len(articles)) if len(articles) > 1 else 1
    kmeans = KMeans(n_clusters=n_clusters, random_state=42)
    clusters = kmeans.fit_predict(embeddings)

    # 🔹 Output
    output = []
    for i, article in enumerate(articles):

        raw_label = bias_results[i]["label"]
        mapped_label = label_map.get(raw_label, raw_label)

        category = get_category(texts[i])  # 🔥 NEW

        output.append({
            **article,
            "political_bias": mapped_label,
            "confidence": round(bias_results[i]["score"], 3),
            "cluster_id": int(clusters[i]),
            "category": category
        })

    return output

# 🔹 Root
@app.get("/")
def home():
    return {"message": "NEWZON API is running 🚀"}

# 🔹 API Route
@app.post("/analyze-news")
def analyze_news(request: RequestModel):
    result = process_articles([a.dict() for a in request.articles])
    return {
        "status": "success",
        "total_articles": len(result),
        "articles": result
    }
