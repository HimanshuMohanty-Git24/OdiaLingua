import React from 'react'
import { motion } from 'framer-motion'
import { 
  Brain, MessageSquare, Globe, Shield, Zap, Heart,
  Sparkles, Code, Users, Award, CheckCircle, ArrowRight
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export function Features() {
  const mainFeatures = [
    {
      icon: <Brain className='w-7 h-7' />,
      title: "AI-Powered Conversations",
      description: "Experience natural, context-aware conversations in Odia with our advanced language model trained specifically for cultural nuances",
      gradient: "from-blue-500 to-cyan-500",
      benefits: ["Natural language understanding", "Cultural context awareness", "Continuous learning"]
    },
    {
      icon: <Globe className='w-7 h-7' />,
      title: "Real-Time Information",
      description: "Get instant access to current information with integrated search capabilities powered by multiple data sources",
      gradient: "from-green-500 to-emerald-500",
      benefits: ["Live data access", "Multiple sources", "Always up-to-date"]
    },
    {
      icon: <MessageSquare className='w-7 h-7' />,
      title: "Native Speech Synthesis",
      description: "Listen to authentic Odia pronunciation with our advanced text-to-speech technology developed for native speakers",
      gradient: "from-purple-500 to-pink-500",
      benefits: ["Authentic pronunciation", "Natural voice quality", "Regional dialect support"]
    }
  ]

  const secondaryFeatures = [
    {
      icon: <Shield className='w-5 h-5' />,
      title: "Privacy First",
      description: "End-to-end encryption ensures your conversations stay private"
    },
    {
      icon: <Zap className='w-5 h-5' />,
      title: "Lightning Fast",
      description: "Optimized infrastructure delivers instant responses"
    },
    {
      icon: <Heart className='w-5 h-5' />,
      title: "Cultural Preservation",
      description: "Helping preserve and promote Odia language heritage"
    },
    {
      icon: <Code className='w-5 h-5' />,
      title: "Open Source",
      description: "Built with transparency and community collaboration"
    },
    {
      icon: <Users className='w-5 h-5' />,
      title: "Community Driven",
      description: "Powered by feedback from native Odia speakers"
    },
    {
      icon: <Award className='w-5 h-5' />,
      title: "Quality Assured",
      description: "Rigorously tested for accuracy and reliability"
    }
  ]

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
    <section id="features" className="py-24 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-0 w-72 h-72 bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-72 h-72 bg-gradient-to-l from-orange-500/10 to-primary/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <Badge variant="secondary" className="mb-6 text-sm px-4 py-2">
            <Sparkles className="w-4 h-4 mr-2" />
            Powerful Features
          </Badge>
          
          <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
            Why Choose <span className="text-gradient">OdiaLingua</span>?
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Experience the perfect blend of cutting-edge AI technology and deep cultural understanding. 
            Built specifically for Odia speakers, by developers who understand the language's beauty and complexity.
          </p>
        </motion.div>

        {/* Main Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20"
        >
          {mainFeatures.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group"
            >
              <Card className="h-full border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/70 hover:border-primary/20 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2">
                <CardContent className="p-8">
                  {/* Icon with gradient background */}
                  <div className={`inline-flex p-4 rounded-3xl bg-gradient-to-br ${feature.gradient} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <div className="text-white">
                      {feature.icon}
                    </div>
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors duration-300">
                    {feature.title}
                  </h3>
                  
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    {feature.description}
                  </p>
                  
                  {/* Benefits list */}
                  <ul className="space-y-2">
                    {feature.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-center gap-3 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span className="text-muted-foreground">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Secondary Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16"
        >
          {secondaryFeatures.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group"
            >
              <Card className="h-full border-border/50 bg-card/30 backdrop-blur-sm hover:bg-card/50 hover:border-primary/20 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary/20 transition-colors duration-300">
                      {feature.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors duration-300">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-8 rounded-3xl bg-gradient-to-r from-primary/10 via-purple-500/10 to-primary/10 border border-primary/20 backdrop-blur-sm">
            <div className="text-center sm:text-left">
              <h3 className="text-2xl font-bold mb-2">Ready to experience the future?</h3>
              <p className="text-muted-foreground">Join thousands of users already using OdiaLingua</p>
            </div>
            <Button 
              size="lg"
              className="btn-gradient rounded-2xl px-8 py-4 shadow-glow hover:shadow-glow-lg transition-all duration-300 group"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
