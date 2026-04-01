from moviepy import VideoFileClip
import whisper
from transformers import pipeline


def summarize_video(video_path):

    print("Step 1: Extracting audio...")
    video = VideoFileClip(video_path)
    audio_path = "temp_audio.wav"
    video.audio.write_audiofile(audio_path)

    print("Step 2: Loading Whisper model...")
    whisper_model = whisper.load_model("tiny")

    print("Step 3: Transcribing speech...")
    transcript = whisper_model.transcribe(audio_path)["text"]

    print("Step 4: Generating summary...")

    summarizer = pipeline(
        "summarization",
        model="facebook/bart-large-cnn",
        framework="pt"
    )

    transcript = transcript[:3000]

    summary = summarizer(
        transcript,
        max_length=120,
        min_length=40,
        do_sample=False
    )

    return summary[0]["summary_text"]


if __name__ == "__main__":
    video_file = "videoplayback.mp4"
    summary = summarize_video(video_file)
    print("\nSUMMARY:\n")
    print(summary)