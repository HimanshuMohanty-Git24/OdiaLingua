import React, { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getUser, logoutUser } from "@/auth";
import { useNavigate, Link } from "react-router-dom";
import toast from 'react-hot-toast';
import { useAudioRecording } from '@/hooks/use-audio-recording';
import { VoiceRecorder } from '@/components/ui/voice-recorder';
import { 
  VolumeX, Volume2, Copy, Send, Plus, Settings, 
  MoreVertical, Trash2, Edit3, Menu, X, 
  Sparkles, Brain, MessageCircle, User, LogOut,
  Clock, Zap, Shield, ArrowLeft, RotateCcw,
  ChevronDown, Search, Home, Archive,
  Minimize2, Download, Share2, Mic, Image,
  Paperclip, Smile, Phone, Video, Info,
  Loader2, CheckCircle, AlertCircle, Languages
} from "lucide-react";
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow, prism } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { ThemeToggle } from './layout/ThemeToggle';
import { useTheme } from '@/contexts/ThemeProvider';
import { cn } from '@/lib/utils';

// Types
interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp?: number;
}

interface Session {
  id: string;
  name: string;
  messages: Message[];
  lastUpdated?: number;
  createdAt?: number;
}

interface STTResponse {
  success: boolean;
  transcript: string;
  detected_language: string;
  message: string;
}

// Constants
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

// Enhanced Markdown Components
const MarkdownComponents = {
  p: ({ children }: any) => (
    <p className="mb-2 sm:mb-3 last:mb-0 leading-relaxed text-sm sm:text-base">{children}</p>
  ),
  strong: ({ children }: any) => (
    <strong className="font-semibold text-primary">{children}</strong>
  ),
  code: ({ node, inline, className, children, ...props }: any) => {
    const { theme } = useTheme();
    const match = /language-(\w+)/.exec(className || '');
    
    return !inline && match ? (
      <div className="relative group my-3 sm:my-4">
        <div className="absolute top-2 sm:top-3 right-2 sm:right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              navigator.clipboard.writeText(String(children).replace(/\n$/, ''));
              toast.success('Code copied!');
            }}
            className="h-6 sm:h-8 px-1 sm:px-2 text-xs"
          >
            <Copy className="w-3 h-3" />
          </Button>
        </div>
        <SyntaxHighlighter 
          style={theme === 'dark' ? tomorrow : prism} 
          language={match[1]} 
          PreTag="div" 
          className="rounded-lg sm:rounded-xl text-xs sm:text-sm border border-border/50 shadow-sm"
          {...props}
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      </div>
    ) : (
      <code className="bg-muted/50 px-1 sm:px-2 py-0.5 sm:py-1 rounded text-xs sm:text-sm font-mono" {...props}>
        {children}
      </code>
    );
  },
  ul: ({ children }: any) => (
    <ul className="list-disc list-inside mb-2 sm:mb-3 space-y-0.5 sm:space-y-1 ml-1 sm:ml-2 text-sm sm:text-base">{children}</ul>
  ),
  blockquote: ({ children }: any) => (
    <blockquote className="border-l-4 border-primary/30 pl-3 sm:pl-4 my-3 sm:my-4 italic bg-muted/20 py-2 rounded-r-lg text-sm sm:text-base">
      {children}
    </blockquote>
  ),
};

// Professional Loading Screen
const LoadingScreen = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-background px-4">
    <div className="relative">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6 sm:mb-8"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="absolute inset-2 rounded-full border-4 border-transparent border-t-purple-500"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-primary to-purple-500 flex items-center justify-center shadow-lg"
          >
            <Brain className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </motion.div>
        </div>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-center"
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-gradient mb-2">OdiaLingua</h1>
        <p className="text-muted-foreground text-base sm:text-lg mb-6">Loading your AI companion</p>
      </motion.div>
    </div>
  </div>
);

// Welcome Screen for New Chat
const WelcomeScreen = ({ userName, onStartChat }: { 
  userName: string; 
  onStartChat: (suggestion?: string) => void 
}) => {
  const suggestions = [
    "Tell me about Odia culture and traditions",
    "Help me learn Odia language basics", 
    "What are famous places in Odisha?",
    "Explain Jagannath temple history"
  ];

  return (
    <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="max-w-2xl w-full text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="mb-6 sm:mb-8"
        >
          <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-full bg-gradient-to-r from-primary via-purple-500 to-pink-500 flex items-center justify-center shadow-2xl mb-4 sm:mb-6">
            <Brain className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
          </div>
          
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            <span className="text-muted-foreground">Hello,</span>
            <br />
            <span className="text-gradient">{userName.split(' ')[0] || 'Friend'}!</span>
          </h1>
          
          <p className="text-lg sm:text-xl text-muted-foreground mb-6 sm:mb-8 px-2">
            I'm your AI companion for exploring the beautiful Odia language. 
            What would you like to talk about today?
          </p>
        </motion.div>

        <div className="grid gap-2 sm:gap-3 mb-6 sm:mb-8">
          {suggestions.map((suggestion, index) => (
            <motion.button
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
              onClick={() => onStartChat(suggestion)}
              className="p-3 sm:p-4 text-left rounded-xl border border-border/50 bg-card/50 hover:bg-card transition-all duration-200 hover:border-primary/30 group"
            >
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-2 h-2 bg-primary rounded-full group-hover:scale-125 transition-transform flex-shrink-0" />
                <span className="text-sm sm:text-base text-foreground group-hover:text-primary transition-colors">
                  {suggestion}
                </span>
              </div>
            </motion.button>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Button
            onClick={() => onStartChat()}
            size="lg"
            className="btn-gradient px-6 sm:px-8 py-3 sm:py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base"
          >
            <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            Start Conversation
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

// Enhanced Typing Indicator
const TypingIndicator = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3"
  >
    <div className="flex space-x-1">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2 }}
          className="h-2 w-2 bg-primary rounded-full"
        />
      ))}
    </div>
    <span className="text-xs sm:text-sm text-muted-foreground">AI is thinking...</span>
  </motion.div>
);

