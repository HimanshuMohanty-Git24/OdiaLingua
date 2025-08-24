import os
import requests
from langchain_core.tools import tool

OPENWEATHERMAP_API_KEY = os.getenv("OPENWEATHERMAP_API_KEY")

@tool
def get_current_weather(location: str) -> str:
    """
    Get the current weather information for a specified location.
    """
    if not OPENWEATHERMAP_API_KEY:
        return "Weather API key is not configured."

    try:
        url = f"http://api.openweathermap.org/data/2.5/weather?q={location}&appid={OPENWEATHERMAP_API_KEY}&units=metric"
        response = requests.get(url)
        response.raise_for_status()
        data = response.json()

        weather_description = data['weather'][0]['description']
        temperature = data['main']['temp']
        feels_like = data['main']['feels_like']
        humidity = data['main']['humidity']

        return (
            f"Current weather in {location}:\n"
            f"- Conditions: {weather_description}\n"
            f"- Temperature: {temperature}°C\n"
            f"- Feels Like: {feels_like}°C\n"
            f"- Humidity: {humidity}%"
        )
    except requests.exceptions.HTTPError as http_err:
        if response.status_code == 404:
            return f"Could not find weather data for '{location}'. Please check the location name."
        return f"HTTP error occurred while fetching weather: {http_err}"
    except Exception as e:
        return f"An error occurred while fetching weather data: {str(e)}"