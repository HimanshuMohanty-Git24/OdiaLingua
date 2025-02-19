import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Index from './pages/Index'
import Login from './pages/Login'
import NotFound from './pages/NotFound'
import ChatUI from './components/ChatUI'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/chat" element={<ChatUI />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
