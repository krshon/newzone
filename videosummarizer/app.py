from flask import Flask, request, jsonify, send_from_directory
from summarize_video import summarize_video
from werkzeug.utils import secure_filename
import os

app = Flask(__name__)

UPLOAD_FOLDER = "uploads"
VIDEO_FOLDER = "videos"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(VIDEO_FOLDER, exist_ok=True)


@app.route("/")
def home():
    return send_from_directory(".", "video_summarizer.html")


@app.route("/videos/<filename>")
def serve_video(filename):
    return send_from_directory(VIDEO_FOLDER, filename)


@app.route("/summarize", methods=["POST"])
def summarize():

    try:

        # Case 1: user uploads file
        if "video" in request.files:

            file = request.files["video"]

            if file.filename == "":
                return jsonify({"error": "Empty filename"})

            filename = secure_filename(file.filename)
            video_path = os.path.join(UPLOAD_FOLDER, filename)

            file.save(video_path)

        # Case 2: user selects existing sample video
        elif "existing_video" in request.form:

            video_path = request.form["existing_video"]

            if not os.path.exists(video_path):
                return jsonify({"error": "Sample video not found"})

        else:
            return jsonify({"error": "No video uploaded"})

        summary = summarize_video(video_path)
        print("SUMMARY RETURNED:", summary)

        return jsonify({
            "status": "success",
            "summary": summary
        })

    except Exception as e:

        return jsonify({
            "status": "error",
            "message": str(e)
        })


if __name__ == "__main__":
    app.run(debug=True, use_reloader=False)