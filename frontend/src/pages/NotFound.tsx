import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Home, Search, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate, useLocation } from "react-router-dom";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

const NotFound = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const suggestions = [
    {
      icon: <Home className="w-4 h-4 sm:w-5 sm:h-5" />,
      title: "Go Home",
      description: "Return to the main page",
      action: () => navigate("/"),
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <Search className="w-4 h-4 sm:w-5 sm:h-5" />,
      title: "Try Chat",
      description: "Start using OdiaLingua",
      action: () => navigate("/login"),
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: <Compass className="w-4 h-4 sm:w-5 sm:h-5" />,
      title: "Contact Us",
      description: "Get help from our team",
      action: () => navigate("/contact"),
      color: "from-purple-500 to-pink-500"
    }
  ];

  React.useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Navigation */}
      <nav className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <button
              onClick={() => navigate("/")}
              className="inline-flex items-center gap-2 sm:gap-3 font-display text-lg sm:text-xl font-bold text-foreground hover:text-primary transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-1 transition-transform duration-300" />
              <span className="hidden sm:inline">OdiaLingua</span>
              <span className="sm:hidden">Back</span>
            </button>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-64 h-64 sm:w-96 sm:h-96 bg-gradient-to-bl from-primary/20 via-purple-500/10 to-transparent rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-0 left-0 w-64 h-64 sm:w-96 sm:h-96 bg-gradient-to-tr from-orange-500/20 via-primary/10 to-transparent rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        </div>

        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* 404 Animation */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-6 sm:mb-8"
            >
              <div className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold text-gradient mb-3 sm:mb-4">
                404
              </div>
              <div className="w-24 sm:w-32 h-1 bg-gradient-to-r from-primary to-purple-500 mx-auto rounded-full mb-6 sm:mb-8" />
            </motion.div>

            {/* Error Message */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mb-8 sm:mb-12"
            >
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
                Oops! Page Not Found
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto px-4">
                The page you're looking for seems to have wandered off into the digital wilderness. 
                But don't worry, we'll help you find your way back!
              </p>
              
              {/* Debug info for attempted path */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="mt-4 sm:mt-6 text-xs sm:text-sm text-muted-foreground"
              >
                <span className="font-mono bg-muted px-2 sm:px-3 py-1 rounded-lg break-all">
                  {location.pathname}
                </span>
              </motion.div>
            </motion.div>

            {/* Action Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12"
            >
              {suggestions.map((suggestion, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="cursor-pointer"
                  onClick={suggestion.action}
                >
                  <Card className="h-full border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/70 hover:border-primary/20 transition-all duration-300 group">
                    <CardContent className="p-4 sm:p-6 text-center">
                      <div className={`inline-flex p-2.5 sm:p-3 rounded-2xl bg-gradient-to-br ${suggestion.color} mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300`}>
                        <div className="text-white">
                          {suggestion.icon}
                        </div>
                      </div>
                      <h3 className="font-semibold text-base sm:text-lg mb-2 group-hover:text-primary transition-colors duration-300">
                        {suggestion.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        {suggestion.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            {/* Primary CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
            >
              <Button
                size="lg"
                className="btn-gradient text-sm sm:text-lg px-6 sm:px-8 py-4 sm:py-6 rounded-2xl shadow-glow hover:shadow-glow-lg transition-all duration-300"
                onClick={() => navigate("/")}
              >
                <Home className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Take Me Home
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-card/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 sm:py-6">
          <div className="text-center text-xs sm:text-sm text-muted-foreground">
            <p>
              If you believe this is an error, please{" "}
              <button
                onClick={() => navigate('/contact')}
                className="text-primary hover:underline"
              >
                contact us
              </button>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default NotFound;
