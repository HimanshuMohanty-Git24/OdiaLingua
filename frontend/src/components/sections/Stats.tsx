import React, { useState, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import { Users, MessageSquare, Globe, TrendingUp, Heart, Clock } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

// Custom hook for counting animation
function useCountUp(end: number, duration: number = 2000, startCounting: boolean = false) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!startCounting) return

    let startTimestamp: number | null = null
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp
      const progress = Math.min((timestamp - startTimestamp) / duration, 1)
      setCount(Math.floor(progress * end))
      if (progress < 1) {
        requestAnimationFrame(step)
      }
    }
    requestAnimationFrame(step)
  }, [end, duration, startCounting])

  return count
}

function StatCard({ 
  icon, 
  number, 
  label, 
  description, 
  delay = 0,
  startCounting = false 
}: {
  icon: React.ReactNode
  number: number
  label: string
  description: string
  delay?: number
  startCounting?: boolean
}) {
  const animatedNumber = useCountUp(number, 2000, startCounting)
  
  // Format number with appropriate suffix
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`
    }
    return num.toString()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      viewport={{ once: true }}
      className="group"
    >
      <Card className="h-full border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/70 hover:border-primary/20 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1">
        <CardContent className="p-8 text-center">
          {/* Icon */}
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300">
            {icon}
          </div>
          
          {/* Number */}
          <div className="mb-3">
            <span className="text-4xl md:text-5xl font-bold text-gradient">
              {startCounting ? formatNumber(animatedNumber) : formatNumber(number)}
            </span>
            {number >= 1000 && startCounting && animatedNumber < number && (
              <span className="text-2xl text-muted-foreground">+</span>
            )}
          </div>
          
          {/* Label */}
          <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
            {label}
          </h3>
          
          {/* Description */}
          <p className="text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export function Stats() {
  const ref = React.useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [startCounting, setStartCounting] = useState(false)

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => setStartCounting(true), 500)
      return () => clearTimeout(timer)
    }
  }, [isInView])

  const stats = [
    {
      icon: <Users className="w-8 h-8" />,
      number: 15000,
      label: "Active Users",
      description: "Growing community of Odia speakers worldwide"
    },
    {
      icon: <MessageSquare className="w-8 h-8" />,
      number: 750000,
      label: "Conversations",
      description: "Meaningful exchanges powered by AI technology"
    },
    {
      icon: <Globe className="w-8 h-8" />,
      number: 45,
      label: "Countries",
      description: "Global reach connecting Odia diaspora"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      number: 99.9,
      label: "Uptime %",
      description: "Reliable service you can count on"
    },
    {
      icon: <Heart className="w-8 h-8" />,
      number: 4.9,
      label: "User Rating",
      description: "Exceptional user satisfaction score"
    },
    {
      icon: <Clock className="w-8 h-8" />,
      number: 24,
      label: "Response Time",
      description: "Average response time in milliseconds"
    }
  ]

  return (
    <section className="py-24 bg-muted/20 relative overflow-hidden" ref={ref}>
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(99,102,241,0.03)_50%,transparent_75%)] bg-[length:60px_60px]" />
      
      <div className="relative z-10 container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Trusted by <span className="text-gradient">Thousands</span> Worldwide
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our numbers speak for themselves. Join a growing community that's revolutionizing 
            how people interact with the Odia language.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <StatCard
              key={index}
              icon={stat.icon}
              number={stat.number}
              label={stat.label}
              description={stat.description}
              delay={index * 0.1}
              startCounting={startCounting}
            />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="inline-block p-6 rounded-2xl bg-gradient-to-r from-primary/10 to-purple-500/10 border border-primary/20 backdrop-blur-sm">
            <p className="text-muted-foreground mb-2">Join our growing community</p>
            <p className="text-2xl font-bold text-gradient">
              Be part of the language revolution
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
