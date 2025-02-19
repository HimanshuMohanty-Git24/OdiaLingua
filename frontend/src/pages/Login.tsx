// src/pages/Login.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { loginWithGoogle } from "@/auth";

const Login = () => {
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    await loginWithGoogle();
    // In most cases, Appwrite will redirect automatically via the success URL.
    // If needed, you can call navigate("/chat") here after checking user status.
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-neutral-100">
      <div className="relative container mx-auto px-4 pt-20 pb-32 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent-warm/20 rounded-full blur-3xl -z-10 animate-float" />
        <div
          className="absolute bottom-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10 animate-float"
          style={{ animationDelay: "2s" }}
        />
        <nav className="flex justify-between items-center mb-16">
          <button
            onClick={() => navigate("/")}
            className="font-display text-2xl font-bold text-neutral-900 hover:text-primary-dark transition-colors"
          >
            OdiaLingua
          </button>
        </nav>
        <div className="max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white/80 backdrop-blur-sm p-6 md:p-8 rounded-2xl shadow-lg"
          >
            <h2 className="font-display text-2xl md:text-3xl font-bold text-neutral-900 mb-4 md:mb-6 text-center">
              Welcome to OdiaLingua
            </h2>
            <p className="text-neutral-600 mb-6 md:mb-8 text-center text-sm md:text-base">
              Sign in with Google to start your Odia learning journey
            </p>
            <Button
              className="w-full bg-primary hover:bg-primary-dark transition-colors duration-300 flex items-center justify-center gap-2"
              size="lg"
              onClick={handleGoogleLogin}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Login;
