<div align="center">

# OdiaLingua: AI-Powered Odia Language Assistant 🌟

![Logo](https://github.com/user-attachments/assets/d3a4c075-ad80-4564-b4eb-1aec11ad479f)

### ମୋ ଭାଷା, ମୋ ଗର୍ବ 
### (My Language, My Pride)

*Bridging Language Barriers with AI Technology*

[Demo](#demo) • [Features](#features) • [Installation](#installation) • [Contributing](#contributing)

</div>

## 📖 Backstory

Born from a simple experiment with Claude (Anthropic's LLM), OdiaLingua emerged from a vision to make complex information accessible to Odia speakers. Inspired by the groundbreaking work of the [OdiaGenAI.org](https://OdiaGenAI.org) community, who are pioneering Odia language model fine-tuning, I focused on developing the application layer to bridge the gap between advanced AI technology and everyday Odia users.

What started as a Streamlit prototype has evolved into a full-stack application, aiming to break down language barriers and make information accessible to all Odia speakers, regardless of their technical expertise.

## 🎥 Demo

<div align="center">

[![Demo Video](demo-thumbnail.png)](https://youtu.be/your-demo-link)

*Click to watch the demo video*

</div>

## 📸 Screenshots

<div align="center">

![Chat Interface](screenshots/chat-interface.png)
*Main Chat Interface with TTS Support*

![User Dashboard](screenshots/dashboard.png)
*User Dashboard and History*

</div>

## 🎯 Project Overview

OdiaLingua is not just a language learning platform – it's a comprehensive solution for making information accessible to Odia speakers. The platform enables users to:
- Ask complex questions and receive simple explanations in Odia
- Access real-time information through integrated search capabilities
- Utilize text-to-speech for better accessibility
- Engage in natural conversations with AI in Odia

## 🛠️ Technology Stack

### Core Infrastructure
- **LLM Provider**: Groq (hosting Llama-3.3-70b)
  - Leverages Linear Processing Unit (LPU) technology for unprecedented inference speed
  - Currently the fastest LLM inference platform available
- **TTS Engine**: facebook/mms-tts-ory (hosted on Hugging Face)
  - Specialized model for high-quality Odia speech synthesis
- **Search Integration**: 
  - DuckDuckGo API for real-time information
  - SerpAPI for enhanced search capabilities

### Frontend Stack
- **Core**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + Framer Motion
- **State Management**: React Context + Zustand
- **Authentication**: Appwrite

### Backend Stack
- **API**: FastAPI
- **ML Operations**: PyTorch
- **Caching**: Redis
- **Database**: PostgreSQL

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

## 🔮 Upcoming Features

1. **Local LLM Support**
   - Integration with Ollama for local LLM deployment
   - Support for Odia fine-tuned models
   
2. **Enhanced Accessibility**
   - Speech-to-Text (STT) implementation
   - Improved UI
   - Offline mode support

3. **UI Enhancements**
   - Advanced chat features
   - Multi-modal support
   - Better conversation management

## ⚠️ Hosting Status

Currently, OdiaLingua runs locally due to hosting constraints. The TTS model requires significant GPU resources, making free-tier cloud hosting impractical. As our favorite dev joke goes: "GPU poor, but spirits rich! 😅"

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Code Contributions**
   - Fork the repository
   - Create a feature branch
   - Submit a pull request

2. **Language Support**
   - Help improve Odia translations
   - Contribute to language model training

3. **Documentation**
   - Improve README
   - Add code comments
   - Create tutorials

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

<div align="center">

---

Made with ❤️ for the Odia community

</div>
