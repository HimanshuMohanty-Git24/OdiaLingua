# OdiaLingua: AI-Powered Odia Language Chatbot LLM 🌟
![Logo](https://github.com/user-attachments/assets/d3a4c075-ad80-4564-b4eb-1aec11ad479f)

### ମୋ ଭାଷା, ମୋ ଗର୍ବ (My Language, My Pride)

Bridging Tradition with Technology—Speak, Learn, and Explore Odia with AI

## 🎯 Project Overview

OdiaLingua is an innovative AI-powered platform designed to preserve and promote the Odia language through modern technology. It combines advanced language models, real-time information retrieval, and text-to-speech capabilities to create an interactive and engaging learning experience.

### Why OdiaLingua?

- 🌍 Bridge the gap between traditional language learning and modern technology
- 🗣️ Provide accessible Odia language learning tools for global learners
- 🤖 Leverage AI to create natural, contextual conversations
- 🔊 Offer authentic Odia pronunciation through advanced text-to-speech
- 📚 Preserve and promote Odia linguistic heritage

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **React Router** for navigation
- **Appwrite** for authentication
- **React Icons & Lucide** for UI elements
- **React Toastify** for notifications

### Backend
- **FastAPI** for high-performance API
- **Groq** for LLM integration
- **Hugging Face Transformers** for TTS
- **DuckDuckGo Search** for real-time information
- **SerpAPI** for enhanced search capabilities
- **PyTorch** for ML operations
- **VITS Model** for Odia text-to-speech

## ✨ Features

1. **AI-Powered Conversations**
   - Natural language processing with Groq LLM
   - Context-aware responses in Odia
   - Real-time information integration

2. **Text-to-Speech**
   - Native Odia pronunciation
   - High-quality speech synthesis
   - Voice playback controls

3. **User Experience**
   - Modern, responsive interface
   - Session management
   - Chat history and organization
   - Copy and share functionality

4. **Authentication**
   - Secure Google Sign-in
   - Session persistence
   - User profile management

## 🚀 Getting Started

### Prerequisites
- Node.js 16+
- Python 3.8+
- Appwrite instance
- Groq API key
- SerpAPI key

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

### Environment Variables
Create `.env` files in both frontend and backend directories:

Frontend `.env`:
```env
VITE_APPWRITE_PROJECT_ID=your_project_id
VITE_APPWRITE_ENDPOINT=your_endpoint
VITE_BACKEND_URL=http://localhost:5000
```

Backend `.env`:
```env
GROQ_API_KEY=your_groq_api_key
SERPAPI_KEY=your_serpapi_key
GROQ_MODEL=llama-3.3-70b-specdec
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Himanshu Mohanty**
- GitHub: [@HimanshuMohanty-Git24](https://github.com/HimanshuMohanty-Git24)
- Portfolio: [himanshumohanty.netlify.app](https://himanshumohanty.netlify.app)
- LinkedIn: [himanshumohanty](https://www.linkedin.com/in/himanshumohanty)

## 🙏 Acknowledgments

- Groq for providing the LLM capabilities
- Hugging Face for the VITS model
- SerpAPI for search integration
- The Odia language community for inspiration and support

---

Made with ❤️ for the Odia language community
