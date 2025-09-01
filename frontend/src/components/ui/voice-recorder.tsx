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
      {/* Audio Level Visualization */}
      <AnimatePresence>
        {isRecording && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute inset-0 rounded-full"
            style={{
              background: `radial-gradient(circle, rgba(59, 130, 246, ${audioLevel * 0.3}) 0%, transparent 70%)`,
              transform: `scale(${1 + audioLevel * 0.5})`,
            }}
          />
        )}
      </AnimatePresence>

      {/* Pulsing Ring Animation for Recording */}
      <AnimatePresence>
        {isRecording && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: [0.7, 0.3, 0.7], 
              scale: [1, 1.2, 1] 
            }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="absolute inset-0 rounded-full border-2 border-blue-500"
          />
        )}
      </AnimatePresence>

      {/* Main Button */}
      <Button
        onClick={handleClick}
        disabled={disabled || isProcessing}
        size="lg"
        className={cn(
          "relative h-14 w-14 rounded-full transition-all duration-200 shadow-lg",
          isRecording 
            ? "bg-red-500 hover:bg-red-600 text-white border-2 border-red-400" 
            : "bg-blue-500 hover:bg-blue-600 text-white border-2 border-blue-400",
          isProcessing && "opacity-70 cursor-not-allowed",
          "hover:shadow-xl hover:scale-105 active:scale-95"
        )}
      >
        <AnimatePresence mode="wait">
          {isProcessing ? (
            <motion.div
              key="processing"
              initial={{ opacity: 0, rotate: 0 }}
              animate={{ opacity: 1, rotate: 360 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Loader2 className="h-6 w-6 animate-spin" />
            </motion.div>
          ) : isRecording ? (
            <motion.div
              key="recording"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-center"
            >
              <Square className="h-5 w-5 fill-current" />
            </motion.div>
          ) : (
            <motion.div
              key="idle"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
            >
              <Mic className="h-6 w-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </Button>

      {/* Status Indicator */}
      <AnimatePresence>
        {(isRecording || isProcessing) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-2 text-xs font-medium"
          >
            {isProcessing ? (
              <>
                <Radio className="h-3 w-3 text-blue-500 animate-pulse" />
                <span className="text-blue-600 dark:text-blue-400">Processing...</span>
              </>
            ) : isRecording ? (
              <>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <Volume2 className="h-3 w-3 text-red-500" />
                </motion.div>
                <span className="text-red-600 dark:text-red-400">Recording...</span>
              </>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
