import React from 'react'
import { motion } from 'framer-motion'
import { 
  Heart, Github, Twitter, Linkedin, Globe, 
  Mail, ArrowRight, Sparkles, ExternalLink
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export function Footer() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  
  const socialLinks = [
    {
      name: 'GitHub',
      icon: <Github className="w-5 h-5" />,
      href: 'https://github.com/HimanshuMohanty-Git24',
      color: 'hover:text-gray-900 dark:hover:text-gray-100'
    },
    {
      name: 'Twitter',
      icon: <Twitter className="w-5 h-5" />,
      href: 'https://twitter.com/CodingHima',
      color: 'hover:text-blue-500'
    },
    {
      name: 'LinkedIn',
      icon: <Linkedin className="w-5 h-5" />,
      href: 'https://www.linkedin.com/in/himanshumohanty/',
      color: 'hover:text-blue-600'
    },
    {
      name: 'Portfolio',
      icon: <Globe className="w-5 h-5" />,
      href: 'https://himanshumohanty.netlify.app/',
      color: 'hover:text-green-600'
    }
  ]

  const quickLinks = [
    { name: t('footer.quickLinks.features'), href: '#features' },
    { name: t('footer.quickLinks.about'), href: '#about' },
    { name: t('footer.quickLinks.contact'), href: '/contact' },
    { name: t('footer.quickLinks.privacy'), href: '/privacy' },
  ]

  const scrollToSection = (href: string) => {
    if (href.startsWith('#')) {
      const element = document.querySelector(href)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    } else {
      navigate(href)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  }

  return (
    <footer className="relative overflow-hidden bg-gradient-to-b from-background to-muted/30 border-t border-border/50">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-gradient-to-r from-primary/5 to-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-gradient-to-l from-orange-500/5 to-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        {/* Newsletter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="border-b border-border/50 py-16"
        >
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 bg-primary/10 border border-primary/20 rounded-full text-sm font-medium text-primary backdrop-blur-sm">
                <Sparkles className="w-4 h-4" />
                <span>{t('badge.stayUpdated')}</span>
              </div>
              
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                {t('footer.newsletter.readyToRevolutionize')} <span className="text-gradient">{t('footer.newsletter.odiaExperience')}</span>?
              </h3>
              
              <p className="text-muted-foreground mb-8 leading-relaxed">
                {t('footer.newsletter.joinThousands')}
              </p>
              
              <Button
                size="lg"
                onClick={() => navigate('/login')}
                className="btn-gradient rounded-2xl px-8 py-4 shadow-glow hover:shadow-glow-lg transition-all duration-300 group"
              >
                {t('footer.newsletter.getStartedFree')}
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Main Footer Content */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="container mx-auto px-4 py-16"
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Brand Section */}
            <motion.div variants={itemVariants} className="lg:col-span-1">
              <div className="mb-8">
                <div className="font-display text-3xl font-bold text-gradient mb-4">
                  {t('logo')}
                </div>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  {t('footer.brand.tagline')}
                </p>
                
                {/* Mission Statement */}
                <div className="p-4 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 mb-6">
                  <p className="text-sm text-muted-foreground italic">
                    "{t('footer.brand.mission')}"
                  </p>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex items-center gap-4">
                {socialLinks.map((link, index) => (
                  <motion.a
                    key={link.name}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-12 h-12 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 flex items-center justify-center text-muted-foreground ${link.color} transition-all duration-300 hover:border-primary/20 hover:shadow-glow`}
                    title={link.name}
                  >
                    {link.icon}
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Quick Links */}
            <motion.div variants={itemVariants} className="lg:col-span-1">
              <h3 className="font-semibold text-lg mb-6 text-foreground">{t('footer.quickLinks.title')}</h3>
              <nav className="space-y-4">
                {quickLinks.map((link, index) => (
                  <motion.button
                    key={link.name}
                    onClick={() => scrollToSection(link.href)}
                    whileHover={{ x: 4 }}
                    className="block text-muted-foreground hover:text-foreground transition-colors duration-200 group"
                  >
                    <span className="flex items-center gap-2">
                      {link.name}
                      {link.href.startsWith('http') && (
                        <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                      )}
                    </span>
                  </motion.button>
                ))}
              </nav>
            </motion.div>

            {/* Contact Info */}
            <motion.div variants={itemVariants} className="lg:col-span-1">
              <h3 className="font-semibold text-lg mb-6 text-foreground">{t('footer.getInTouch.title')}</h3>
              
              <div className="space-y-4 mb-8">
                <motion.a
                  href="mailto:codehimanshu24@gmail.com"
                  whileHover={{ x: 4 }}
                  className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors duration-200 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 flex items-center justify-center group-hover:bg-primary/10 group-hover:border-primary/20 transition-all duration-300">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">{t('footer.getInTouch.email')}</div>
                    <div className="text-xs">codehimanshu24@gmail.com</div>
                  </div>
                </motion.a>
              </div>

              {/* Tech Stack */}
              <div className="p-4 rounded-2xl bg-card/30 backdrop-blur-sm border border-border/50">
                <h4 className="font-medium text-sm mb-3 text-foreground">{t('footer.getInTouch.builtWith')}</h4>
                <div className="flex flex-wrap gap-2">
                  {['React', 'TypeScript', 'Tailwind', 'Framer Motion', 'Appwrite'].map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-1 text-xs bg-muted/50 text-muted-foreground rounded-lg"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="border-t border-border/50 py-8"
        >
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-sm text-muted-foreground text-center md:text-left">
                © 2025 OdiaLingua. Made with{' '}
                <Heart className="inline w-4 h-4 text-red-500 mx-1" />{' '}
                by{' '}
                <a
                  href="https://github.com/HimanshuMohanty-Git24"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline font-medium"
                >
                  Himanshu Mohanty
                </a>
              </div>
              
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <button 
                  onClick={() => scrollToSection('/privacy')}
                  className="hover:text-foreground transition-colors duration-200"
                >
                  {t('footer.privacyPolicy')}
                </button>
                <button 
                  onClick={() => scrollToSection('/terms')}
                  className="hover:text-foreground transition-colors duration-200"
                >
                  {t('footer.termsOfService')}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
