import React, { useEffect, useState, useCallback } from 'react';
import { getUser, logoutUser } from '@/auth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Message {
  role: 'user' | 'assistant';
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
  const [messageInput, setMessageInput] = useState('');
  const [chatWindow, setChatWindow] = useState<Message[]>([]);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [newChatName, setNewChatName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Verify session exists on backend
  const verifySession = async (sessionId: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/stream-chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          messages: [],
        }),
      });
      return res.status !== 404;
    } catch {
      return false;
    }
  };

  const createNewSession = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/create-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (!res.ok) {
        throw new Error('Failed to create session');
      }

      const data = await res.json();
      if (data.status === 'success' && data.session_id) {
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
        return newSession.id;
      }
      throw new Error('Invalid session response');
    } catch (error) {
      console.error("Failed to create session:", error);
      toast.error("Failed to create new chat session");
      return null;
    }
  };

  const initializeSessions = useCallback(async () => {
    const saved = localStorage.getItem('sessions');
    if (saved) {
      const parsed: Session[] = JSON.parse(saved);
      if (parsed.length > 0) {
        const isValid = await verifySession(parsed[0].id);
        if (!isValid) {
          localStorage.removeItem('sessions');
          const newSessionId = await createNewSession();
          if (newSessionId) {
            setCurrentSessionId(newSessionId);
          }
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

  const saveSessions = (updatedSessions: Session[]) => {
    localStorage.setItem('sessions', JSON.stringify(updatedSessions));
  };

  const sendMessage = async () => {
    if (!messageInput.trim() || !currentSessionId) {
        toast.error("Please enter a message");
        return;
    }

    const userMessage: Message = { role: 'user', content: messageInput.trim() };
    updateCurrentSession(userMessage);
    setMessageInput('');

    try {
        const res = await fetch(`${API_BASE_URL}/stream-chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            credentials: 'include',
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
        if (data.status === 'success') {
            const assistantMessage: Message = {
                role: 'assistant',
                content: data.response || 'No response from server.'
            };
            updateCurrentSession(assistantMessage);
        } else {
            throw new Error(data.message || 'Unknown error');
        }
    } catch (error: any) {
        console.error('Chat error:', error);
        toast.error(`Error: ${error.message}`);
        updateCurrentSession({
            role: 'assistant',
            content: `Error: ${error.message}`
        });
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
    setChatWindow(updatedSessions.find(s => s.id === currentSessionId)?.messages || []);
    saveSessions(updatedSessions);
  };

  const clearChatHistory = async () => {
    if (!currentSessionId) {
        toast.error("No active session");
        return;
    }
    if (!confirm('Are you sure you want to clear the chat history?')) {
        return;
    }
    
    try {
        const res = await fetch(`${API_BASE_URL}/clear-history`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ session_id: currentSessionId }),
        });
        
        if (!res.ok) {
            throw new Error(`Server error: ${res.status}`);
        }
        
        const data = await res.json();
        if (data.status === 'success') {
            const updatedSessions = sessions.map(session => {
                if (session.id === currentSessionId) {
                    return { ...session, messages: [] };
                }
                return session;
            });
            setSessions(updatedSessions);
            setChatWindow([]);
            saveSessions(updatedSessions);
            toast.success('Chat history cleared successfully');
        } else {
            throw new Error(data.message || 'Unknown error');
        }
    } catch (error) {
        console.error('Clear history error:', error);
        toast.error(`Error clearing chat history: ${error.message}`);
    }
};

  const deleteChatSession = async () => {
    if (!currentSessionId) return;
    if (!confirm('Are you sure you want to delete this chat session?')) return;
    
    const updatedSessions = sessions.filter(session => session.id !== currentSessionId);
    setSessions(updatedSessions);
    saveSessions(updatedSessions);
    
    if (updatedSessions.length > 0) {
      selectSession(updatedSessions[0].id);
    } else {
      await createNewSession();
    }
  };

  const selectSession = (sessionId: string) => {
    setCurrentSessionId(sessionId);
    const session = sessions.find(s => s.id === sessionId);
    setChatWindow(session ? session.messages : []);
  };

  const openRenameModal = () => {
    const session = sessions.find(s => s.id === currentSessionId);
    if (!session) return;
    setNewChatName(session.name);
    setShowRenameModal(true);
  };

  const saveChatName = () => {
    if (!newChatName.trim()) return;
    const updatedSessions = sessions.map(session => {
      if (session.id === currentSessionId) {
        return { ...session, name: newChatName.trim() };
      }
      return session;
    });
    setSessions(updatedSessions);
    saveSessions(updatedSessions);
    setShowRenameModal(false);
    toast.success('Chat renamed successfully');
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="flex h-screen flex-col">
      {/* Header */}
      <header className="w-full h-12 flex items-center justify-between bg-gray-100 px-4 border-b">
        <div className="flex items-center space-x-4">
          <h3 className="text-xl font-bold">
            {sessions.find(s => s.id === currentSessionId)?.name || 'Chat'}
          </h3>
          <button
            onClick={openRenameModal}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Rename
          </button>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-neutral-900">
            Hi, {user?.name || user?.email || "User"}
          </div>
          <button
            onClick={() => {
              logoutUser();
              localStorage.removeItem("sessions");
              navigate("/login");
            }}
            className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-72 bg-gray-800 text-white p-4">
          <div className="mb-4">
            <h2 className="text-xl">Chats</h2>
            <div className="flex gap-2 mt-2">
              <button
                onClick={createNewSession}
                className="bg-green-600 px-2 py-1 rounded flex-1 hover:bg-green-700"
              >
                + New Chat
              </button>
              <button
                onClick={clearChatHistory}
                className="bg-yellow-600 px-2 py-1 rounded flex-1 hover:bg-yellow-700"
              >
                Clear
              </button>
              <button
                onClick={deleteChatSession}
                className="bg-red-600 px-2 py-1 rounded flex-1 hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
          <ul className="overflow-y-auto max-h-[calc(100vh-12rem)]">
            {sessions.map(session => (
              <li
                key={session.id}
                className={`p-2 cursor-pointer hover:bg-gray-700 ${
                  session.id === currentSessionId ? 'bg-gray-600' : ''
                }`}
                onClick={() => selectSession(session.id)}
              >
                <span className="text-sm">{session.name}</span>
              </li>
            ))}
          </ul>
        </aside>

        {/* Main Chat Area */}
        <main className="flex-1 flex flex-col">
          <div className="flex-1 p-4 overflow-y-auto bg-white">
            {chatWindow.map((msg, idx) => (
              <div
                key={idx}
                className={`mb-4 p-3 rounded ${
                  msg.role === 'assistant'
                    ? 'bg-blue-50 text-blue-900'
                    : 'bg-gray-50 text-gray-900'
                }`}
              >
                <div className="font-semibold mb-1">
                  {msg.role === 'assistant' ? 'Assistant' : 'You'}:
                </div>
                <div>{msg.content}</div>
              </div>
            ))}
          </div>
          <div className="flex p-4 border-t bg-gray-50">
            <textarea
              className="flex-1 border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Type your message here..."
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              rows={2}
            />
            <button
              onClick={sendMessage}
              className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              disabled={!messageInput.trim()}
            >
              Send
            </button>
          </div>
        </main>
      </div>

      {/* Rename Modal */}
      {showRenameModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Rename Chat</h2>
              <button
                onClick={() => setShowRenameModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            <input
              type="text"
              value={newChatName}
              onChange={(e) => setNewChatName(e.target.value)}
              className="w-full border rounded-lg p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter new chat name"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowRenameModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={saveChatName}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
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