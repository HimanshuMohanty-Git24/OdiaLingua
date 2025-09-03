import React from 'react'
import { motion } from 'framer-motion'
import {
  Brain, MessageSquare, Globe, ArrowRight, Users, BookOpen,
  GraduationCap, Building2, Globe2, Star, TrendingUp,
  Shield, Zap, Heart, Award, ChevronRight, Play
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useNavigate } from 'react-router-dom'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { useTranslation } from 'react-i18next'
import { localizeNumber } from '@/lib/localization'

const Index = () => {
  const navigate = useNavigate()
  const { t, i18n } = useTranslation('home')

  const features = [
    {
      icon: <Brain className='w-5 h-5 sm:w-6 sm:h-6' />,
      title: t('features.aiConversations.title'),
      description: t('features.aiConversations.description'),
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: <Globe className='w-5 h-5 sm:w-6 sm:h-6' />,
      title: t('features.realTimeInfo.title'),
      description: t('features.realTimeInfo.description'),
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: <MessageSquare className='w-5 h-5 sm:w-6 sm:h-6' />,
      title: t('features.speechSynthesis.title'),
      description: t('features.speechSynthesis.description'),
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: <Shield className='w-5 h-5 sm:w-6 sm:h-6' />,
      title: t('features.privacy.title'),
      description: t('features.privacy.description'),
      gradient: "from-orange-500 to-red-500"
    },
    {
      icon: <Zap className='w-5 h-5 sm:w-6 sm:h-6' />,
      title: t('features.fast.title'),
      description: t('features.fast.description'),
      gradient: "from-yellow-500 to-orange-500"
    },
    {
      icon: <Heart className='w-5 h-5 sm:w-6 sm:h-6' />,
      title: t('features.culturalPreservation.title'),
      description: t('features.culturalPreservation.description'),
      gradient: "from-pink-500 to-rose-500"
    }
  ]

  const testimonials = [
    {
      quote: t('testimonials.t1.quote'),
      author: t('testimonials.t1.author'),
      role: t('testimonials.t1.role'),
      avatar: "PS",
      rating: 5,
      icon: <Users className='w-4 h-4' />
    },
    {
      quote: t('testimonials.t2.quote'),
      author: t('testimonials.t2.author'),
      role: t('testimonials.t2.role'),
      avatar: "RP",
      rating: 5,
      icon: <BookOpen className='w-4 h-4' />
    },
    {
      quote: t('testimonials.t3.quote'),
      author: t('testimonials.t3.author'),
      role: t('testimonials.t3.role'),
      avatar: "AD",
      rating: 5,
      icon: <GraduationCap className='w-4 h-4' />
    },
    {
      quote: t('testimonials.t4.quote'),
      author: t('testimonials.t4.author'),
      role: t('testimonials.t4.role'),
      avatar: "MC",
      rating: 5,
      icon: <Building2 className='w-4 h-4' />
    },
    {
      quote: t('testimonials.t5.quote'),
      author: t('testimonials.t5.author'),
      role: t('testimonials.t5.role'),
      avatar: "KN",
      rating: 5,
      icon: <Award className='w-4 h-4' />
    },
    {
      quote: t('testimonials.t6.quote'),
      author: t('testimonials.t6.author'),
      role: t('testimonials.t6.role'),
      avatar: "CR",
      rating: 5,
      icon: <Globe2 className='w-4 h-4' />
    }
  ]

  const stats = [
    { number: `${localizeNumber(10000, { locale: i18n.language as 'en' | 'or', style: 'unit' })}+`, label: t('stats.activeUsers', { value: '' }), icon: <Users className="w-4 h-4 sm:w-5 sm:h-5" /> },
    { number: `${localizeNumber(500000, { locale: i18n.language as 'en' | 'or', style: 'unit' })}+`, label: t('stats.conversations', { value: '' }), icon: <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" /> },
    { number: `${localizeNumber(25, { locale: i18n.language as 'en' | 'or' })}+`, label: t('stats.countries', { value: '' }), icon: <Globe className="w-4 h-4 sm:w-5 sm:h-5" /> },
    { number: `${localizeNumber(99.9, { locale: i18n.language as 'en' | 'or' })}%`, label: t('stats.uptime', { value: '' }), icon: <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" /> }
  ]

  return (
    <div className='min-h-screen bg-background'>
      <Header transparent />

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
              <span className="hidden sm:inline">{t('badge')}</span>
              <span className="sm:hidden">{t('badge')}</span>
            </motion.div>

            {/* Main heading */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight mb-4 sm:mb-6"
            >
              <span className="block">{t('hero.title1')}</span>
              <span className="block text-gradient">{t('hero.title2')}</span>
              <span className="block">{t('hero.title3')}</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground mb-8 sm:mb-12 max-w-4xl mx-auto leading-relaxed font-light px-4"
            >
              {t('hero.subtitle')}
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
                <span className="hidden sm:inline">{t('hero.cta1')}</span>
                <span className="sm:hidden">{t('common:getStarted', { ns: 'common' })}</span>
                <ArrowRight className="ml-2 sm:ml-3 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-base sm:text-lg px-8 sm:px-12 py-4 sm:py-6 rounded-2xl border-2 hover:bg-primary/5 transition-all duration-300"
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <span className="hidden sm:inline">{t('hero.cta2')}</span>
                <span className="sm:hidden">{t('common:features', { ns: 'common' })}</span>
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
              {t('features.powerfulFeatures')}
            </Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
              {t('features.title')} <span className="text-gradient">{t('common:logo', { ns: 'common' })}</span>?
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto px-4">
              {t('features.subtitle')}
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
              {t('testimonials.badge')}
            </Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
              {t('testimonials.title')}
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto px-4">
              {t('testimonials.subtitle')}
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
              {t('cta.title1')}
              <br />
              <span className="text-gradient">{t('cta.title2')}</span>
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground mb-8 sm:mb-12 max-w-2xl mx-auto px-4">
              {t('cta.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
              <Button
                size="lg"
                className="btn-gradient text-base sm:text-lg px-8 sm:px-12 py-4 sm:py-6 rounded-2xl shadow-glow hover:shadow-glow-lg transition-all duration-300"
                onClick={() => navigate('/login')}
              >
                <span className="hidden sm:inline">{t('common:startFreeToday', { ns: 'common' })}</span>
                <span className="sm:hidden">{t('common:startFree', { ns: 'common' })}</span>
                <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-base sm:text-lg px-8 sm:px-12 py-4 sm:py-6 rounded-2xl"
                onClick={() => navigate('/contact')}
              >
                {t('common:contactUs', { ns: 'common' })}
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default Index
