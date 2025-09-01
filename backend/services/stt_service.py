import os
import requests
import tempfile
import logging
import time
import gc
from fastapi import HTTPException

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

SARVAM_API_KEY = os.getenv("SARVAM_API_KEY")
SARVAM_STT_ENDPOINT = "https://api.sarvam.ai/speech-to-text"

async def transcribe_audio(audio_file, language_code="unknown") -> dict:
    """
    Transcribe audio using Sarvam AI's Saarika v2.5 model.
    Uses automatic language detection by default for Odia/English/Hindi speakers.
    """
    if not SARVAM_API_KEY:
        logger.error("Sarvam API key not configured")
        raise HTTPException(status_code=500, detail="Sarvam API key not configured")

    temp_file_path = None
    
    try:
        logger.debug(f"Starting transcription with language_code: {language_code}")
        
        # Create temporary file with better handling
        with tempfile.NamedTemporaryFile(delete=False, suffix='.wav') as temp_file:
            audio_content = audio_file.read()
            temp_file.write(audio_content)
            temp_file.flush()
            temp_file_path = temp_file.name
            
        logger.debug(f"Created temporary file: {temp_file_path}")
        
        # Prepare the request headers
        headers = {
            "api-subscription-key": SARVAM_API_KEY
        }
        
        # Create form data
        with open(temp_file_path, 'rb') as f:
            files = {
                'file': ('audio.wav', f, 'audio/wav')
            }

            data = {
                'model': 'saarika:v2.5',
                'language_code': language_code
            }
            
            logger.debug(f"Request headers: {headers}")
            logger.debug(f"Request data: {data}")
            logger.debug(f"API endpoint: {SARVAM_STT_ENDPOINT}")

            # Make the API request
            response = requests.post(
                SARVAM_STT_ENDPOINT,
                headers=headers,
                files=files,
                data=data,
                timeout=60
            )
        
        logger.debug(f"Response status code: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            logger.debug(f"Successful response: {result}")
            return {
                "success": True,
                "transcript": result.get("transcript", ""),
                "detected_language": result.get("language_code", "unknown"),
                "request_id": result.get("request_id", "")
            }
        else:
            logger.error(f"Sarvam API error - Status: {response.status_code}")
            logger.error(f"Response text: {response.text}")
            
            try:
                error_detail = response.json()
                logger.error(f"Error details: {error_detail}")
            except:
                logger.error("Could not parse error response as JSON")
            
            raise HTTPException(
                status_code=response.status_code,
                detail=f"Sarvam API error: Status {response.status_code}, Response: {response.text}"
            )

    except requests.exceptions.Timeout:
        logger.error("Request timeout occurred")
        raise HTTPException(status_code=408, detail="Speech recognition timeout")
    except requests.exceptions.RequestException as e:
        logger.error(f"Network error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Network error: {str(e)}")
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"STT error: {str(e)}")
    finally:
        # Enhanced cleanup for Windows
        if temp_file_path and os.path.exists(temp_file_path):
            try:
                # Force garbage collection to release file handles
                gc.collect()
                time.sleep(0.1)  # Brief pause
                os.unlink(temp_file_path)
                logger.debug(f"Successfully cleaned up temporary file: {temp_file_path}")
            except Exception as cleanup_error:
                logger.warning(f"Failed to cleanup temp file: {cleanup_error}")
                # Try again after a longer pause
                try:
                    time.sleep(0.5)
                    os.unlink(temp_file_path)
                    logger.debug(f"Successfully cleaned up temporary file on retry: {temp_file_path}")
                except Exception as final_cleanup_error:
                    logger.warning(f"Final cleanup attempt failed: {final_cleanup_error}")

def is_supported_audio_format(filename: str) -> bool:
    """Check if the audio format is supported"""
    # Updated supported formats based on latest Sarvam AI docs
    supported_formats = ['.wav', '.mp3', '.m4a', '.ogg', '.webm', '.aac', '.aiff', '.flac', '.mp4', '.amr']
    return any(filename.lower().endswith(fmt) for fmt in supported_formats)
