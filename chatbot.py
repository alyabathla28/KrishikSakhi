# install required packages
!pip install flask flask-cors pyngrok google-generativeai pillow gTTS

# import necessary libraries
import os
import base64
from flask import Flask, request, jsonify
from flask_cors import CORS
from pyngrok import ngrok
import google.generativeai as genai
from PIL import Image
from gtts import gTTS

# api keys and configuration
GEMINI_API_KEY = "AIzaSyAuDRk4KHDPYDeWdTTpaoyn98BjaP2pXLI"   
NGROK_AUTHTOKEN = "32vbkQDmXb1dOLUPFcutYO5WCA6_7f8zJoHsBXnE5FrUGDu92" 

genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel("gemini-1.5-flash")

ngrok.set_auth_token(NGROK_AUTHTOKEN)

# flask app setup
app = Flask(__name__)
CORS(app)

# Function: Convert text to audio (base64) with cleaned formatting
def text_to_speech_base64(text, lang="en"):
    # Replace asterisks or unwanted symbols for clear audio
    clean_text = text.replace("*", "-").replace("\n", ". ")
    tts = gTTS(text=clean_text, lang=lang)
    filename = "reply.mp3"
    tts.save(filename)
    with open(filename, "rb") as f:
        audio_b64 = base64.b64encode(f.read()).decode("utf-8")
    return audio_b64

@app.route("/chat", methods=["POST"])
def chat():
    bot_reply = ""
    audio_reply = None

    # Case 1: Image upload
    if "image" in request.files:
        img_file = request.files["image"]
        img_bytes = img_file.read()
        img_b64 = base64.b64encode(img_bytes).decode("utf-8")

        try:
            response = model.generate_content(
                [
                    {"text": "Analyze this image and reply briefly in 3-5 short bullet points."},
                    {
                        "inline_data": {
                            "mime_type": "image/jpeg",
                            "data": img_b64
                        }
                    }
                ]
            )
            bot_reply = response.text
        except Exception as e:
            bot_reply = f"⚠️ Error analyzing image: {str(e)}"

    # Case 2: Text message
    elif request.is_json:
        user_message = request.json.get("message", "")
        try:
            response = model.generate_content(
                f"Reply to this briefly in 3-5 short bullet points. Avoid long paragraphs. Use dashes '-' instead of asterisks:\n{user_message}"
            )
            bot_reply = response.text
        except Exception as e:
            bot_reply = f"⚠️ Error: {str(e)}"

    # Convert reply to audio
    if bot_reply.strip():
        audio_reply = text_to_speech_base64(bot_reply)

    return jsonify({
        "reply": bot_reply,
        "audio": audio_reply   # base64 MP3
    })

# ================== RUN SERVER ==================
# Kill previous ngrok session (if any)
!kill $(ps aux | grep ngrok | awk '{print $2}')

# Start new ngrok tunnel
public_url = ngrok.connect(5000)
print("✅ Copy this URL into your frontend:", public_url)

app.run(port=5000)
