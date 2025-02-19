// src/components/ChatUI.tsx
import React, { useEffect, useState, useCallback, useRef } from "react";
import { getUser, logoutUser } from "@/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaVolumeUp, FaVolumeMute, FaCopy } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import { GoSidebarCollapse, GoSidebarExpand } from "react-icons/go";
import { Link } from "react-router-dom";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface Session {
  id: string;
  name: string;
  messages: Message[];
}

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

const ChatUI = () => {
  const [user, setUser] = useState<any>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [chatWindow, setChatWindow] = useState<Message[]>([]);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [newChatName, setNewChatName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState<{ [key: string]: boolean }>({});
  const [audioElements, setAudioElements] = useState<{
    [key: string]: HTMLAudioElement;
  }>({});
  const [assistantTyping, setAssistantTyping] = useState(false);
  const navigate = useNavigate();

  const saveSessions = (updatedSessions: Session[]) => {
    localStorage.setItem("sessions", JSON.stringify(updatedSessions));
  };

  const createNewSession = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/create-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error("Failed to create session");
      const data = await res.json();
      if (data.status === "success" && data.session_id) {
        const newSession: Session = {
          id: data.session_id,
          name: `Chat ${sessions.length + 1}`,
          messages: [],
        };
        const updatedSessions = [newSession, ...sessions];
        setSessions(updatedSessions);
        setCurrentSessionId(newSession.id);
        setChatWindow([]);
        saveSessions(updatedSessions);
        window.history.pushState({}, "", `?session_id=${newSession.id}`);
        return newSession.id;
      }
      throw new Error("Invalid session response");
    } catch (error) {
      console.error("Failed to create session:", error);
      toast.error("Failed to create new chat session");
      return null;
    }
  };

  const verifySession = async (sessionId: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/stream-chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId, messages: [] }),
      });
      return res.status !== 404;
    } catch {
      return false;
    }
  };

  const initializeSessions = useCallback(async () => {
    const saved = localStorage.getItem("sessions");
    if (saved) {
      const parsed: Session[] = JSON.parse(saved);
      if (parsed.length > 0) {
        const isValid = await verifySession(parsed[0].id);
        if (!isValid) {
          localStorage.removeItem("sessions");
          const newSessionId = await createNewSession();
          if (newSessionId) setCurrentSessionId(newSessionId);
        } else {
          setSessions(parsed);
          setCurrentSessionId(parsed[0].id);
          setChatWindow(parsed[0].messages);
        }
      }
    } else {
      await createNewSession();
    }
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const usr = await getUser();
        if (!usr) {
          console.log("No user session found, redirecting to login");
          setTimeout(() => navigate("/login"), 1000);
          return;
        }
        console.log("User session found:", usr);
        setUser(usr);
        await initializeSessions();
      } catch (error) {
        console.error("Error fetching user:", error);
        navigate("/login");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [navigate, initializeSessions]);
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

  const sendMessage = async () => {
    if (!messageInput.trim() || !currentSessionId) {
      toast.error("Please enter a message");
      return;
    }
    const userMessage: Message = { role: "user", content: messageInput.trim() };

    // Add user message to chat window immediately
    setChatWindow((prev) => [...prev, userMessage]);
    setMessageInput("");
    setAssistantTyping(true);

    try {
      const res = await fetch(`${API_BASE_URL}/stream-chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          session_id: currentSessionId,
          messages: [userMessage],
        }),
      });

      if (!res.ok) {
        if (res.status === 404) {
          toast.error("Chat session expired. Creating new session...");
          await createNewSession();
          return;
        }
        throw new Error(`Server error: ${res.status}`);
      }

      const data = await res.json();
      if (data.status === "success") {
        const assistantMessage: Message = {
          role: "assistant",
          content: data.response || "No response from server.",
        };
        // Add assistant message to chat window while preserving user message
        setChatWindow((prev) => [...prev, assistantMessage]);
        // Update session storage
        const updatedSessions = sessions.map((session) => {
          if (session.id === currentSessionId) {
            return {
              ...session,
              messages: [...session.messages, userMessage, assistantMessage],
            };
          }
          return session;
        });
        setSessions(updatedSessions);
        saveSessions(updatedSessions);
      } else {
        throw new Error(data.message || "Unknown error");
      }
    } catch (error: any) {
      console.error("Chat error:", error);
      toast.error(`Error: ${error.message}`);
      setChatWindow((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Error: ${error.message}`,
        },
      ]);
    } finally {
      setAssistantTyping(false);
    }
  };

  const updateCurrentSession = (msg: Message) => {
    const updatedSessions = sessions.map((session) => {
      if (session.id === currentSessionId) {
        return { ...session, messages: [...session.messages, msg] };
      }
      return session;
    });
    setSessions(updatedSessions);
    setChatWindow(
      updatedSessions.find((s) => s.id === currentSessionId)?.messages || []
    );
    saveSessions(updatedSessions);
  };

  const clearChatHistory = async () => {
    if (!currentSessionId) {
      toast.error("No active session");
      return;
    }
    if (!confirm("Are you sure you want to clear the chat history?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/clear-history`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ session_id: currentSessionId }),
      });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();
      if (data.status === "success") {
        const updatedSessions = sessions.map((session) => {
          if (session.id === currentSessionId)
            return { ...session, messages: [] };
          return session;
        });
        setSessions(updatedSessions);
        setChatWindow([]);
        saveSessions(updatedSessions);
        toast.success("Chat history cleared successfully");
      } else {
        throw new Error(data.message || "Unknown error");
      }
    } catch (error: any) {
      console.error("Clear history error:", error);
      toast.error(`Error clearing chat history: ${error.message}`);
    }
  };

  const deleteChatSession = async () => {
    if (!currentSessionId) return;
    if (!confirm("Are you sure you want to delete this chat session?")) return;
    const updatedSessions = sessions.filter(
      (session) => session.id !== currentSessionId
    );
    setSessions(updatedSessions);
    saveSessions(updatedSessions);
    if (updatedSessions.length > 0) {
      selectSession(updatedSessions[0].id);
      window.history.pushState({}, "", `?session_id=${updatedSessions[0].id}`);
    } else {
      await createNewSession();
    }
  };

  const selectSession = (sessionId: string) => {
    setCurrentSessionId(sessionId);
    const session = sessions.find((s) => s.id === sessionId);
    setChatWindow(session ? session.messages : []);
    window.history.pushState({}, "", `?session_id=${sessionId}`);
  };

  const openRenameModal = () => {
    const session = sessions.find((s) => s.id === currentSessionId);
    if (!session) return;
    setNewChatName(session.name);
    setShowRenameModal(true);
  };

  const TypingAnimation = () => (
    <div className='flex space-x-2'>
      <div className='h-2 w-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]'></div>
      <div className='h-2 w-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]'></div>
      <div className='h-2 w-2 bg-blue-600 rounded-full animate-bounce'></div>
    </div>
  );

  const saveChatName = () => {
    if (!newChatName.trim()) return;
    const updatedSessions = sessions.map((session) => {
      if (session.id === currentSessionId)
        return { ...session, name: newChatName.trim() };
      return session;
    });
    setSessions(updatedSessions);
    saveSessions(updatedSessions);
    setShowRenameModal(false);
    toast.success("Chat renamed successfully");
  };

  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-screen'>
        Loading...
      </div>
    );
  }

  return (
    <div className='flex h-screen flex-col'>
      {/* Header with Logo and Navigation */}
      <header className='w-full flex items-center justify-between bg-white shadow px-4 py-3'>
        <div className='flex items-center space-x-6'>
          <Link to='/' className='flex items-center space-x-2'>
            <span className='text-xl font-bold text-primary-dark'>
              OdiaLingua
            </span>
          </Link>
          <div className='h-6 w-px bg-gray-300' />
          <div className='flex items-center space-x-4'>
            <h3 className='text-xl font-bold'>
              {sessions.find((s) => s.id === currentSessionId)?.name || "Chat"}
            </h3>
            <button
              onClick={openRenameModal}
              className='text-sm text-blue-600 hover:underline'
            >
              Rename
            </button>
          </div>
        </div>
        <div className='flex items-center space-x-4'>
          <span className='text-sm text-gray-800'>
            Hi, {user?.name || user?.email || "User"}
          </span>
          <button
            onClick={() => {
              logoutUser();
              localStorage.removeItem("sessions");
              navigate("/login");
            }}
            className='px-3 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600'
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className='flex flex-1 relative overflow-hidden'>
        {/* Sidebar Toggle Button */}
        {isSidebarCollapsed && (
          <button
            onClick={() => setIsSidebarCollapsed(false)}
            className='absolute left-2 top-4 z-10 p-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 shadow-lg'
          >
            <GoSidebarExpand size={20} />
          </button>
        )}

        {/* Sidebar */}
        <aside
          className={`${
            isSidebarCollapsed ? "w-0 -ml-72" : "w-72"
          } bg-gray-800 text-white p-4 transition-all duration-300 ease-in-out flex-shrink-0`}
        >
          <div className='mb-4 flex justify-between items-center'>
            <h2 className='text-xl font-bold'>Chats</h2>
            <button
              onClick={() => setIsSidebarCollapsed(true)}
              className='p-1 hover:bg-gray-700 rounded'
            >
              <GoSidebarCollapse size={20} />
            </button>
          </div>
          <div className='flex gap-2 mt-2'>
            <button
              onClick={createNewSession}
              className='bg-green-600 px-2 py-1 rounded flex-1 hover:bg-green-700'
            >
              + New Chat
            </button>
            <button
              onClick={clearChatHistory}
              className='bg-yellow-600 px-2 py-1 rounded flex-1 hover:bg-yellow-700'
            >
              Clear
            </button>
            <button
              onClick={deleteChatSession}
              className='bg-red-600 px-2 py-1 rounded flex-1 hover:bg-red-700'
            >
              Delete
            </button>
          </div>
          <ul className='overflow-y-auto max-h-[calc(100vh-10rem)] mt-4'>
            {sessions.map((session) => (
              <li
                key={session.id}
                className={`p-2 cursor-pointer hover:bg-gray-700 ${
                  session.id === currentSessionId ? "bg-gray-600" : ""
                }`}
                onClick={() => selectSession(session.id)}
              >
                <span className='text-sm'>{session.name}</span>
              </li>
            ))}
          </ul>
        </aside>

        {/* Main Chat Area */}
        <main className='flex-1 flex flex-col bg-gray-50 min-w-0 relative'>
          <div className='flex-1 overflow-y-auto'>
            <div className='container mx-auto max-w-5xl px-4 py-4 space-y-4'>
              {chatWindow.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`w-full max-w-[85%] md:max-w-[75%] lg:max-w-[60%] p-3 rounded-lg shadow ${
                      msg.role === "assistant"
                        ? "bg-blue-50 text-blue-900"
                        : "bg-white text-gray-800"
                    }`}
                  >
                    <div className='font-semibold mb-1'>
                      {msg.role === "assistant" ? "Assistant" : "You"}
                    </div>
                    <div className='break-words whitespace-pre-wrap'>
                      {msg.content}
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
              {assistantTyping && (
                <div className='flex justify-start'>
                  <div className='w-full max-w-[85%] md:max-w-[75%] lg:max-w-[60%] p-3 rounded-lg shadow bg-blue-50 text-blue-900'>
                    <div className='font-semibold mb-1'>Assistant</div>
                    <TypingAnimation />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Input Area */}
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

      {/* Rename Modal */}
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
