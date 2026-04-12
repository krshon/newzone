import whisper
import ffmpeg
import cv2
import pytesseract
from transformers import pipeline

# Set Tesseract path (Windows)
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"


print("Loading Whisper model...")
whisper_model = whisper.load_model("base")

print("Loading summarizer model...")
summarizer = pipeline(
    "text2text-generation",
    model="google/flan-t5-base"
)

print("Models loaded successfully")


def extract_frame_text(video_path):

    cap = cv2.VideoCapture(video_path)
    extracted_text = []

    fps = int(cap.get(cv2.CAP_PROP_FPS))

    # safer fallback if fps fails
    if fps == 0:
        fps = 25

    frame_interval = fps * 10   # slower OCR = faster runtime overall

    frame_count = 0

    while cap.isOpened():

        ret, frame = cap.read()

        if not ret:
            break

        if frame_count % frame_interval == 0:

            text = pytesseract.image_to_string(frame)

            if text.strip():
                extracted_text.append(text.strip())

        frame_count += 1

    cap.release()

    return " ".join(extracted_text)


def summarize_video(video_path):

    try:

        print("STEP 1: Extracting audio...")

        audio_path = "temp_audio.wav"

        (
            ffmpeg
            .input(video_path)
            .output(audio_path)
            .run(overwrite_output=True, quiet=True)
        )

        print("STEP 2: Transcribing audio...")

        result = whisper_model.transcribe(
            audio_path,
            temperature=0,
            beam_size=5,
            best_of=5,
            condition_on_previous_text=False
        )

        transcript = result["text"]

        print("Transcript length:", len(transcript))


        print("STEP 3: Extracting frame text...")

        frame_text = extract_frame_text(video_path)

        print("Frame text length:", len(frame_text))


        # safer merge
        combined_text = transcript.strip()

        if frame_text.strip():
            combined_text += " " + frame_text.strip()


        # token-safe trimming (important fix)
        combined_text = " ".join(combined_text.split()[:400])

        print("Combined length:", len(combined_text))


        # prevent empty summaries
        if len(combined_text.split()) < 20:
            return "Video too short to summarize."


        print("STEP 4: Generating summary...")

        prompt = f"""
You are a professional news analyst.

Write a short news-style summary explaining what happens in this video.
Explain the key message clearly in 2–3 sentences.

Video content:
{combined_text}
"""

        summary = summarizer(
            prompt,
            max_length=120,
            do_sample=False
        )

        return summary[0]["generated_text"]

    except Exception as e:

        print("ERROR OCCURRED:", e)

        return str(e)