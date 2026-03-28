from sentence_transformers import SentenceTransformer
from sklearn.feature_extraction.text import TfidfVectorizer
import hdbscan
import json
import sys

model = SentenceTransformer("all-mpnet-base-v2")


def cluster(headlines):
    if len(headlines) < 3:
        return list(range(len(headlines))), {}

    embeddings = model.encode(headlines)

    clusterer = hdbscan.HDBSCAN(
    min_cluster_size=2,
    min_samples=1,
    cluster_selection_epsilon=0.3
)
    labels = clusterer.fit_predict(embeddings)

    topic_info = {}

    for i, headline in enumerate(headlines):
        topic = int(labels[i])
        topic_info.setdefault(topic, []).append(headline)

    return labels.tolist(), topic_info


if __name__ == "__main__":
    headlines = json.loads(sys.stdin.read())

    topics, info = cluster(headlines)

    print(json.dumps({
        "topics": topics,
        "topic_info": info
    }))