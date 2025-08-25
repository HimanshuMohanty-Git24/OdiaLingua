import React from 'react'
import { motion } from 'framer-motion'
import { 
  Brain, MessageSquare, Globe, ArrowRight, Users, BookOpen, 
  GraduationCap, Building2, Globe2, Star, TrendingUp, 
  Shield, Zap, Heart, Award, ChevronRight, Play, Menu, X
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useNavigate } from 'react-router-dom'
import { ThemeToggle } from '@/components/layout/ThemeToggle'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'

const Index = () => {
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)

  const features = [
    {
      icon: <Brain className='w-5 h-5 sm:w-6 sm:h-6' />,
      title: "AI-Powered Conversations",
      description: "Experience natural, context-aware conversations in Odia with our advanced language model",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: <Globe className='w-5 h-5 sm:w-6 sm:h-6' />,
      title: "Real-Time Information",
      description: "Get instant access to current information with integrated search capabilities",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: <MessageSquare className='w-5 h-5 sm:w-6 sm:h-6' />,
      title: "Native Speech Synthesis",
      description: "Listen to authentic Odia pronunciation with our advanced text-to-speech technology",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: <Shield className='w-5 h-5 sm:w-6 sm:h-6' />,
      title: "Privacy First",
      description: "Your conversations are secure and private with end-to-end encryption",
      gradient: "from-orange-500 to-red-500"
    },
    {
      icon: <Zap className='w-5 h-5 sm:w-6 sm:h-6' />,
      title: "Lightning Fast",
      description: "Powered by cutting-edge infrastructure for instant responses",
      gradient: "from-yellow-500 to-orange-500"
    },
    {
      icon: <Heart className='w-5 h-5 sm:w-6 sm:h-6' />,
      title: "Cultural Preservation",
      description: "Helping preserve and promote the beautiful Odia language and culture",
      gradient: "from-pink-500 to-rose-500"
    }
  ]

  const testimonials = [
    {
      quote: "OdiaLingua has revolutionized how I connect with my roots. The AI understands context beautifully!",
      author: "Priya Sharma",
      role: "Software Engineer, San Francisco",
      avatar: "PS",
      rating: 5,
      icon: <Users className='w-4 h-4' />
    },
    {
      quote: "As a researcher studying Odia literature, this tool has been invaluable for my work.",
      author: "Dr. Rajesh Patel",
      role: "Academic Researcher, Oxford",
      avatar: "RP",
      rating: 5,
      icon: <BookOpen className='w-4 h-4' />
    },
    {
      quote: "The pronunciation feature helped me maintain my language skills while studying abroad.",
      author: "Ananya Das",
      role: "Graduate Student, MIT",
      avatar: "AD",
      rating: 5,
      icon: <GraduationCap className='w-4 h-4' />
    },
    {
      quote: "Perfect for our business communications in Odisha. Professional and reliable.",
      author: "Michael Chen",
      role: "Business Consultant, Singapore",
      avatar: "MC",
      rating: 5,
      icon: <Building2 className='w-4 h-4' />
    },
    {
      quote: "An excellent blend of technology and cultural preservation. Highly recommended!",
      author: "Dr. Kavitha Nair",
      role: "Linguistic Professor, JNU",
      avatar: "KN",
      rating: 5,
      icon: <Award className='w-4 h-4' />
    },
    {
      quote: "As a tour guide, this helps me communicate better with Odia-speaking tourists.",
      author: "Carlos Rodriguez",
      role: "Cultural Tour Guide, Mumbai",
      avatar: "CR",
      rating: 5,
      icon: <Globe2 className='w-4 h-4' />
    }
  ]

  const stats = [
    { number: "10,000+", label: "Active Users", icon: <Users className="w-4 h-4 sm:w-5 sm:h-5" /> },
    { number: "500K+", label: "Conversations", icon: <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" /> },
    { number: "25+", label: "Countries", icon: <Globe className="w-4 h-4 sm:w-5 sm:h-5" /> },
    { number: "99.9%", label: "Uptime", icon: <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" /> }
  ]

  return (
    <div className='min-h-screen bg-background'>
      {/* Navigation */}
      <nav className='fixed top-0 w-full z-50 bg-background/80 backdrop-blur-lg border-b border-border/50'>
        <div className='container mx-auto px-4'>
          <div className='flex items-center justify-between h-14 sm:h-16'>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className='font-display text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent'
            >
              OdiaLingua
            </motion.div>
            
            {/* Desktop Navigation */}
            <div className='hidden md:flex items-center gap-4'>
              <Button
                variant='ghost'
                className='text-muted-foreground hover:text-foreground'
                onClick={() => navigate('/contact')}
              >
                Contact
              </Button>
              <ThemeToggle />
              <Button
                size="sm"
                className='btn-gradient'
                onClick={() => navigate('/login')}
              >
                Get Started
              </Button>
            </div>

            {/* Mobile Navigation */}
            <div className='md:hidden flex items-center gap-2'>
              <ThemeToggle />
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

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className='md:hidden border-t border-border/50 py-4 space-y-3'
            >
              <Button
                variant='ghost'
                className='w-full justify-start text-muted-foreground hover:text-foreground'
                onClick={() => {
                  navigate('/contact')
                  setMobileMenuOpen(false)
                }}
              >
                Contact
              </Button>
              <Button
                className='w-full btn-gradient'
                onClick={() => {
                  navigate('/login')
                  setMobileMenuOpen(false)
                }}
              >
                Get Started
              </Button>
            </motion.div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 sm:pt-24 pb-12 sm:pb-16 overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 sm:w-96 sm:h-96 bg-gradient-to-bl from-primary/20 via-purple-500/10 to-transparent rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-0 left-0 w-64 h-64 sm:w-96 sm:h-96 bg-gradient-to-tr from-orange-500/20 via-primary/10 to-transparent rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 mb-6 sm:mb-8 bg-primary/10 border border-primary/20 rounded-full text-xs sm:text-sm font-medium text-primary backdrop-blur-sm"
            >
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="hidden sm:inline">ମୋ ଭାଷା, ମୋ ଗର୍ବ • AI-Powered • Live Now</span>
              <span className="sm:hidden">AI-Powered • Live Now</span>
            </motion.div>

            {/* Main heading */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight mb-4 sm:mb-6"
            >
              <span className="block">The First</span>
              <span className="block text-gradient">AI-Native</span>
              <span className="block">Odia Experience</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground mb-8 sm:mb-12 max-w-4xl mx-auto leading-relaxed font-light px-4"
            >
              Revolutionary AI technology meets the rich heritage of Odia language. 
              Chat naturally, learn effortlessly, and explore without limits.
            </motion.p>

            {/* CTA Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-12 sm:mb-16 px-4"
            >
              <Button
                size="lg"
                className="group btn-gradient text-base sm:text-lg px-8 sm:px-12 py-4 sm:py-6 rounded-2xl shadow-glow hover:shadow-glow-lg transition-all duration-300"
                onClick={() => navigate('/login')}
              >
                <Play className="mr-2 sm:mr-3 w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">Start Speaking Odia</span>
                <span className="sm:hidden">Get Started</span>
                <ArrowRight className="ml-2 sm:ml-3 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-base sm:text-lg px-8 sm:px-12 py-4 sm:py-6 rounded-2xl border-2 hover:bg-primary/5 transition-all duration-300"
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <span className="hidden sm:inline">Explore Features</span>
                <span className="sm:hidden">Features</span>
                <ChevronRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 sm:py-16 bg-card/30 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 rounded-full bg-primary/10 text-primary">
                  {stat.icon}
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-foreground mb-1 sm:mb-2">{stat.number}</div>
                <div className="text-xs sm:text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <Badge variant="secondary" className="mb-4 text-xs sm:text-sm">
              Powerful Features
            </Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
              Why Choose <span className="text-gradient">OdiaLingua</span>?
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto px-4">
              Experience the perfect blend of cutting-edge AI technology and deep cultural understanding
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="group h-full card-hover border-border/50 bg-card/50 backdrop-blur-sm">
                  <CardContent className="p-6 sm:p-8">
                    <div className={`inline-flex p-2.5 sm:p-3 rounded-2xl bg-gradient-to-br ${feature.gradient} mb-4 sm:mb-6`}>
                      <div className="text-white">
                        {feature.icon}
                      </div>
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 group-hover:text-primary transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 sm:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <Badge variant="secondary" className="mb-4 text-xs sm:text-sm">
              Testimonials
            </Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
              Loved by <span className="text-gradient">Thousands</span> Worldwide
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto px-4">
              Join our growing community of global learners discovering the beauty of Odia language
            </p>
          </motion.div>

          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full max-w-7xl mx-auto"
          >
            <CarouselContent className="-ml-2 sm:-ml-4">
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index} className="pl-2 sm:pl-4 md:basis-1/2 lg:basis-1/3">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="h-full"
                  >
                    <Card className="h-full border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
                      <CardContent className="p-6 sm:p-8">
                        <div className="flex items-center mb-3 sm:mb-4">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                        <blockquote className="text-sm sm:text-base text-foreground mb-4 sm:mb-6 leading-relaxed">
                          "{testimonial.quote}"
                        </blockquote>
                        <div className="flex items-center gap-3 sm:gap-4">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-semibold text-xs sm:text-sm">
                            {testimonial.avatar}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-sm sm:text-base text-foreground truncate">{testimonial.author}</div>
                            <div className="text-xs sm:text-sm text-muted-foreground flex items-center gap-2 mt-1">
                              {testimonial.icon}
                              <span className="truncate">{testimonial.role}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="hidden md:flex">
              <CarouselPrevious className="absolute -left-12 top-1/2" />
              <CarouselNext className="absolute -right-12 top-1/2" />
            </div>
          </Carousel>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-purple-500/10 to-primary/10" />
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(99,102,241,0.1)_50%,transparent_75%)] bg-[length:20px_20px]" />
        
        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
              Ready to Begin Your
              <br />
              <span className="text-gradient">Odia Journey?</span>
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground mb-8 sm:mb-12 max-w-2xl mx-auto px-4">
              Join thousands of users already experiencing the future of language technology
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
              <Button
                size="lg"
                className="btn-gradient text-base sm:text-lg px-8 sm:px-12 py-4 sm:py-6 rounded-2xl shadow-glow hover:shadow-glow-lg transition-all duration-300"
                onClick={() => navigate('/login')}
              >
                <span className="hidden sm:inline">Start Free Today</span>
                <span className="sm:hidden">Start Free</span>
                <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-base sm:text-lg px-8 sm:px-12 py-4 sm:py-6 rounded-2xl"
                onClick={() => navigate('/contact')}
              >
                Contact Us
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-card/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8 sm:py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 sm:gap-8">
            <div className="text-center md:text-left">
              <div className="font-display text-xl sm:text-2xl font-bold text-gradient mb-2">
                OdiaLingua
              </div>
              <p className="text-sm sm:text-base text-muted-foreground">
                Preserving culture through innovation
              </p>
            </div>
            
            <div className="flex items-center gap-6 sm:gap-8">
              <button
                onClick={() => navigate('/contact')}
                className="text-sm sm:text-base text-muted-foreground hover:text-foreground transition-colors"
              >
                Contact
              </button>
              <a
                href="https://github.com/HimanshuMohanty-Git24"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm sm:text-base text-muted-foreground hover:text-foreground transition-colors"
              >
                GitHub
              </a>
            </div>
          </div>
          
          <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-border/50 text-center">
            <p className="text-xs sm:text-sm text-muted-foreground">
              Made with ❤️ by{' '}
              <a
                href="https://github.com/HimanshuMohanty-Git24"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Himanshu Mohanty
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Index