// Enhanced Markdown Components
const MessageComponent = React.memo(({ 
  message, 
  index, 
  ttsState, // Changed from isPlaying to ttsState
  onPlayTTS, 
  onCopy 
}: {
  message: Message;
  index: number;
  ttsState?: { isLoading: boolean; isPlaying: boolean }; // New type
  onPlayTTS: (text: string, id: string) => void;
  onCopy: (text: string) => void;
}) => {
  const messageId = `msg-${index}`;
  const formatTime = (timestamp?: number) => {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "flex gap-2 sm:gap-3 group relative mb-4 sm:mb-6",
        message.role === "user" ? "justify-end" : "justify-start"
      )}
    >
      {/* Assistant Avatar */}
      {message.role === "assistant" && (
        <div className="flex-shrink-0 mt-1">
          <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-gradient-to-r from-primary to-purple-500 flex items-center justify-center shadow-lg">
            <Brain className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
          </div>
        </div>
      )}
      
      {/* Message Content */}
      <div className={cn(
        "max-w-[85%] sm:max-w-[75%] relative",
        message.role === "user" ? "order-1" : "order-2"
      )}>
        <div className={cn(
          "rounded-2xl px-3 sm:px-4 py-2 sm:py-3 shadow-sm relative",
          message.role === "assistant" 
            ? "bg-card border border-border/50 text-foreground" 
            : "bg-gradient-to-r from-primary to-primary/90 text-white shadow-lg"
        )}>
          {/* Message bubble arrow */}
          <div className={cn(
            "absolute top-3 sm:top-4 w-0 h-0",
            message.role === "assistant" 
              ? "-left-1 sm:-left-2 border-r-[6px] sm:border-r-[8px] border-r-card border-t-[6px] sm:border-t-[8px] border-b-[6px] sm:border-b-[8px] border-t-transparent border-b-transparent"
              : "-right-1 sm:-right-2 border-l-[6px] sm:border-l-[8px] border-l-primary border-t-[6px] sm:border-t-[8px] border-b-[6px] sm:border-b-[8px] border-t-transparent border-b-transparent"
          )} />
          
          {/* Content */}
          <div className={cn(
            "prose prose-sm max-w-none",
            message.role === "assistant" 
              ? "prose-slate dark:prose-invert" 
              : "[&>*]:text-white [&>*]:mb-2 [&>*:last-child]:mb-0"
          )}>
            <ReactMarkdown components={MarkdownComponents}>
              {message.content}
            </ReactMarkdown>
          </div>
          
          {/* Message time and actions */}
          <div className={cn(
            "text-xs mt-2 flex items-center justify-between",
            message.role === "assistant" 
              ? "text-muted-foreground" 
              : "text-white/70"
          )}>
            <span className="text-xs">{formatTime(message.timestamp)}</span>
            
            {/* Message actions */}
            {message.role === "assistant" && (
              <div className="flex items-center gap-0.5 sm:gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onPlayTTS(message.content, messageId)}
                  disabled={ttsState?.isLoading}
                  className="h-5 w-5 sm:h-6 sm:w-6 p-0 hover:bg-muted"
                >
                  {ttsState?.isLoading ? (
                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 border border-current border-t-transparent rounded-full animate-spin" />
                  ) : ttsState?.isPlaying ? (
                    <VolumeX className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  ) : (
                    <Volume2 className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onCopy(message.content)}
                  className="h-5 w-5 sm:h-6 sm:w-6 p-0 hover:bg-muted"
                >
                  <Copy className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* User Avatar */}
      {message.role === "user" && (
        <div className="flex-shrink-0 mt-1 order-2">
          <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center shadow-lg">
            <User className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
          </div>
        </div>
      )}
    </motion.div>
  );
});

