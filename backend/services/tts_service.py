import os
import base64
from sarvamai import SarvamAI

# --- Corrected Code ---

SARVAM_API_KEY = os.getenv("SARVAM_API_KEY")

# Check if the API key is available
if not SARVAM_API_KEY:
    print("WARNING: SARVAM_API_KEY is not set. TTS functionality will be disabled.")
    client = None
else:
    # The correct parameter name is 'api_subscription_key', not 'api_key'
    client = SarvamAI(api_subscription_key=SARVAM_API_KEY)

async def generate_odia_speech(text: str) -> bytes:
    """
    Generates Odia speech from text using Sarvam AI's Bulbul TTS model.
    Handles base64 decoding of the audio response.
    """
    if not client:
        raise ValueError("Sarvam AI client is not initialized. Please set the SARVAM_API_KEY.")

    try:
        # The API call now includes the required 'model' and correct language code 'or-IN'
        response = client.text_to_speech.convert(
            model="bulbul:v2",
            text=text,
            target_language_code="od-IN", # Corrected language code for Odia
            enable_preprocessing=True,
            speech_sample_rate=24000
        )
        
        # The response.audios is a list of base64 encoded strings.
        # We need to join them and then decode.
        if response.audios:
            combined_audio_b64 = "".join(response.audios)
            audio_content_bytes = base64.b64decode(combined_audio_b64)
            return audio_content_bytes
        else:
            raise ValueError("Sarvam API returned no audio data.")

    except Exception as e:
        print(f"Error generating Sarvam TTS: {str(e)}")
        raise