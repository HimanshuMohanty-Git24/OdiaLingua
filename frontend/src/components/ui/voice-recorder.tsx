import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Square, Loader2, Volume2, Radio } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface VoiceRecorderProps {
  isRecording: boolean;
  isProcessing: boolean;
  audioLevel: number;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onCancelRecording: () => void;
  disabled?: boolean;
  className?: string;
}

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
  isRecording,
  isProcessing,
  audioLevel,
  onStartRecording,
  onStopRecording,
  onCancelRecording,
  disabled = false,
  className,
}) => {
  const handleClick = () => {
    if (isProcessing) return;
    if (isRecording) {
      onStopRecording();
    } else {
      onStartRecording();
    }
  };

  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      {/* Audio Level Visualization - Responsive */}
      <AnimatePresence>
        {isRecording && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute inset-0 rounded-full"
            style={{
              background: `radial-gradient(circle, rgba(239, 68, 68, ${audioLevel * 0.4}) 0%, transparent 60%)`,
              transform: `scale(${1 + audioLevel * 0.3})`,
            }}
          />
        )}
      </AnimatePresence>

      {/* Subtle Pulsing Ring for Recording State */}
      <AnimatePresence>
        {isRecording && (
          <motion.div
            initial={{ opacity: 0, scale: 1 }}
            animate={{ 
              opacity: [0.5, 0.2, 0.5], 
              scale: [1, 1.15, 1] 
            }}
            exit={{ opacity: 0, scale: 1 }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="absolute inset-0 rounded-full border border-red-400/60"
          />
        )}
      </AnimatePresence>

      {/* Main Button - Modern & Responsive */}
      <Button
        onClick={handleClick}
        disabled={disabled || isProcessing}
        variant="ghost"
        size="sm"
        className={cn(
          "relative rounded-full transition-all duration-300 border-0 shadow-none",
          "h-8 w-8 sm:h-9 sm:w-9 p-0", // Responsive sizing
          "hover:scale-110 active:scale-95",
          isRecording 
            ? "bg-red-500/90 hover:bg-red-500 text-white shadow-lg shadow-red-500/25" 
            : isProcessing
            ? "bg-blue-500/90 text-white shadow-lg shadow-blue-500/25"
            : "bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground",
          disabled && "opacity-50 cursor-not-allowed hover:scale-100",
          "backdrop-blur-sm"
        )}
      >
        <AnimatePresence mode="wait">
          {isProcessing ? (
            <motion.div
              key="processing"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
            >
              <Loader2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin" />
            </motion.div>
          ) : isRecording ? (
            <motion.div
              key="recording"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                rotate: [0, 90, 180, 270, 360]
              }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ 
                duration: 0.2,
                rotate: { duration: 2, repeat: Infinity, ease: "linear" }
              }}
              className="flex items-center justify-center"
            >
              <Square className="h-3 w-3 sm:h-3.5 sm:w-3.5 fill-current rounded-sm" />
            </motion.div>
          ) : (
            <motion.div
              key="idle"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Mic className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Recording indicator dot */}
        <AnimatePresence>
          {isRecording && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: [1, 0.3, 1], 
                scale: 1 
              }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ 
                opacity: { duration: 1, repeat: Infinity },
                scale: { duration: 0.2 }
              }}
              className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full shadow-sm"
            />
          )}
        </AnimatePresence>
      </Button>
    </div>
  );
};