// Sidebar Chat Item
const ChatItem = ({ session, isActive, onClick, onRename, onDelete, onExport }: {
  session: Session;
  isActive: boolean;
  onClick: () => void;
  onRename: () => void;
  onDelete: () => void;
  onExport: () => void;
}) => {
  const lastMessage = session.messages[session.messages.length - 1];
  const timeAgo = session.lastUpdated ? 
    new Date(session.lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 
    '';

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ x: 2 }}
      className={cn(
        "group relative p-2 sm:p-3 rounded-xl cursor-pointer transition-all duration-200",
        isActive 
          ? "bg-primary/10 border border-primary/30 shadow-sm" 
          : "hover:bg-muted/50"
      )}
      onClick={onClick}
    >
      <div className="flex items-start gap-2 sm:gap-3">
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-primary/20 to-purple-500/20 flex items-center justify-center flex-shrink-0">
          <MessageCircle className={cn(
            "w-4 h-4 sm:w-5 sm:h-5",
            isActive ? "text-primary" : "text-muted-foreground"
          )} />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h4 className={cn(
              "font-medium text-xs sm:text-sm truncate",
              isActive ? "text-primary" : "text-foreground"
            )}>
              {session.name}
            </h4>
            <span className="text-xs text-muted-foreground flex-shrink-0 ml-1">{timeAgo}</span>
          </div>
          
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
            {lastMessage 
              ? lastMessage.content.slice(0, 40) + (lastMessage.content.length > 40 ? '...' : '')
              : 'No messages yet'
            }
          </p>
          
          <div className="flex items-center justify-between mt-2">
            <Badge variant="secondary" className="text-xs px-1 py-0">
              {session.messages.length}
            </Badge>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-5 w-5 sm:h-6 sm:w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreVertical className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onRename(); }}>
                  <Edit3 className="w-4 h-4 mr-2" />
                  Rename
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onExport(); }}>
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={(e) => { e.stopPropagation(); onDelete(); }}
                  className="text-destructive"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Main ChatUI Component
