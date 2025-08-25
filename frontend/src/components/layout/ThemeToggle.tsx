import React from 'react'
import { Moon, Sun, Monitor } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useTheme } from '@/contexts/ThemeProvider'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

export function ThemeToggle() {
  const { theme, setTheme, actualTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className={cn(
            "relative rounded-full border border-border/50 hover:border-border bg-background/50 backdrop-blur-sm transition-all duration-300 hover:shadow-glow",
            // Responsive sizing
            "w-8 h-8 p-0 sm:w-9 sm:h-9",
            // Enhanced mobile touch target
            "touch-manipulation active:scale-95",
            // Focus styles
            "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          )}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={actualTheme}
              initial={{ scale: 0, rotate: -90 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 90 }}
              transition={{ 
                duration: 0.3, 
                type: "spring", 
                stiffness: 200, 
                damping: 15 
              }}
              className="absolute inset-0 flex items-center justify-center"
            >
              {actualTheme === 'dark' ? (
                <Moon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              ) : (
                <Sun className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              )}
            </motion.div>
          </AnimatePresence>
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className={cn(
          "min-w-[140px] sm:w-48",
          // Mobile optimizations
          "mx-2 sm:mx-0",
          // Enhanced backdrop blur and styling
          "backdrop-blur-xl bg-card/95 border-border/50",
          // Animation improvements
          "animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
          // Shadow enhancements
          "shadow-xl shadow-black/5 dark:shadow-black/20"
        )}
        sideOffset={8}
      >
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <DropdownMenuItem 
            onClick={() => setTheme('light')}
            className={cn(
              "cursor-pointer transition-all duration-200",
              // Enhanced mobile touch targets
              "py-2.5 sm:py-2",
              // Hover and active states
              "hover:bg-muted/50 active:bg-muted/70",
              // Current theme styling
              theme === 'light' && "bg-primary/10 text-primary"
            )}
          >
            <motion.div
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.2, delay: 0.05 }}
              className="flex items-center w-full"
            >
              <Sun className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
              <span className="text-sm sm:text-base">Light</span>
              <AnimatePresence>
                {theme === 'light' && (
                  <motion.div 
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="ml-auto h-2 w-2 bg-primary rounded-full"
                  />
                )}
              </AnimatePresence>
            </motion.div>
          </DropdownMenuItem>

          <DropdownMenuItem 
            onClick={() => setTheme('dark')}
            className={cn(
              "cursor-pointer transition-all duration-200",
              // Enhanced mobile touch targets
              "py-2.5 sm:py-2",
              // Hover and active states
              "hover:bg-muted/50 active:bg-muted/70",
              // Current theme styling
              theme === 'dark' && "bg-primary/10 text-primary"
            )}
          >
            <motion.div
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.2, delay: 0.1 }}
              className="flex items-center w-full"
            >
              <Moon className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
              <span className="text-sm sm:text-base">Dark</span>
              <AnimatePresence>
                {theme === 'dark' && (
                  <motion.div 
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="ml-auto h-2 w-2 bg-primary rounded-full"
                  />
                )}
              </AnimatePresence>
            </motion.div>
          </DropdownMenuItem>

          <DropdownMenuItem 
            onClick={() => setTheme('system')}
            className={cn(
              "cursor-pointer transition-all duration-200",
              // Enhanced mobile touch targets
              "py-2.5 sm:py-2",
              // Hover and active states
              "hover:bg-muted/50 active:bg-muted/70",
              // Current theme styling
              theme === 'system' && "bg-primary/10 text-primary"
            )}
          >
            <motion.div
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.2, delay: 0.15 }}
              className="flex items-center w-full"
            >
              <Monitor className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
              <span className="text-sm sm:text-base">System</span>
              <AnimatePresence>
                {theme === 'system' && (
                  <motion.div 
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="ml-auto h-2 w-2 bg-primary rounded-full"
                  />
                )}
              </AnimatePresence>
            </motion.div>
          </DropdownMenuItem>
        </motion.div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
