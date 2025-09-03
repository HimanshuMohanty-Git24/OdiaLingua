import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Mail, 
  Github, 
  Twitter, 
  Globe, 
  Linkedin, 
  Send, 
  ArrowLeft,
  MessageSquare,
  Heart,
  Star,
  CheckCircle,
  Menu,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useTranslation } from "react-i18next";
import toast from 'react-hot-toast';

const Contact = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!formData.subject.trim() || !formData.message.trim()) {
      toast.error(t('contact.form.fillFields'));
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mailtoLink = `mailto:codehimanshu24@gmail.com?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(formData.message)}`;
      window.location.href = mailtoLink;
      
      toast.success(t('contact.form.emailOpened'));
      setFormData({ subject: '', message: '' });
    } catch (error) {
      toast.error(t('contact.form.errorMessage'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const socialLinks = [
    {
      icon: <Github className="w-4 h-4 sm:w-5 sm:h-5" />,
      href: "https://github.com/HimanshuMohanty-Git24",
      label: t('contact.social.links.github.label'),
      color: "hover:text-gray-900 dark:hover:text-gray-100",
      description: t('contact.social.links.github.description')
    },
    {
      icon: <Twitter className="w-4 h-4 sm:w-5 sm:h-5" />,
      href: "https://twitter.com/CodingHima",
      label: t('contact.social.links.twitter.label'),
      color: "hover:text-blue-500",
      description: t('contact.social.links.twitter.description')
    },
    {
      icon: <Globe className="w-4 h-4 sm:w-5 sm:h-5" />,
      href: "https://himanshumohanty.netlify.app/",
      label: t('contact.social.links.portfolio.label'),
      color: "hover:text-green-600",
      description: t('contact.social.links.portfolio.description')
    },
    {
      icon: <Linkedin className="w-4 h-4 sm:w-5 sm:h-5" />,
      href: "https://www.linkedin.com/in/himanshumohanty/",
      label: t('contact.social.links.linkedin.label'),
      color: "hover:text-blue-600",
      description: t('contact.social.links.linkedin.description')
    },
  ];

  const features = [
    {
      icon: <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />,
      title: t('contact.features.quickResponse.title'),
      description: t('contact.features.quickResponse.description')
    },
    {
      icon: <Heart className="w-4 h-4 sm:w-5 sm:h-5" />,
      title: t('contact.features.collaborate.title'),
      description: t('contact.features.collaborate.description')
    },
    {
      icon: <Star className="w-4 h-4 sm:w-5 sm:h-5" />,
      title: t('contact.features.quality.title'),
      description: t('contact.features.quality.description')
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 sm:gap-3 font-display text-lg sm:text-xl font-bold text-foreground hover:text-primary transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-1 transition-transform duration-300" />
              <span className="hidden sm:inline">{t('logo')}</span>
              <span className="sm:hidden">{t('contact.navigation.back')}</span>
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden sm:flex items-center gap-2">
              <ThemeToggle />
              <LanguageToggle />
            </div>

            {/* Mobile Navigation */}
            <div className="sm:hidden flex items-center gap-2">
              <ThemeToggle />
              <LanguageToggle />
              <Button
                variant="ghost"
                size="sm"
                className="w-8 h-8 p-0"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-12 sm:py-16 lg:py-20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-64 h-64 sm:w-96 sm:h-96 bg-gradient-to-bl from-primary/20 via-purple-500/10 to-transparent rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-0 left-0 w-64 h-64 sm:w-96 sm:h-96 bg-gradient-to-tr from-orange-500/20 via-primary/10 to-transparent rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        </div>

        <div className="relative z-10 container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 mb-6 sm:mb-8 bg-primary/10 border border-primary/20 rounded-full text-xs sm:text-sm font-medium text-primary backdrop-blur-sm"
            >
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="hidden sm:inline">{t('contact.badge.available')}</span>
              <span className="sm:hidden">{t('contact.badge.availableShort')}</span>
            </motion.div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 sm:mb-6">
              <span className="block">{t('contact.hero.title1')}</span>
              <span className="block text-gradient">{t('contact.hero.title2')}</span>
              <span className="block">{t('contact.hero.title3')}</span>
            </h1>
            
            <p className="text-base sm:text-lg lg:text-xl text-muted-foreground leading-relaxed mb-8 sm:mb-12 max-w-3xl mx-auto px-4">
              {t('contact.hero.greeting')} <span className="font-semibold text-foreground">{t('contact.hero.name')}</span> 👋
              <br className="hidden sm:block" />
              {t('contact.hero.description')}
            </p>

            {/* Quick features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-12 sm:mb-16">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                  className="flex flex-col items-center p-4 sm:p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3 sm:mb-4 text-primary">
                    {feature.icon}
                  </div>
                  <h3 className="font-semibold text-sm sm:text-base text-foreground mb-2">{feature.title}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground text-center">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="order-2 lg:order-1"
            >
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-xl">
                <CardContent className="p-6 sm:p-8">
                  <div className="mb-6 sm:mb-8">
                    <Badge variant="secondary" className="mb-3 sm:mb-4 text-xs sm:text-sm">
                      <Mail className="w-3 h-3 mr-2" />
                      {t('contact.badge.getInTouch')}
                    </Badge>
                    <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">{t('contact.form.title')}</h2>
                    <p className="text-sm sm:text-base text-muted-foreground">
                      {t('contact.form.subtitle')}
                    </p>
                  </div>

                  <form onSubmit={handleEmailSubmit} className="space-y-4 sm:space-y-6">
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-2">
                        {t('contact.form.subject')}
                      </label>
                      <input
                        type="text"
                        name="subject"
                        id="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        className="w-full rounded-xl border border-input bg-background px-3 sm:px-4 py-2 sm:py-3 text-sm ring-offset-background transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        placeholder={t('contact.form.subjectPlaceholder')}
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                        {t('contact.form.message')}
                      </label>
                      <textarea
                        name="message"
                        id="message"
                        rows={6}
                        value={formData.message}
                        onChange={handleInputChange}
                        className="w-full rounded-xl border border-input bg-background px-3 sm:px-4 py-2 sm:py-3 text-sm ring-offset-background transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
                        placeholder={t('contact.form.messagePlaceholder')}
                        required
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full btn-gradient text-sm sm:text-base py-4 sm:py-6 rounded-xl shadow-glow hover:shadow-glow-lg transition-all duration-300"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          {t('contact.form.sending')}
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          {t('contact.form.sendMessage')}
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>

            {/* Social Links & Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-6 sm:space-y-8 order-1 lg:order-2"
            >
              <div>
                <Badge variant="secondary" className="mb-3 sm:mb-4 text-xs sm:text-sm">
                  <Heart className="w-3 h-3 mr-2" />
                  {t('contact.badge.connectWithMe')}
                </Badge>
                <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">{t('contact.social.title')}</h2>
                
                <div className="grid gap-3 sm:gap-4">
                  {socialLinks.map((link, index) => (
                    <motion.a
                      key={index}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="group flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 hover:bg-card/70 hover:border-primary/20 transition-all duration-300"
                    >
                      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors duration-300`}>
                        {link.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm sm:text-base text-foreground group-hover:text-primary transition-colors duration-300">
                          {link.label}
                        </h3>
                        <p className="text-xs sm:text-sm text-muted-foreground truncate">{link.description}</p>
                      </div>
                    </motion.a>
                  ))}
                </div>
              </div>

              {/* Additional Info */}
              <Card className="border-border/50 bg-card/30 backdrop-blur-sm">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                    <h3 className="font-semibold text-sm sm:text-base">{t('contact.badge.quickFacts')}</h3>
                  </div>
                  <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0" />
                      {t('contact.facts.location')}
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0" />
                      {t('contact.facts.role')}
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0" />
                      {t('contact.facts.passion')}
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0" />
                      {t('contact.facts.remote')}
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-card/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6 sm:py-8">
          <div className="text-center text-xs sm:text-sm text-muted-foreground">
            <p>
              {t('contact.footer.builtWith')}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Contact;
