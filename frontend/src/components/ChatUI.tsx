// src/components/ChatUI.tsx
import React, { useEffect, useState, useCallback } from "react";
import { getUser, logoutUser } from "@/auth";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { FaVolumeUp, FaVolumeMute, FaCopy } from "react-icons/fa";
import { GoSidebarCollapse, GoSidebarExpand } from "react-icons/go";
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { v4 as uuidv4 } from 'uuid'; // npm install uuid && npm install @types/uuid

// --- Interfaces ---
interface Message {
  role: "user" | "assistant";
  content: string;
}

interface Session {
  id: string;
  name: string;
  messages: Message[];
}

// --- Constants ---
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

// --- Markdown Components ---
const MarkdownComponents = {
  p: ({ children }: any) => <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>,
  strong: ({ children }: any) => <strong className="font-bold text-blue-800">{children}</strong>,
  code: ({ node, inline, className, children, ...props }: any) => {
    const match = /language-(\w+)/.exec(className || '');
    return !inline && match ? (
      <SyntaxHighlighter style={tomorrow} language={match[1]} PreTag="div" className="rounded-md text-sm my-2" {...props}>
        {String(children).replace(/\n$/, '')}
      </SyntaxHighlighter>
    ) : (
      <code className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono text-red-600" {...props}>
        {children}
      </code>
    );
  },
  ul: ({ children }: any) => <ul className="list-disc list-inside mb-2 space-y-1 ml-2">{children}</ul>,
};

