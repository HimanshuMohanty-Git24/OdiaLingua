import React from 'react'
import { motion } from 'framer-motion'
import { Star, Quote, Users, BookOpen, GraduationCap, Building2, Award, Globe2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'

interface Testimonial {
  quote: string
  author: string
  role: string
  company?: string
  avatar: string
  rating: number
  icon: React.ReactNode
  gradient: string
}

export function Testimonials() {
  const testimonials: Testimonial[] = [
    {
      quote: "OdiaLingua has revolutionized how I connect with my roots while living abroad. The AI understands cultural context beautifully, making conversations feel natural and meaningful.",
      author: "Priya Sharma",
      role: "Software Engineer",
      company: "Google, San Francisco",
      avatar: "PS",
      rating: 5,
      icon: <Users className='w-4 h-4' />,
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      quote: "As a researcher studying Odia literature, this tool has been invaluable. The accuracy of language processing and cultural nuances is remarkable for academic work.",
      author: "Dr. Rajesh Patel",
      role: "Academic Researcher",
      company: "Oxford University",
      avatar: "RP",
      rating: 5,
      icon: <BookOpen className='w-4 h-4' />,
      gradient: "from-green-500 to-emerald-500"
    },
    {
      quote: "The pronunciation feature helped me maintain my language skills while studying abroad. It's like having a native speaker available 24/7 for practice and learning.",
      author: "Ananya Das",
      role: "Graduate Student",
      company: "MIT, Boston",
      avatar: "AD",
      rating: 5,
      icon: <GraduationCap className='w-4 h-4' />,
      gradient: "from-purple-500 to-pink-500"
    },
    {
      quote: "Perfect for our business communications in Odisha. The professional tone and accuracy have improved our client relationships significantly. Highly recommended!",
      author: "Michael Chen",
      role: "Business Consultant",
      company: "McKinsey, Singapore",
      avatar: "MC",
      rating: 5,
      icon: <Building2 className='w-4 h-4' />,
      gradient: "from-orange-500 to-red-500"
    },
    {
      quote: "An excellent blend of technology and cultural preservation. As a linguist, I'm impressed by how well it maintains the essence of Odia while being modern.",
      author: "Dr. Kavitha Nair",
      role: "Linguistic Professor",
      company: "JNU, New Delhi",
      avatar: "KN",
      rating: 5,
      icon: <Award className='w-4 h-4' />,
      gradient: "from-yellow-500 to-orange-500"
    },
    {
      quote: "As a cultural tour guide, this helps me communicate better with Odia-speaking tourists. The real-time translation and cultural context features are game-changers.",
      author: "Carlos Rodriguez",
      role: "Cultural Tour Guide",
      company: "Mumbai Tourism",
      avatar: "CR",
      rating: 5,
      icon: <Globe2 className='w-4 h-4' />,
      gradient: "from-pink-500 to-rose-500"
    }
  ]

  const averageRating = testimonials.reduce((acc, t) => acc + t.rating, 0) / testimonials.length

  return (
    <section className="py-24 bg-gradient-to-b from-background to-muted/20 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-gradient-to-l from-orange-500/10 to-primary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-2 mb-6">
            <Badge variant="secondary" className="text-sm px-4 py-2">
              <Quote className="w-4 h-4 mr-2" />
              Testimonials
            </Badge>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`w-4 h-4 ${i < Math.floor(averageRating) ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`} 
                />
              ))}
              <span className="ml-2 text-sm text-muted-foreground">
                {averageRating.toFixed(1)} average rating
              </span>
            </div>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
            Loved by <span className="text-gradient">Professionals</span> Worldwide
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            From students to researchers, from entrepreneurs to academics - discover why thousands 
            of professionals choose OdiaLingua for their language needs.
          </p>
        </motion.div>

        {/* Testimonials Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="max-w-7xl mx-auto"
        >
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="h-full group"
                  >
                    <Card className="h-full border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/70 hover:border-primary/20 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1">
                      <CardContent className="p-8">
                        {/* Quote icon and rating */}
                        <div className="flex items-center justify-between mb-6">
                          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <Quote className="w-6 h-6 text-primary" />
                          </div>
                          <div className="flex items-center gap-1">
                            {[...Array(testimonial.rating)].map((_, i) => (
                              <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                        </div>

                        {/* Quote */}
                        <blockquote className="text-foreground mb-6 leading-relaxed text-base">
                          "{testimonial.quote}"
                        </blockquote>

                        {/* Author Info */}
                        <div className="flex items-center gap-4">
                          {/* Avatar */}
                          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${testimonial.gradient} flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                            {testimonial.avatar}
                          </div>
                          
                          {/* Details */}
                          <div className="flex-1">
                            <div className="font-semibold text-foreground text-lg group-hover:text-primary transition-colors duration-300">
                              {testimonial.author}
                            </div>
                            <div className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                              <div className="w-4 h-4 text-muted-foreground">
                                {testimonial.icon}
                              </div>
                              <span>{testimonial.role}</span>
                            </div>
                            {testimonial.company && (
                              <div className="text-xs text-muted-foreground mt-1 font-medium">
                                {testimonial.company}
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>
            
            {/* Navigation */}
            <div className="hidden md:flex">
              <CarouselPrevious className="absolute -left-12 top-1/2 w-12 h-12 border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card hover:border-primary/20 transition-all duration-300" />
              <CarouselNext className="absolute -right-12 top-1/2 w-12 h-12 border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card hover:border-primary/20 transition-all duration-300" />
            </div>
          </Carousel>
        </motion.div>

        {/* Bottom stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-gradient mb-2">98%</div>
              <div className="text-muted-foreground">Satisfaction Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gradient mb-2">15,000+</div>
              <div className="text-muted-foreground">Happy Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gradient mb-2">45+</div>
              <div className="text-muted-foreground">Countries Served</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