const ChatUI = () => {
  const [user, setUser] = useState<any>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [newChatName, setNewChatName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [assistantTyping, setAssistantTyping] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentView, setCurrentView] = useState<'welcome' | 'chat'>('welcome');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Enhanced TTS State Management - tracking per message
  const [ttsStates, setTtsStates] = useState<{
    [messageId: string]: {
      isLoading: boolean;
      isPlaying: boolean;
      audioElement: HTMLAudioElement | null;
      abortController: AbortController | null;
    }
  }>({});
  const [isTTSEnabled, setIsTTSEnabled] = useState(false);
  const [isTTSPlaying, setIsTTSPlaying] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  
  // Add voice recording functionality
  const {
    isRecording,
    isProcessing: isRecordingProcessing,
    audioLevel,
    startRecording,
    stopRecording,
    cancelRecording,
  } = useAudioRecording();

  const [isTranscribing, setIsTranscribing] = useState(false);
  
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Voice recording handlers
  const handleStartRecording = async () => {
    try {
      await startRecording();
      toast.success(
        <div className="flex items-center space-x-2">
          <Mic className="h-4 w-4" />
          <span>Recording started. Speak now...</span>
        </div>,
        { duration: 2000 }
      );
    } catch (error: any) {
      toast.error(
        <div className="flex items-center space-x-2">
          <AlertCircle className="h-4 w-4" />
          <span>{error.message || 'Failed to start recording'}</span>
        </div>
      );
    }
  };

const handleStopRecording = async () => {
  try {
    setIsTranscribing(true);
    
    const audioBlob = await stopRecording();
    
    if (!audioBlob) {
      toast.error('No audio recorded. Please try again.');
      return;
    }

    // Create FormData for the API request
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.wav');

    const response = await fetch(`${API_BASE_URL}/speech-to-text`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const result: STTResponse = await response.json();

    if (result.success && result.transcript?.trim()) {
      
      // Set the transcribed text to the message input
      setMessageInput(result.transcript);
      
      // Focus the textarea for immediate editing if needed
      if (inputRef.current) {
        inputRef.current.focus();
      }
      
      // Show language detection info with enhanced styling
      if (result.detected_language && result.detected_language !== 'unknown') {
        const languageNames: Record<string, string> = {
          'od-IN': 'Odia',
          'en-IN': 'English', 
          'hi-IN': 'Hindi',
          'bn-IN': 'Bengali',
          'te-IN': 'Telugu',
          'ta-IN': 'Tamil',
          'ml-IN': 'Malayalam',
          'kn-IN': 'Kannada',
          'gu-IN': 'Gujarati',
          'pa-IN': 'Punjabi',
          'mr-IN': 'Marathi'
        };
        const detectedLang = languageNames[result.detected_language] || result.detected_language;
        
        toast.success(
          <div className="flex items-center space-x-2">
            <Languages className="h-4 w-4" />
            <span>Detected: {detectedLang}</span>
          </div>,
          {
            duration: 3000,
            icon: '🎯',
          }
        );
      }
    } else {
      toast.error(
        <div className="flex items-center space-x-2">
          <AlertCircle className="h-4 w-4" />
          <span>Could not transcribe audio. Please speak clearly and try again.</span>
        </div>
      );
    }

  } catch (error) {
    console.error('Transcription error:', error);
    let errorMessage = 'Failed to transcribe audio';
    
    if (error instanceof Error) {
      errorMessage = error.message.includes('HTTP') 
        ? `Server error: ${error.message}`
        : `Transcription error: ${error.message}`;
    }
    
    toast.error(
      <div className="flex items-center space-x-2">
        <AlertCircle className="h-4 w-4" />
        <span>{errorMessage}</span>
      </div>
    );
  } finally {
    setIsTranscribing(false);
  }
};



  const handleCancelRecording = () => {
    cancelRecording();
    toast.success('Recording cancelled');
  };

  // Auto-scroll to bottom
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (currentView === 'chat') {
      scrollToBottom();
    }
  }, [sessions, currentSessionId, assistantTyping, scrollToBottom, currentView]);

  // Export chat functionality
  const exportChatAsText = useCallback((session: Session) => {
    if (!session || session.messages.length === 0) {
      toast.error("No messages to export");
      return;
    }

    try {
      // Format messages as readable text
      const lines = [
        `Chat Export: ${session.name}`,
        `Generated on: ${new Date().toLocaleString()}`,
        `Total Messages: ${session.messages.length}`,
        '='.repeat(50),
        ''
      ];

      session.messages.forEach((message, index) => {
        const timestamp = message.timestamp 
          ? new Date(message.timestamp).toLocaleString()
          : 'Unknown time';
        
        const sender = message.role === 'user' ? 'You' : 'OdiaLingua AI';
        
        lines.push(`[${timestamp}] ${sender}:`);
        lines.push(message.content);
        lines.push(''); // Empty line between messages
      });

      // Add footer
      lines.push('='.repeat(50));
      lines.push('Exported from OdiaLingua - Your AI Language Companion');
      lines.push('https://odialingua.com');

      const textContent = lines.join('\n');
      
      // Create and trigger download
      const element = document.createElement("a");
      const file = new Blob([textContent], { type: 'text/plain; charset=utf-8' });
      element.href = URL.createObjectURL(file);
      
      // Generate filename with timestamp
      const timestamp = new Date().toISOString().slice(0, 19).replace(/[:]/g, '-');
      element.download = `${session.name.replace(/[^a-z0-9]/gi, '_')}_${timestamp}.txt`;
      
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      
      // Clean up the URL
      URL.revokeObjectURL(element.href);
      
      toast.success("Chat exported successfully!");
      
    } catch (error) {
      console.error('Export failed:', error);
      toast.error("Failed to export chat");
    }
  }, []);

  // Export all chats functionality
  const exportAllChats = useCallback(() => {
    if (sessions.length === 0) {
      toast.error("No chats to export");
      return;
    }

    try {
      const lines = [
        'OdiaLingua - Complete Chat Export',
        `Generated on: ${new Date().toLocaleString()}`,
        `Total Conversations: ${sessions.length}`,
        `Total Messages: ${sessions.reduce((total, session) => total + session.messages.length, 0)}`,
        '='.repeat(60),
        ''
      ];

      // Sort sessions by last updated
      const sortedSessions = [...sessions].sort((a, b) => 
        (b.lastUpdated || 0) - (a.lastUpdated || 0)
      );

      sortedSessions.forEach((session, sessionIndex) => {
        lines.push(`CONVERSATION ${sessionIndex + 1}: ${session.name}`);
        lines.push(`Messages: ${session.messages.length}`);
        lines.push(`Last Updated: ${session.lastUpdated ? new Date(session.lastUpdated).toLocaleString() : 'Unknown'}`);
        lines.push('-'.repeat(40));
        lines.push('');

        if (session.messages.length > 0) {
          session.messages.forEach((message) => {
            const timestamp = message.timestamp 
              ? new Date(message.timestamp).toLocaleString()
              : 'Unknown time';
            
            const sender = message.role === 'user' ? 'You' : 'OdiaLingua AI';
            
            lines.push(`[${timestamp}] ${sender}:`);
            lines.push(message.content);
            lines.push('');
          });
        } else {
          lines.push('(No messages in this conversation)');
          lines.push('');
        }
        
        lines.push('='.repeat(60));
        lines.push('');
      });

      lines.push('End of Export - OdiaLingua');
      lines.push('Your AI Language Companion');

      const textContent = lines.join('\n');
      
      // Create and trigger download
      const element = document.createElement("a");
      const file = new Blob([textContent], { type: 'text/plain; charset=utf-8' });
      element.href = URL.createObjectURL(file);
      
      const timestamp = new Date().toISOString().slice(0, 19).replace(/[:]/g, '-');
      element.download = `OdiaLingua_All_Chats_${timestamp}.txt`;
      
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      
      URL.revokeObjectURL(element.href);
      
      toast.success(`Exported ${sessions.length} conversations!`);
      
    } catch (error) {
      console.error('Export all failed:', error);
      toast.error("Failed to export chats");
    }
  }, [sessions]);

  // Fetch user chats
  const fetchUserChats = useCallback(async (userId: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/chats/${userId}`);
      if (!res.ok) throw new Error("Failed to fetch chats");
      const userSessions: Session[] = await res.json();
      setSessions(userSessions.map(session => ({
        ...session,
        lastUpdated: Date.now() - Math.random() * 24 * 60 * 60 * 1000,
        createdAt: Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000
      })));
    } catch (error) {
      console.error("Failed to fetch user chats:", error);
      toast.error("Could not load your chats.");
    }
  }, []);

  // Send message function
  const sendMessage = useCallback(async (messageText?: string) => {
    const textToSend = messageText || messageInput.trim();
    if (!textToSend || !user || assistantTyping) return;
    
    const optimisticSessionId = currentSessionId ?? uuidv4();
    const isNewChat = !currentSessionId;
    const userMessage: Message = { 
      role: "user", 
      content: textToSend,
      timestamp: Date.now()
    };

    // Switch to chat view if needed
    if (currentView === 'welcome') {
      setCurrentView('chat');
    }

    // Close sidebar on mobile after sending
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }

    // Optimistic updates
    if (isNewChat) {
      const newSession: Session = { 
        id: optimisticSessionId, 
        name: 'New Chat', 
        messages: [userMessage],
        lastUpdated: Date.now(),
        createdAt: Date.now()
      };
      setSessions(prev => [newSession, ...prev]);
      setCurrentSessionId(optimisticSessionId);
    } else {
      setSessions(prev => prev.map(s => 
        s.id === optimisticSessionId 
          ? { ...s, messages: [...s.messages, userMessage], lastUpdated: Date.now() } 
          : s
      ));
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
      const assistantMessage: Message = { 
        role: "assistant", 
        content: data.response,
        timestamp: Date.now()
      };

      setSessions(prev => prev.map(s => {
        if (s.id === optimisticSessionId) {
          return {
            ...s,
            name: data.newName || s.name,
            messages: [...s.messages, assistantMessage],
            lastUpdated: Date.now()
          };
        }
        return s;
      }));

      // TTS for assistant response if enabled
      if (isTTSEnabled && data.response && !isTTSPlaying) {
        setIsTTSPlaying(true);
        
        // Stop any currently playing audio
        if (currentAudio) {
          currentAudio.pause();
          currentAudio.currentTime = 0;
          URL.revokeObjectURL(currentAudio.src);
        }

        try {
          const ttsResponse = await fetch(`${API_BASE_URL}/text-to-speech`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              text: data.response,
            }),
          });

          if (ttsResponse.ok) {
            const audioBlob = await ttsResponse.blob();
            const audioUrl = URL.createObjectURL(audioBlob);
            const audio = new Audio(audioUrl);
            
            setCurrentAudio(audio);
            
            audio.onended = () => {
              setIsTTSPlaying(false);
              setCurrentAudio(null);
              URL.revokeObjectURL(audioUrl);
            };
            
            audio.onerror = () => {
              setIsTTSPlaying(false);
              setCurrentAudio(null);
              URL.revokeObjectURL(audioUrl);
              console.error('TTS audio playback failed');
            };
            
            await audio.play();
          } else {
            throw new Error(`TTS request failed: ${ttsResponse.status}`);
          }
        } catch (ttsError) {
          console.error('TTS error:', ttsError);
          setIsTTSPlaying(false);
          setCurrentAudio(null);
          toast.error('Failed to play audio response');
        }
      }

    } catch (error: any) {
      toast.error(`Error: ${error.message}`);
      const errorMessage: Message = { 
        role: "assistant", 
        content: `Sorry, I encountered an error: ${error.message}. Please try again.`,
        timestamp: Date.now()
      };
      
      setSessions(prev => prev.map(s => 
        s.id === optimisticSessionId 
          ? { ...s, messages: [...s.messages, errorMessage] } 
          : s
      ));
    } finally {
      setAssistantTyping(false);
    }
  }, [messageInput, user, currentSessionId, assistantTyping, currentView, isTTSEnabled, isTTSPlaying, currentAudio]);

  // Initialize component
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

  // Cleanup TTS states when component unmounts or session changes
  useEffect(() => {
    return () => {
      // Cleanup all TTS states when component unmounts or session changes
      Object.values(ttsStates).forEach(state => {
        if (state.audioElement) {
          state.audioElement.pause();
          URL.revokeObjectURL(state.audioElement.src);
        }
        if (state.abortController) {
          state.abortController.abort();
        }
      });
    };
  }, [currentSessionId, ttsStates]); // Cleanup when session changes

  // Session management
  const startNewChat = useCallback(() => {
    setCurrentSessionId(null);
    setCurrentView('welcome');
    setMessageInput("");
    // Close sidebar on mobile
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  }, []);

  const selectSession = useCallback((sessionId: string) => {
    setCurrentSessionId(sessionId);
    setCurrentView('chat');
    // Close sidebar on mobile
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  }, []);

  const startChatFromWelcome = useCallback((suggestion?: string) => {
    setCurrentView('chat');
    if (suggestion) {
      // Small delay to ensure the view has switched before sending
      setTimeout(() => {
        sendMessage(suggestion);
      }, 100);
    } else if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [sendMessage]);

  const currentSession = currentSessionId 
    ? sessions.find(s => s.id === currentSessionId) 
    : null;
  
  const chatMessages = currentSession?.messages ?? [];
  const currentChatName = currentSession?.name ?? "New Chat";

  // Filter sessions based on search
  const filteredSessions = sessions.filter(session =>
    session.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    session.messages.some(msg => 
      msg.content.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        sendMessage();
      }
    };

    if (inputRef.current) {
      inputRef.current.addEventListener('keydown', handleKeyDown);
      return () => inputRef.current?.removeEventListener('keydown', handleKeyDown);
    }
  }, [sendMessage]);

  // Enhanced TTS functionality with proper request management
  const playTTS = useCallback(async (text: string, messageId: string) => {
    try {
      const currentState = ttsStates[messageId];
      
      // If already loading, ignore subsequent clicks
      if (currentState?.isLoading) {
        console.log(`TTS already loading for message ${messageId}, ignoring click`);
        return;
      }
      
      // If currently playing, stop the audio
      if (currentState?.isPlaying && currentState?.audioElement) {
        currentState.audioElement.pause();
        currentState.audioElement.currentTime = 0;
        URL.revokeObjectURL(currentState.audioElement.src);
        
        setTtsStates(prev => ({
          ...prev,
          [messageId]: {
            ...prev[messageId],
            isPlaying: false,
            audioElement: null
          }
        }));
        return;
      }

      // Create abort controller for this request
      const abortController = new AbortController();
      
      // Set loading state
      setTtsStates(prev => ({
        ...prev,
        [messageId]: {
          isLoading: true,
          isPlaying: false,
          audioElement: null,
          abortController
        }
      }));

      const loadingToast = toast.loading("Generating speech...");

      try {
        const response = await fetch(`${API_BASE_URL}/text-to-speech`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
          signal: abortController.signal // Add abort signal
        });

        toast.dismiss(loadingToast);

        if (!response.ok) {
          throw new Error(`TTS request failed: ${response.status}`);
        }

        // Check if request was aborted
        if (abortController.signal.aborted) {
          console.log("TTS request was aborted");
          return;
        }

        const audioBlob = await response.blob();
        
        // Check again if aborted after blob creation
        if (abortController.signal.aborted) {
          console.log("TTS request was aborted after blob creation");
          return;
        }
        
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);

        // Set up audio event handlers
        audio.onloadeddata = () => {
          // Update state when audio is ready to play
          setTtsStates(prev => {
            // Check if this is still the current request (not cancelled)
            const currentRequestState = prev[messageId];
            if (currentRequestState?.abortController === abortController) {
              return {
                ...prev,
                [messageId]: {
                  isLoading: false,
                  isPlaying: true,
                  audioElement: audio,
                  abortController: null
                }
              };
            }
            // If it's not the current request, clean up
            URL.revokeObjectURL(audioUrl);
            return prev;
          });
        };

        audio.onended = () => {
          setTtsStates(prev => ({
            ...prev,
            [messageId]: {
              isLoading: false,
              isPlaying: false,
              audioElement: null,
              abortController: null
            }
          }));
          URL.revokeObjectURL(audioUrl);
        };

        audio.onerror = () => {
          console.error("TTS audio playback failed");
          setTtsStates(prev => ({
            ...prev,
            [messageId]: {
              isLoading: false,
              isPlaying: false,
              audioElement: null,
              abortController: null
            }
          }));
          URL.revokeObjectURL(audioUrl);
          toast.error("Failed to play audio");
        };

        // Start playing
        await audio.play();
        toast.success("Playing audio");

      } catch (error: any) {
        toast.dismiss(loadingToast);
        
        if (error.name === 'AbortError') {
          console.log("TTS request was cancelled");
          toast.success("Audio request cancelled");
        } else {
          console.error("TTS error:", error);
          toast.error("Failed to generate audio");
        }
        
        // Reset state on error
        setTtsStates(prev => ({
          ...prev,
          [messageId]: {
            isLoading: false,
            isPlaying: false,
            audioElement: null,
            abortController: null
          }
        }));
      }

    } catch (error) {
      console.error("TTS error:", error);
      toast.error("Failed to generate audio");
      
      // Reset state on error
      setTtsStates(prev => ({
        ...prev,
        [messageId]: {
          isLoading: false,
          isPlaying: false,
          audioElement: null,
          abortController: null
        }
      }));
    }
  }, [ttsStates]);

  // Copy functionality
  const copyText = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Text copied!");
    } catch (error) {
      toast.error("Failed to copy text");
    }
  }, []);

  // Chat actions
  const deleteChatSession = useCallback(async (sessionId: string) => {
    try {
      await fetch(`${API_BASE_URL}/delete-chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId }),
      });
      
      const updatedSessions = sessions.filter(s => s.id !== sessionId);
      setSessions(updatedSessions);
      
      if (sessionId === currentSessionId) {
        if (updatedSessions.length > 0) {
          setCurrentSessionId(updatedSessions[0].id);
          setCurrentView('chat');
        } else {
          startNewChat();
        }
      }
      
      toast.success("Chat deleted");
    } catch (error: any) {
      toast.error(`Failed to delete chat: ${error.message}`);
    }
  }, [sessions, currentSessionId, startNewChat]);

  const saveChatName = useCallback(async () => {
    if (!newChatName.trim() || !currentSessionId) return;
    
    try {
      await fetch(`${API_BASE_URL}/rename-chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: currentSessionId, name: newChatName.trim() }),
      });
      
      setSessions(prev => prev.map(s => 
        s.id === currentSessionId 
          ? { ...s, name: newChatName.trim(), lastUpdated: Date.now() } 
          : s
      ));
      setShowRenameModal(false);
      toast.success("Chat renamed");
    } catch (error: any) {
      toast.error(`Failed to rename chat: ${error.message}`);
    }
  }, [newChatName, currentSessionId]);

  const handleLogout = useCallback(async () => {
    try {
      await logoutUser();
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      toast.error("Failed to logout");
    }
  }, [navigate]);

  // Loading state
  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "w-80 bg-card/50 backdrop-blur-xl border-r border-border/50 flex flex-col transition-transform duration-300 z-50",
        "fixed lg:relative inset-y-0 left-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        {/* Sidebar Header */}
        <div className="p-3 sm:p-4 border-b border-border/50">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-r from-primary to-purple-500 flex items-center justify-center">
                <Brain className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
              </div>
              <span className="font-bold text-lg sm:text-xl text-gradient">OdiaLingua</span>
            </Link>
            
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="w-6 h-6 sm:w-8 sm:h-8 p-0">
                    <Settings className="w-3 h-3 sm:w-4 sm:h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Settings</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => {
                      if (currentSession) {
                        exportChatAsText(currentSession);
                      } else {
                        exportAllChats();
                      }
                    }}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export Chat{sessions.length > 1 ? 's' : ''}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              {/* Mobile close button */}
              <Button
                variant="ghost"
                size="sm"
                className="w-6 h-6 sm:w-8 sm:h-8 p-0 lg:hidden"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="w-3 h-3 sm:w-4 sm:h-4" />
              </Button>
            </div>
          </div>

          {/* New Chat Button */}
          <Button
            onClick={startNewChat}
            className="w-full btn-gradient rounded-xl py-2 sm:py-3 text-sm sm:text-base shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
            New Chat
          </Button>
        </div>

        {/* Search */}
        <div className="p-3 sm:p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 sm:pl-10 pr-4 py-2 rounded-lg border border-border/50 bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-xs sm:text-sm"
            />
          </div>
        </div>

        {/* Chat History */}
        <ScrollArea className="flex-1 px-3 sm:px-4">
          <div className="space-y-1 sm:space-y-2">
            {filteredSessions.length === 0 ? (
              <div className="text-center py-8 sm:py-12">
                <MessageCircle className="w-8 h-8 sm:w-12 sm:h-12 text-muted-foreground mx-auto mb-3 sm:mb-4 opacity-50" />
                <p className="text-xs sm:text-sm text-muted-foreground">No conversations yet</p>
                <p className="text-xs text-muted-foreground mt-1">Start a new chat to begin</p>
              </div>
            ) : (
              <>
                <h3 className="text-xs font-medium text-muted-foreground mb-2 sm:mb-3 px-2">
                  Recent Conversations
                </h3>
                {filteredSessions
                  .sort((a, b) => (b.lastUpdated || 0) - (a.lastUpdated || 0))
                  .map((session) => (
                    <ChatItem
                      key={session.id}
                      session={session}
                      isActive={session.id === currentSessionId}
                      onClick={() => selectSession(session.id)}
                      onRename={() => {
                        setNewChatName(session.name);
                        setShowRenameModal(true);
                      }}
                      onExport={() => exportChatAsText(session)}
                      onDelete={() => {
                        if (confirm("Delete this conversation?")) {
                          deleteChatSession(session.id);
                        }
                      }}
                    />
                  ))
                }
              </>
            )}
          </div>
        </ScrollArea>

        {/* User Profile */}
        <div className="p-3 sm:p-4 border-t border-border/50">
          <div className="flex items-center gap-2 sm:gap-3">
            <Avatar className="w-8 h-8 sm:w-10 sm:h-10">
              <AvatarFallback className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs sm:text-sm">
                {(user?.name || user?.email || 'U').charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-xs sm:text-sm truncate">
                {user?.name || user?.email?.split('@')[0] || 'User'}
              </p>
              <p className="text-xs text-muted-foreground">
                {sessions.length} conversations
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="p-3 sm:p-4 border-b border-border/50 bg-card/30 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Mobile menu button */}
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden w-8 h-8 p-0"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-4 h-4" />
              </Button>
              
              {currentView === 'chat' && currentSession && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={startNewChat}
                    className="text-muted-foreground hover:text-foreground hidden sm:flex"
                  >
                    <Home className="w-3 h-3 sm:w-4 sm:h-4" />
                  </Button>
                  <Separator orientation="vertical" className="h-4 sm:h-6 hidden sm:block" />
                </>
              )}
              
              <h1 className="font-semibold text-sm sm:text-lg truncate">
                {currentView === 'welcome' ? 'Welcome' : currentChatName}
              </h1>
            </div>

            <div className="flex items-center gap-2">
              {currentView === 'chat' && currentSession && (
                <Badge variant="secondary" className="text-xs hidden sm:inline-flex">
                  {chatMessages.length} messages
                </Badge>
              )}
            </div>
          </div>
        </header>

        {/* Content Area */}
        {currentView === 'welcome' ? (
          <WelcomeScreen 
            userName={user?.name || user?.email || 'Friend'} 
            onStartChat={startChatFromWelcome}
          />
        ) : (
          <>
            {/* Messages */}
            <ScrollArea className="flex-1">
              <div className="p-3 sm:p-4 lg:p-6 max-w-4xl mx-auto w-full">
                {chatMessages.length === 0 && !assistantTyping ? (
                  <div className="flex items-center justify-center h-64 sm:h-96">
                    <div className="text-center px-4">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-r from-primary/20 to-purple-500/20 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                        <MessageCircle className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                      </div>
                      <h3 className="text-lg sm:text-xl font-medium mb-2">Start the conversation</h3>
                      <p className="text-sm sm:text-base text-muted-foreground">
                        Send a message to begin chatting with your AI companion
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    {chatMessages.map((message, index) => (
                      <MessageComponent
                        key={index}
                        message={message}
                        index={index}
                        ttsState={ttsStates[`msg-${index}`]} // Pass the TTS state
                        onPlayTTS={playTTS}
                        onCopy={copyText}
                      />
                    ))}
                    
                    {assistantTyping && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex gap-2 sm:gap-3 mb-4 sm:mb-6"
                      >
                        <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-gradient-to-r from-primary to-purple-500 flex items-center justify-center shadow-lg flex-shrink-0 mt-1">
                          <Brain className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                        </div>
                        <div className="bg-card border border-border/50 rounded-2xl">
                          <TypingIndicator />
                        </div>
                      </motion.div>
                    )}
                    
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="p-3 sm:p-4 lg:p-6 border-t border-border/50 bg-card/30 backdrop-blur-xl">
              <div className="max-w-4xl mx-auto">
                <div className="relative flex items-end gap-2 sm:gap-3">
                  {/* Enhanced STT Status Display */}
                  <AnimatePresence>
                    {(isRecording || isRecordingProcessing || isTranscribing) && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="absolute -top-14 left-0 right-0 flex items-center justify-center space-x-3 py-2 px-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 backdrop-blur-sm"
                      >
                        {isTranscribing ? (
                          <>
                            <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />
                            <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                              Processing speech...
                            </span>
                          </>
                        ) : isRecordingProcessing ? (
                          <>
                            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                            <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                              Finalizing recording...
                            </span>
                          </>
                        ) : (
                          <>
                            <motion.div
                              animate={{ scale: [1, 1.1, 1] }}
                              transition={{ duration: 1, repeat: Infinity }}
                            >
                              <Mic className="h-4 w-4 text-red-600" />
                            </motion.div>
                            <span className="text-sm text-red-600 dark:text-red-400 font-medium">
                              Listening... Speak clearly
                            </span>
                            <div className="flex items-center space-x-1">
                              {[...Array(5)].map((_, i) => (
                                <motion.div
                                  key={i}
                                  className="w-1 bg-red-500 rounded-full"
                                  animate={{
                                    height: [4, 8 + audioLevel * 12, 4],
                                  }}
                                  transition={{
                                    duration: 0.5,
                                    repeat: Infinity,
                                    delay: i * 0.1,
                                  }}
                                />
                              ))}
                            </div>
                          </>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="flex-1 relative">
                    <textarea
                      ref={inputRef}
                      className="w-full max-h-24 sm:max-h-32 p-3 sm:p-4 pr-16 sm:pr-20 rounded-2xl border border-border/50 bg-background/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none transition-all duration-200 placeholder:text-muted-foreground text-sm sm:text-base"
                      placeholder={
                        isRecording 
                          ? "Listening..." 
                          : isTranscribing 
                            ? "Transcribing..." 
                            : "Type your message or click mic to speak... (Press Enter to send)"
                      }
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      disabled={assistantTyping || isRecording || isTranscribing}
                      rows={1}
                      onInput={(e) => {
                        const target = e.target as HTMLTextAreaElement;
                        target.style.height = 'auto';
                        target.style.height = Math.min(target.scrollHeight, window.innerWidth < 640 ? 96 : 128) + 'px';
                      }}
                    />

                    {/* Voice Recorder - positioned inside the textarea */}
                    <div className="absolute right-12 sm:right-14 top-1/2 -translate-y-1/2">
                      <VoiceRecorder
                        isRecording={isRecording}
                        isProcessing={isRecordingProcessing || isTranscribing}
                        audioLevel={audioLevel}
                        onStartRecording={handleStartRecording}
                        onStopRecording={handleStopRecording}
                        onCancelRecording={handleCancelRecording}
                        disabled={assistantTyping}
                      />
                    </div>
                  </div>
                  
                  <Button
                    onClick={() => sendMessage()}
                    disabled={!messageInput.trim() || assistantTyping || isRecording || isTranscribing}
                    size="lg"
                    className={cn(
                      "w-10 h-10 sm:w-12 sm:h-12 p-0 rounded-xl transition-all duration-300 flex-shrink-0",
                      (messageInput.trim() && !assistantTyping && !isRecording && !isTranscribing)
                        ? "btn-gradient shadow-lg hover:shadow-xl"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {assistantTyping || isTranscribing ? (
                      <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Send className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
                    )}
                  </Button>
                </div>
                
                {/* Enhanced Footer Info */}
                <div className="flex items-center justify-center mt-3 sm:mt-4 gap-3 sm:gap-6 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1 sm:gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="hidden sm:inline">AI Online</span>
                    <span className="sm:hidden">Online</span>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-2">
                    <Mic className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                    <span className="hidden sm:inline">Voice Enabled</span>
                    <span className="sm:hidden">Voice</span>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-2">
                    <Shield className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                    <span className="hidden sm:inline">Secure & Private</span>
                    <span className="sm:hidden">Secure</span>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-2">
                    <Zap className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                    <span className="hidden sm:inline">Fast Responses</span>
                    <span className="sm:hidden">Fast</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </main>

      {/* Rename Modal */}
      <Dialog open={showRenameModal} onOpenChange={setShowRenameModal}>
        <DialogContent className="max-w-sm sm:max-w-lg mx-4">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">Rename Conversation</DialogTitle>
            <DialogDescription className="text-sm sm:text-base">
              Give your conversation a memorable name
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <input
              type="text"
              value={newChatName}
              onChange={(e) => setNewChatName(e.target.value)}
              className="w-full p-3 rounded-xl border border-border/50 bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm sm:text-base"
              placeholder="Enter conversation name"
              onKeyDown={(e) => e.key === 'Enter' && saveChatName()}
            />
            <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
              <Button 
                variant="ghost" 
                onClick={() => setShowRenameModal(false)}
                className="order-2 sm:order-1"
              >
                Cancel
              </Button>
              <Button 
                onClick={saveChatName} 
                disabled={!newChatName.trim()}
                className="order-1 sm:order-2"
              >
                Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ChatUI;
