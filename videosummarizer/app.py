from flask import Flask, request, jsonify, send_from_directory
from summarize_video import summarize_video
import os

app = Flask(__name__)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


@app.route("/")
def home():
    return send_from_directory(".", "video_summarizer.html")
@app.route("/videos/<filename>")
def serve_video(filename):
    return send_from_directory("videos", filename)

@app.route("/summarize", methods=["POST"])
def summarize():

    # Case 1: user uploads a file
    if "video" in request.files:

        file = request.files["video"]
        video_path = os.path.join(UPLOAD_FOLDER, file.filename)
        file.save(video_path)

    # Case 2: user clicks sample video button
    elif "existing_video" in request.form:

        video_path = request.form["existing_video"]

    else:
        return jsonify({"error": "No video uploaded"})

    summary = summarize_video(video_path)

    return jsonify({"summary": summary})


if __name__ == "__main__":
    app.run(debug=True)