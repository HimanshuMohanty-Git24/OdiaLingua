<div align="center">

# OdiaLingua: AI-Powered Odia Language Assistant 🌟

![Logo](https://github.com/user-attachments/assets/d3a4c075-ad80-4564-b4eb-1aec11ad479f)

### ମୋ ଭାଷା, ମୋ ଗର୍ବ 
### (My Language, My Pride)

*Bridging Language Barriers with an Advanced Agentic AI System*

**[🚀 Live Demo: odialingua.netlify.app](https://odialingua.netlify.app/)**

[Features](#features) • [Agentic Architecture](#-agentic-architecture) • [Technology Stack](#️-technology-stack) • [Installation](#-getting-started)

</div>

## 📖 Backstory

Born from a simple experiment with LLMs, OdiaLingua emerged from a vision to make complex information accessible to Odia speakers. Inspired by the groundbreaking work of the [OdiaGenAI.org](https://OdiaGenAI.org) community, who are pioneering Odia language model fine-tuning, I focused on developing the application layer to bridge the gap between advanced AI technology and everyday Odia users.

What started as a prototype has now evolved into a full-stack, deployed application powered by a sophisticated **agentic system**. This architecture allows for intelligent task delegation, ensuring that user queries are handled by specialized AI agents for maximum accuracy and efficiency. This project aims to break down language barriers and make information accessible to all Odia speakers, regardless of their technical expertise.

## 🎥 Demo

<div align="center">

*A video demonstrating the chat interface, real-time search, and TTS functionality.*



https://github.com/user-attachments/assets/3484bf29-b11c-4b5c-911f-bfdf8166b6a1



</div>

## 📸 Screenshots

<div align="center">

![Index](https://github.com/user-attachments/assets/5dfa2ccf-ae74-4c0a-88a0-ab74689c1558)
*Home page of OdiaLingua*

![Login](https://github.com/user-attachments/assets/8050b559-8a85-4e24-b1a7-7846bf64356a)
*Login page of OdiaLingua*

![ChatPage1](https://github.com/user-attachments/assets/1ef7bd5a-86be-40c9-8429-c284b10723d8)
*Main Chat Interface with TTS Support*
</div>

## ✨ Features

OdiaLingua is a comprehensive solution for making information accessible to Odia speakers. The platform enables users to:
-   **Ask complex questions** and receive simple, accurate explanations in Odia.
-   Access **real-time information** through an intelligent, multi-tool search system.
-   Utilize high-quality **text-to-speech** for better accessibility.
-   Engage in **natural, conversational chat**.
-   **Persistent chat history** tied to your user account.
-   **Automatic, intelligent chat titling** for easy conversation management.

## 🧠 Agentic Architecture

The backend has been completely refactored from a monolithic script into a scalable and modular **multi-agent system** using **LangGraph**. This is a significant upgrade that makes the application smarter and more maintainable.

### Why an Agentic System?
Instead of a single LLM trying to handle every task, our system uses a **Query Router** (a supervisor agent) to delegate tasks to specialized agents. This is more efficient and reliable. For example, a question about the weather is routed directly to a `Weather Agent` with a weather tool, while a factual question goes to a `Research Agent`.

### Our Team of AI Agents:
1.  **Query Router (Supervisor):** The entry point. It analyzes user queries and decides which specialist agent should handle the task.
2.  **Research Agent:** The fact-finder. It uses multiple search tools (like Google AI Overview) to gather and verify real-time information, ensuring answers about current events are accurate.
3.  **Weather Agent:** The meteorologist. It uses the OpenWeatherMap API to provide up-to-date weather forecasts.
4.  **Response Synthesizer:** The final communicator. It takes the data from other agents and crafts a coherent, natural-sounding response, with a strict rule to **always reply in Odia**.
5.  **Title Agent:** A utility agent that automatically generates a short, descriptive title in Odia for each new conversation based on the initial query.

This modular design is highly scalable. New capabilities (like a code-writing agent) can be added simply by creating a new agent and tool, without disrupting the existing logic.

## 🛠️ Technology Stack

### Core Infrastructure
-   **LLM Provider**: **Groq** (hosting models like Llama 3 and GPT-OSS).
    -   Leverages Linear Processing Unit (LPU) technology for unparalleled inference speed.
-   **Agentic Framework**: **LangGraph**
    -   Orchestrates the flow of tasks between different AI agents and tools.
-   **TTS Engine**: **Sarvam AI (Bulbul-v2)**
    -   A high-quality, cloud-based API for natural-sounding Odia speech synthesis. This replaced the previous self-hosted model, which was too GPU-intensive for deployment.
-   **Search Integration**:
    -   **SerpApi**: Provides access to Google AI Overview and standard search results for the Research Agent.
    -   **OpenWeatherMap API**: Powers the Weather Agent.

### Frontend Stack
-   **Core**: React 18 + TypeScript + Vite
-   **Styling**: Tailwind CSS
-   **Routing & UI**: React Router, Radix UI, Framer Motion
-   **Authentication & User Management**: Appwrite

### Backend Stack
-   **API**: FastAPI
-   **Database**: Appwrite Databases (for persistent, user-specific chat history)
-   **Deployment**: Render

## 🚀 Getting Started

### Prerequisites
-   Node.js 18+
-   Python 3.10+
-   An Appwrite instance (Cloud or self-hosted)
-   API keys for Groq, SerpApi, OpenWeatherMap, and Sarvam AI.

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
### Backend Setup
```Bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app:app --reload --port 5000
```
### Environment Variables
Create .env files in both frontend and backend directories.
Frontend (frontend/.env):
```Env
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your_project_id
VITE_APPWRITE_REDIRECT_SUCCESS=http://localhost:5173/chat
VITE_APPWRITE_REDIRECT_FAILURE=http://localhost:5173/login
VITE_BACKEND_URL=http://localhost:5000
```
Backend (backend/.env):
```Env
GROQ_API_KEY="your_groq_api_key"
GROQ_MODEL="llama3-70b-8192"
SERPAPI_API_KEY="your_serpapi_key"
OPENWEATHERMAP_API_KEY="your_openweathermap_key"
SARVAM_API_KEY="your_sarvam_api_key"
SARVAM_TTS_LANG_CODE="od-IN"
APPWRITE_ENDPOINT="https://cloud.appwrite.io/v1"
APPWRITE_PROJECT_ID="your_project_id"
APPWRITE_API_KEY="your_appwrite_server_key"
APPWRITE_DATABASE_ID="your_database_id"
APPWRITE_COLLECTION_ID="your_collection_id"
CORS_ORIGINS="http://localhost:5173,http://localhost:5000"
```
### ✅ Hosting Status
OdiaLingua is now live!

- Frontend: Deployed on Netlify.

- Backend: Deployed on Render.

The initial challenge of hosting a GPU-intensive TTS model was solved by migrating to the Sarvam AI API. This change made the backend lightweight and deployable on standard cloud infrastructure, allowing the project to be publicly accessible.

### 🤝 Contributing

We welcome contributions! Here's how you can help:

Code Contributions: Fork the repository, create a feature branch, and submit a pull request.

Language Support: Help improve Odia translations and suggest new features.

Documentation: Improve the README, add code comments, or create tutorials.

### 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

### 👨‍💻 Author

Himanshu Mohanty

GitHub: @HimanshuMohanty-Git24

Portfolio: https://hima.codes/

LinkedIn: himanshumohanty

### 🙏 Acknowledgments

Groq for providing the high-speed LLM capabilities.

Sarvam AI for the excellent Odia TTS API.

SerpApi and OpenWeatherMap for providing real-time data tools.

Appwrite for simplifying authentication and database management.

The Odia language community for inspiration and support.

<div align="center">


Made with ❤️ for the Odia community

</div>

