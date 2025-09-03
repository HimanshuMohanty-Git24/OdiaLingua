import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { loginWithGoogle, getUser } from "@/auth";
import { toast } from "react-hot-toast";
import { ArrowLeft, Chrome, Sparkles, Shield, Zap } from "lucide-react";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useTranslation } from "react-i18next";

const Login = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const checkExistingAuth = async () => {
      try {
        const user = await getUser();
        if (user) {
          navigate("/chat", { replace: true });
          return;
        }
      } catch (error) {
        console.log("No existing authentication found");
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkExistingAuth();
  }, [navigate]);

  const handleGoogleLogin = async () => {
    if (isLoading) return;

    setIsLoading(true);
    
    try {
      toast.loading(t('login.connectingGoogle'), { id: "login" });
      await loginWithGoogle();
      toast.dismiss("login");
    } catch (error: any) {
      console.error("Google login failed:", error);
      toast.error(error.message || t('login.loginFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-6 h-6 sm:w-8 sm:h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-sm sm:text-base text-muted-foreground">{t('login.checkingAuth')}</p>
        </div>
      </div>
    );
  }

  const benefits = [
    {
      icon: <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />,
      title: t('login.benefits.aiConversations.title'),
      description: t('login.benefits.aiConversations.description')
    },
    {
      icon: <Shield className="w-4 h-4 sm:w-5 sm:h-5" />,
      title: t('login.benefits.secure.title'),
      description: t('login.benefits.secure.description')
    },
    {
      icon: <Zap className="w-4 h-4 sm:w-5 sm:h-5" />,
      title: t('login.benefits.fast.title'),
      description: t('login.benefits.fast.description')
    }
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-64 h-64 sm:w-96 sm:h-96 bg-gradient-to-bl from-primary/20 via-purple-500/10 to-transparent rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-0 left-0 w-64 h-64 sm:w-96 sm:h-96 bg-gradient-to-tr from-orange-500/20 via-primary/10 to-transparent rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between p-4 sm:p-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 font-display text-lg sm:text-xl font-bold text-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="hidden sm:inline">{t('logo')}</span>
          <span className="sm:hidden">{t('login.back')}</span>
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <LanguageToggle />
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-8 sm:py-12">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Side - Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6 sm:space-y-8 order-2 lg:order-1"
          >
            <div>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 mb-4 sm:mb-6 bg-primary/10 border border-primary/20 rounded-full text-xs sm:text-sm font-medium text-primary backdrop-blur-sm"
              >
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="hidden sm:inline">{t('login.badge.readyExperience')}</span>
                <span className="sm:hidden">{t('login.badge.readyStart')}</span>
              </motion.div>
              
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 sm:mb-6">
                <span className="block">{t('login.welcome.title')}</span>
                <span className="block text-gradient">{t('logo')}</span>
              </h1>
              
              <p className="text-base sm:text-lg lg:text-xl text-muted-foreground leading-relaxed mb-6 sm:mb-8 max-w-xl">
                {t('login.welcome.subtitle')}
              </p>
            </div>

            {/* Benefits */}
            <div className="space-y-3 sm:space-y-4">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                  className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50"
                >
                  <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    {benefit.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm sm:text-base text-foreground mb-1">{benefit.title}</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">{benefit.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Side - Login Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex justify-center order-1 lg:order-2"
          >
            <Card className="w-full max-w-md border-border/50 bg-card/80 backdrop-blur-sm shadow-2xl">
              <CardContent className="p-6 sm:p-8">
                <div className="text-center mb-6 sm:mb-8">
                  <h2 className="text-xl sm:text-2xl font-bold mb-2">{t('login.form.signInTitle')}</h2>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    {t('login.form.signInSubtitle')}
                  </p>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={isLoading ? 'loading' : 'idle'}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Button
                      size="lg"
                      className="w-full h-12 sm:h-14 text-sm sm:text-base font-semibold bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 disabled:opacity-60"
                      onClick={handleGoogleLogin}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mr-3" />
                          <span>{t('login.form.connecting')}</span>
                        </>
                      ) : (
                        <>
                          <Chrome className="w-4 h-4 sm:w-5 sm:h-5 mr-3" />
                          <span>{t('login.form.continueGoogle')}</span>
                        </>
                      )}
                    </Button>
                  </motion.div>
                </AnimatePresence>

                <div className="mt-6 sm:mt-8 text-center">
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    {t('login.form.termsText')}
                    <br className="hidden sm:block" />
                    {t('login.form.secureText')}
                  </p>
                </div>

                {/* Trust indicators */}
                <div className="mt-4 sm:mt-6 flex items-center justify-center gap-3 sm:gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    <span>{t('login.trust.secure')}</span>
                  </div>
                  <div className="w-1 h-1 bg-muted-foreground rounded-full" />
                  <div className="flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    <span>{t('login.trust.fast')}</span>
                  </div>
                  <div className="w-1 h-1 bg-muted-foreground rounded-full" />
                  <div className="flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    <span>{t('login.trust.modern')}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Login;
