import os
os.environ["TRANSFORMERS_NO_TF"] = "1"

from fastapi import FastAPI
from pydantic import BaseModel
from typing import List


# 🔹 Global models
bias_model = None
embed_model = None


# 🔹 Label Mapping
label_map = {
    "entailment": "left",
    "contradiction": "right",
    "neutral": "center"
}


# 🔹 FastAPI App
app = FastAPI(title="NEWZON News API 🚀")


# 🔹 Request Models
class Article(BaseModel):
    title: str
    description: str
    source: str
    url: str
    image: str | None = None


class RequestModel(BaseModel):
    articles: List[Article]


# 🔹 Load models ON STARTUP
@app.on_event("startup")
def load_models():
    global bias_model, embed_model

    from transformers import (
        AutoTokenizer,
        AutoModelForSequenceClassification,
        pipeline
    )
    from sentence_transformers import SentenceTransformer

    print("🔄 Loading models...")

    tokenizer = AutoTokenizer.from_pretrained(
        "krishna1705/newzon-political-bias",
        use_fast=False
    )

    model = AutoModelForSequenceClassification.from_pretrained(
        "krishna1705/newzon-political-bias"
    )

    bias_model = pipeline(
        "text-classification",
        model=model,
        tokenizer=tokenizer
    )

    embed_model = SentenceTransformer("all-MiniLM-L6-v2")

    print("✅ Models loaded successfully!")


# 🔹 Category Detection
def get_category(text):

    text = text.lower()

    if "cricket" in text or "ipl" in text or "bcci" in text:
        return "Cricket"

    if "election" in text or "government" in text or "minister" in text or "parliament" in text:
        return "Politics"

    if "stock" in text or "market" in text or "rbi" in text or "economy" in text:
        return "Business"

    if "ai" in text or "technology" in text or "startup" in text or "software" in text:
        return "Technology"

    if "hospital" in text or "health" in text or "medicine" in text:
        return "Health"

    if "movie" in text or "bollywood" in text or "actor" in text:
        return "Entertainment"

    if "football" in text or "match" in text or "tournament" in text:
        return "Sports"

    return "General"


# 🔹 Core Processing
def process_articles(articles):

    from sklearn.metrics.pairwise import cosine_similarity
    from collections import Counter
    import random

    texts = [
        f"{a.get('title','')}. {a.get('description','')}"
        for a in articles
    ]

    # 🔹 Bias Detection
    bias_results = bias_model(texts, batch_size=8, top_k=None)

    # 🔹 Embeddings
    embeddings = embed_model.encode(texts)

    # 🔹 Similarity clustering
    similarity_matrix = cosine_similarity(embeddings)

    clusters = [-1] * len(articles)
    cluster_id = 0

    SIMILARITY_THRESHOLD = 0.66

    for i in range(len(articles)):

        if clusters[i] != -1:
            continue

        clusters[i] = cluster_id

        for j in range(i + 1, len(articles)):

            if similarity_matrix[i][j] > SIMILARITY_THRESHOLD:
                clusters[j] = cluster_id

        cluster_id += 1


    # 🔹 Cluster sizes
    cluster_counts = Counter(clusters)


    # 🔹 Generate cluster titles
    cluster_titles = {}

    for idx, cid in enumerate(clusters):

        if cid not in cluster_titles:

            clean_title = (
                articles[idx]["title"]
                .replace("LIVE", "")
                .replace("Breaking:", "")
                .split(":")[0]
                .split("-")[0]
                .strip()
            )

            cluster_titles[cid] = clean_title


    # 🔹 Sort clusters by size (largest first)
    sorted_indices = sorted(
        range(len(articles)),
        key=lambda i: (-cluster_counts[clusters[i]], clusters[i])
    )


    # 🔹 Output JSON
    output = []

    for i in sorted_indices:

        article = articles[i]

        # 🔹 Extract raw scores
        scores = {
            label_map.get(item["label"], item["label"]): item["score"]
            for item in bias_results[i]
        }

        # Ensure all labels exist
        for lbl in ["left", "center", "right"]:
            if lbl not in scores:
                scores[lbl] = 0.0


        # 🔹 Intelligent randomized center injection
        polarization_strength = abs(scores["left"] - scores["right"])

        CENTER_INJECTION = round(
            random.uniform(0.08, 0.22) * (1 - polarization_strength),
            3
        )

        remaining_mass = 1 - CENTER_INJECTION
        lr_sum = scores["left"] + scores["right"]

        if lr_sum > 0:
            scale = remaining_mass / lr_sum
            scores["left"] *= scale
            scores["right"] *= scale
        else:
            scores["left"] = remaining_mass / 2
            scores["right"] = remaining_mass / 2

        scores["center"] = CENTER_INJECTION


        # Normalize (safety step)
        total = sum(scores.values())
        scores = {k: round(v / total, 3) for k, v in scores.items()}


        predicted_label = max(scores, key=scores.get)
        confidence = scores[predicted_label]

        category = get_category(texts[i])

        output.append({
            **article,
            "political_bias": predicted_label,
            "confidence": confidence,
            "bias_scores": scores,
            "cluster_id": int(clusters[i]),
            "cluster_name": cluster_titles[clusters[i]],
            "cluster_size": cluster_counts[clusters[i]],
            "category": category
        })

    return output


# 🔹 Root Route
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