// --- Main Chat Component ---
const ChatUI = () => {
  const [user, setUser] = useState<any>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [newChatName, setNewChatName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState<{ [key: string]: boolean }>({});
  const [audioElements, setAudioElements] = useState<{[key: string]: HTMLAudioElement;}>({});
  const [assistantTyping, setAssistantTyping] = useState(false);
  const navigate = useNavigate();

  // Fetches all chats for the current user from the backend
  const fetchUserChats = useCallback(async (userId: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/chats/${userId}`);
      if (!res.ok) throw new Error("Failed to fetch chats");
      const userSessions: Session[] = await res.json();
      setSessions(userSessions);
      // Always set the main view to a new chat state upon login
      createNewSession();
    } catch (error) {
      console.error("Failed to fetch user chats:", error);
      toast.error("Could not load your chats.");
      createNewSession();
    }
  }, []);

  useEffect(() => {
    const initialize = async () => {
      try {
        const usr = await getUser();
        if (!usr) {
          navigate("/login");
          return;
        }
        setUser(usr);
        await fetchUserChats(usr.$id);
      } catch (error) {
        console.error("Initialization error:", error);
        navigate("/login");
      } finally {
        setIsLoading(false);
      }
    };
    initialize();
  }, [navigate, fetchUserChats]);

  // --- Session Management ---
  const createNewSession = () => {
    setCurrentSessionId(null);
  };

  const selectSession = (sessionId: string, currentSessions = sessions) => {
    setCurrentSessionId(sessionId);
  };

  const chatWindow = currentSessionId
    ? sessions.find(s => s.id === currentSessionId)?.messages ?? []
    : [];
  
  const currentChatName = currentSessionId
    ? sessions.find(s => s.id === currentSessionId)?.name ?? "New Chat"
    : "New Chat";

  // --- API Actions ---
  const sendMessage = async () => {
    if (!messageInput.trim() || !user) return;
    const optimisticSessionId = currentSessionId ?? uuidv4();
    const isNewChat = !currentSessionId;
    const userMessage: Message = { role: "user", content: messageInput.trim() };
    if (isNewChat) {
        const newSession: Session = { id: optimisticSessionId, name: 'New Chat', messages: [userMessage] };
        setSessions(prev => [newSession, ...prev]);
        setCurrentSessionId(optimisticSessionId);
    } else {
        setSessions(prev => prev.map(s => s.id === optimisticSessionId ? { ...s, messages: [...s.messages, userMessage] } : s));
    }
    setMessageInput("");
    setAssistantTyping(true);
    try {
      const res = await fetch(`${API_BASE_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: optimisticSessionId,
          message: userMessage.content,
          user_id: user.$id,
          is_new_chat: isNewChat,
        }),
      });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();
      const assistantMessage: Message = { role: "assistant", content: data.response };
      setSessions(prev => 
        prev.map(s => {
          if (s.id === optimisticSessionId) {
            return {
              ...s,
              name: data.newName || s.name,
              messages: [...s.messages, assistantMessage],
            };
          }
          return s;
        })
      );
    } catch (error: any) {
      toast.error(`Error: ${error.message}`);
      const errorMessage: Message = { role: "assistant", content: `Error: ${error.message}` };
      setSessions(prev => prev.map(s => s.id === optimisticSessionId ? { ...s, messages: [...s.messages, errorMessage] } : s));
    } finally {
      setAssistantTyping(false);
    }
  };
  
  const clearChatHistory = async () => {
    if (!currentSessionId) return;
    if (!confirm("Are you sure you want to clear this chat's history?")) return;
    try {
      await fetch(`${API_BASE_URL}/clear-history`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: currentSessionId }),
      });
      setSessions(prev => prev.map(s => s.id === currentSessionId ? { ...s, messages: [] } : s));
      toast.success("History cleared.");
    } catch (error: any) {
      toast.error(`Failed to clear history: ${error.message}`);
    }
  };

  const deleteChatSession = async () => {
    if (!currentSessionId) return;
    if (!confirm("Are you sure you want to delete this chat session?")) return;
    try {
      await fetch(`${API_BASE_URL}/delete-chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: currentSessionId }),
      });
      const updatedSessions = sessions.filter(s => s.id !== currentSessionId);
      setSessions(updatedSessions);
      if (updatedSessions.length > 0) {
        setCurrentSessionId(updatedSessions[0].id);
      } else {
        createNewSession();
      }
      toast.success("Chat deleted.");
    } catch (error: any) {
      toast.error(`Failed to delete chat: ${error.message}`);
    }
  };

  const saveChatName = async () => {
    if (!newChatName.trim() || !currentSessionId) return;
    try {
        await fetch(`${API_BASE_URL}/rename-chat`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ session_id: currentSessionId, name: newChatName.trim() }),
        });
        setSessions(prev => prev.map(s => s.id === currentSessionId ? { ...s, name: newChatName.trim() } : s));
        setShowRenameModal(false);
        toast.success("Chat renamed.");
    } catch (error: any) {
        toast.error(`Failed to rename chat: ${error.message}`);
    }
  };

  const openRenameModal = () => {
    if (!currentSessionId) return;
    setNewChatName(currentChatName);
    setShowRenameModal(true);
  };
  
  // --- Audio and UI Helpers ---
  const playTTS = async (text: string, messageId: string) => {
    try {
      if (isPlaying[messageId]) {
        // Stop playing if already playing
        if (audioElements[messageId]) {
          audioElements[messageId].pause();
          audioElements[messageId].currentTime = 0;
          delete audioElements[messageId];
        }
        setIsPlaying((prev) => ({ ...prev, [messageId]: false }));
        return;
      }

      // Clean up previous audio element
      if (audioElements[messageId]) {
        audioElements[messageId].pause();
        delete audioElements[messageId];
      }

      const response = await fetch(`${API_BASE_URL}/text-to-speech`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error(`TTS request failed: ${response.status}`);
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);

      // Set up audio event handlers
      audio.onerror = (e) => {
        console.error("Audio playback error:", e);
        setIsPlaying((prev) => ({ ...prev, [messageId]: false }));
        toast.error("Audio playback failed");
      };

      audio.onended = () => {
        setIsPlaying((prev) => ({ ...prev, [messageId]: false }));
        URL.revokeObjectURL(audioUrl); // Clean up the URL
        delete audioElements[messageId];
      };

      // Store the audio element and start playing
      setAudioElements((prev) => ({ ...prev, [messageId]: audio }));
      setIsPlaying((prev) => ({ ...prev, [messageId]: true }));

      try {
        await audio.play();
      } catch (playError) {
        console.error("Playback error:", playError);
        setIsPlaying((prev) => ({ ...prev, [messageId]: false }));
        toast.error("Failed to play audio");
      }
    } catch (error) {
      console.error("TTS error:", error);
      toast.error("Failed to generate audio");
      setIsPlaying((prev) => ({ ...prev, [messageId]: false }));
    }
  };

  const copyText = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Text copied to clipboard");
    } catch (error) {
      toast.error("Failed to copy text");
    }
  };

  // Typing animation for assistant
  const TypingIndicator = () => (
    <div className='flex space-x-2'>
      <div className='h-2 w-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]'></div>
      <div className='h-2 w-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]'></div>
      <div className='h-2 w-2 bg-blue-600 rounded-full animate-bounce'></div>
    </div>
  );

  if (isLoading) {
    return (
      <div className='flex flex-col items-center justify-center h-screen bg-gray-50'>
        <div className='mb-8'>
          <h1 className='text-2xl font-bold text-gray-800 text-center'>OdiaLingua</h1>
        </div>
        <div className='flex space-x-3'>
          <div className='h-4 w-4 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]'></div>
          <div className='h-4 w-4 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]'></div>
          <div className='h-4 w-4 bg-blue-600 rounded-full animate-bounce'></div>
        </div>
        <p className='mt-4 text-gray-600 text-sm'>Initializing chat...</p>
      </div>
    );
  }

  // --- JSX Render ---
  return (
    <div className='flex h-screen flex-col'>
      <header className='w-full flex items-center justify-between bg-white shadow px-4 py-3'>
        <div className='flex items-center space-x-6'>
            <Link to='/' className='flex items-center space-x-2'>
                <span className='text-xl font-bold text-primary-dark'>OdiaLingua</span>
            </Link>
            <div className='h-6 w-px bg-gray-300' />
            <div className='flex items-center space-x-4'>
                <h3 className='text-xl font-bold'>{currentChatName}</h3>
                {currentSessionId && <button onClick={openRenameModal} className='text-sm text-blue-600 hover:underline'>Rename</button>}
            </div>
        </div>
        <div className='flex items-center space-x-4'>
            <span className='text-sm text-gray-800'>Hi, {user?.name || user?.email || "User"}</span>
            <button
                onClick={async () => { await logoutUser(); navigate("/login"); }}
                className='px-3 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600'
            >
                Logout
            </button>
        </div>
      </header>

      <div className='flex flex-1 relative overflow-hidden'>
        {isSidebarCollapsed && (
          <button
            onClick={() => setIsSidebarCollapsed(false)}
            className='absolute left-2 top-4 z-10 p-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 shadow-lg'
          >
            <GoSidebarExpand size={20} />
          </button>
        )}

        <aside className={`${isSidebarCollapsed ? "w-0 -ml-72" : "w-72"} bg-gray-800 text-white p-4 transition-all duration-300 ease-in-out flex-shrink-0`}>
          <div className='mb-4 flex justify-between items-center'>
            <h2 className='text-xl font-bold'>Chats</h2>
            <button onClick={() => setIsSidebarCollapsed(true)} className='p-1 hover:bg-gray-700 rounded'>
                <GoSidebarCollapse size={20} />
            </button>
          </div>
          <div className='flex gap-2 mt-2'>
            <button onClick={createNewSession} className='bg-green-600 px-2 py-1 rounded flex-1 hover:bg-green-700'>
              + New Chat
            </button>
            <button onClick={clearChatHistory} className='bg-yellow-600 px-2 py-1 rounded flex-1 hover:bg-yellow-700 disabled:opacity-50' disabled={!currentSessionId}>
              Clear
            </button>
            <button onClick={deleteChatSession} className='bg-red-600 px-2 py-1 rounded flex-1 hover:bg-red-700 disabled:opacity-50' disabled={!currentSessionId}>
              Delete
            </button>
          </div>
          <ul className='overflow-y-auto max-h-[calc(100vh-10rem)] mt-4'>
            {sessions.map((session) => (
              <li
                key={session.id}
                className={`p-2 cursor-pointer hover:bg-gray-700 ${session.id === currentSessionId ? "bg-gray-600" : ""}`}
                onClick={() => selectSession(session.id)}
              >
                <span className='text-sm truncate'>{session.name}</span>
              </li>
            ))}
          </ul>
        </aside>

        <main className='flex-1 flex flex-col bg-gray-50 min-w-0 relative'>
            <div className='flex-1 overflow-y-auto'>
                <div className='container mx-auto max-w-5xl px-4 py-4 space-y-4'>
                    {chatWindow.length === 0 && !assistantTyping && (
                        <div className="text-center text-gray-500 pt-20">
                            <h2 className="text-2xl font-bold">OdiaLingua</h2>
                            <p>Welcome to OdiaLingua! Ask anything about Odia language, culture, or history. Type your question below to begin your journey.</p>
                        </div>
                    )}
                    {chatWindow.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                            <div className={`w-full max-w-[85%] md:max-w-[75%] lg:max-w-[60%] p-3 rounded-lg shadow ${msg.role === "assistant" ? "bg-blue-50 text-blue-900" : "bg-white text-gray-800"}`}>
                                <div className='font-semibold mb-1'>{msg.role === "assistant" ? "Assistant" : "You"}</div>
                                <div className='break-words prose prose-sm max-w-none prose-blue'>
                                    <ReactMarkdown components={MarkdownComponents}>{msg.content}</ReactMarkdown>
                                </div>
                                {msg.role === "assistant" && (
                                  <div className='flex items-center gap-2 mt-2'>
                                    <button
                                      onClick={() => playTTS(msg.content, `msg-${idx}`)}
                                      className='p-1 hover:bg-blue-100 rounded'
                                    >
                                      {isPlaying[`msg-${idx}`] ? (
                                        <FaVolumeMute size={16} />
                                      ) : (
                                        <FaVolumeUp size={16} />
                                      )}
                                    </button>
                                    <button
                                      onClick={() => copyText(msg.content)}
                                      className='p-1 hover:bg-blue-100 rounded'
                                    >
                                      <FaCopy size={16} />
                                    </button>
                                  </div>
                                )}
                            </div>
                        </div>
                    ))}
                    {/* Corrected rendering of the typing animation */}
                    {assistantTyping && (
                        <div className='flex justify-start'>
                            <div className='w-full max-w-[85%] md:max-w-[75%] lg:max-w-[60%] p-3 rounded-lg shadow bg-blue-50 text-blue-900'>
                                <div className='font-semibold mb-1'>Assistant</div>
                                <TypingIndicator />
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <div className='border-t bg-white'>
                <div className='container mx-auto max-w-5xl px-4 py-4'>
                    <div className='flex gap-2'>
                        <textarea
                          className='flex-1 border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none min-w-0'
                          placeholder='Type your message here...'
                          value={messageInput}
                          onChange={(e) => setMessageInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault();
                              sendMessage();
                            }
                          }}
                          rows={2}
                        />
                        <button
                          onClick={sendMessage}
                          className='px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed'
                          disabled={!messageInput.trim()}
                        >
                          Send
                        </button>
                    </div>
                </div>
            </div>
        </main>
      </div>
      {showRenameModal && (
        <div className='fixed inset-0 flex items-center justify-center bg-black/50 z-50'>
          <div className='bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4'>
            <div className='flex justify-between items-center mb-4'>
              <h2 className='text-xl font-bold'>Rename Chat</h2>
              <button
                onClick={() => setShowRenameModal(false)}
                className='text-gray-500 hover:text-gray-700 text-2xl'
              >
                &times;
              </button>
            </div>
            <input
              type='text'
              value={newChatName}
              onChange={(e) => setNewChatName(e.target.value)}
              className='w-full border rounded-lg p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500'
              placeholder='Enter new chat name'
            />
            <div className='flex justify-end gap-2'>
              <button
                onClick={() => setShowRenameModal(false)}
                className='px-4 py-2 text-gray-600 hover:text-gray-800'
              >
                Cancel
              </button>
              <button
                onClick={saveChatName}
                className='px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50'
                disabled={!newChatName.trim()}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatUI;