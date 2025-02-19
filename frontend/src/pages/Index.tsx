import React, { useState } from "react";
import { motion } from "framer-motion";
import Contact from "./pages/Contact";
import {
  Brain,
  MessageSquare,
  Globe,
  ArrowRight,
  Users,
  BookOpen,
  GraduationCap,
  Building2,
  Globe2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const Index = () => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const features = [
    {
      icon: <Brain className='w-6 h-6' />,
      title: "AI-Powered Learning",
      description:
        "ସ୍ୱାଭାବିକ କଥୋପକଥନ - Natural conversations with our advanced AI",
    },
    {
      icon: <MessageSquare className='w-6 h-6' />,
      title: "Real-time Knowledge",
      description:
        "Stay updated with integrated Google Search for accurate information",
    },
    {
      icon: <Globe className='w-6 h-6' />,
      title: "Authentic Pronunciation",
      description:
        "Listen to native Odia speech with our text-to-speech technology",
    },
  ];

  const testimonials = [
    {
      quote: "Finally, a modern way to connect with my mother tongue!",
      author: "Anjali P.",
      role: "NRI Student, California",
      icon: <Users className='w-5 h-5' />,
    },
    {
      quote:
        "Perfect for learning conversational Odia. The AI responses are incredibly natural.",
      author: "Mark S.",
      role: "Cultural Researcher, London",
      icon: <BookOpen className='w-5 h-5' />,
    },
    {
      quote:
        "Helped me maintain my connection with Odisha while studying abroad.",
      author: "Deepak M.",
      role: "Graduate Student, Toronto",
      icon: <GraduationCap className='w-5 h-5' />,
    },
    {
      quote:
        "Essential tool for our international business communications in Odisha.",
      author: "Sarah Chen",
      role: "Business Consultant, Singapore",
      icon: <Building2 className='w-5 h-5' />,
    },
    {
      quote: "The perfect blend of technology and cultural preservation.",
      author: "Dr. Rajesh Kumar",
      role: "Language Professor, Delhi",
      icon: <BookOpen className='w-5 h-5' />,
    },
    {
      quote:
        "As a tourist guide, this helps me better connect with Odia speakers.",
      author: "Maria Garcia",
      role: "Tour Guide, Barcelona",
      icon: <Globe2 className='w-5 h-5' />,
    },
  ];

  return (
    <div className='min-h-screen bg-gradient-to-b from-neutral-50 to-neutral-100'>
      <div className='relative container mx-auto px-4 pt-12 md:pt-20 pb-20 md:pb-32 overflow-hidden'>
        <div className='absolute top-0 right-0 w-96 h-96 bg-accent-warm/20 rounded-full blur-3xl -z-10 animate-float' />
        <div
          className='absolute bottom-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10 animate-float'
          style={{ animationDelay: "2s" }}
        />

        <nav className='flex flex-col md:flex-row justify-between items-center gap-4 mb-12 md:mb-16'>
          <h1 className='font-display text-2xl font-bold text-neutral-900'>
            OdiaLingua
          </h1>
          <div className='flex items-center gap-4'>
            <Button
              variant='ghost'
              className='text-neutral-800'
              onClick={() => navigate("/contact")}
            >
              Contact
            </Button>
            <Button variant='outline' className='text-neutral-800'>
              EN | ଓଡ଼ିଆ
            </Button>
          </div>
        </nav>

        <div className='max-w-4xl mx-auto text-center px-4'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className='inline-block px-3 py-1 mb-6 text-sm font-medium text-primary-dark bg-primary-light/10 rounded-full'>
              ମୋ ଭାଷା, ମୋ ଗର୍ବ
            </span>
            <h2 className='font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 mb-6 leading-tight'>
              The First AI-Powered
              <br className='hidden sm:block' /> Odia Chatbot
            </h2>
            <p className='text-base md:text-lg text-neutral-800 mb-8 max-w-2xl mx-auto px-4'>
              Bridging Tradition with Technology—Speak, Learn, and Explore Odia
              with AI
            </p>

            <div className='flex justify-center mb-12'>
              <Button
                size='lg'
                className='group relative overflow-hidden bg-primary hover:bg-primary-dark transition-colors duration-300'
                onMouseEnter={() => {}}
                onMouseLeave={() => {}}
                onClick={() => navigate("/login")}
              >
                <span className='relative z-10 flex items-center'>
                  Start Speaking Odia Now
                  <ArrowRight className='ml-2 w-5 h-5 transition-transform duration-300' />
                </span>
              </Button>
            </div>

            <div className='flex flex-col sm:flex-row justify-center gap-4 sm:gap-8 text-sm text-neutral-600'>
              <span className='flex items-center justify-center gap-2'>
                <Brain className='w-4 h-4' /> Chat Naturally
              </span>
              <span className='flex items-center justify-center gap-2'>
                <Globe className='w-4 h-4' /> Get Real-Time Info
              </span>
              <span className='flex items-center justify-center gap-2'>
                <Brain className='w-4 h-4' /> Hear Authentic Odia
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      <div className='bg-white py-16 md:py-24 relative'>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOGMxMC4yMzcgMCAxOC04LjA1OSAxOC0xOHMtNy43NjMtMTgtMTgtMTh6bTAtMmMyLjc2NCAwIDUgMi4yMzYgNSA1cy0yLjIzNiA1LTUgNS01LTIuMjM2LTUtNSAyLjIzNi01IDUtNXoiIGZpbGw9IiNGOUZBRkIiLz48L2c+PC9zdmc+')] opacity-5" />
        <div className='container mx-auto px-4'>
          <div className='text-center mb-12 md:mb-16'>
            <h3 className='font-display text-2xl md:text-3xl font-bold text-neutral-900 mb-4'>
              Experience Odisha's Rich Linguistic Heritage
            </h3>
            <p className='text-neutral-600 max-w-2xl mx-auto px-4'>
              Through seamless AI-driven conversations, real-time knowledge, and
              authentic Odia speech synthesis
            </p>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8'>
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className='p-6 rounded-2xl bg-neutral-50 hover:bg-neutral-100 transition-all duration-500 
    hover:shadow-[0_0_30px_rgba(155,135,245,0.15)] relative group overflow-hidden
    before:absolute before:inset-0 before:bg-gradient-to-r before:from-primary/5 before:to-transparent 
    before:opacity-0 before:transition-opacity before:duration-500 hover:before:opacity-100'
              >
                <div className='relative z-10'>
                  <div
                    className='w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4
      transition-transform duration-500 group-hover:scale-110 group-hover:shadow-lg'
                  >
                    <div
                      className='text-primary-dark transition-colors duration-500 
        group-hover:text-primary group-hover:transform group-hover:scale-110'
                    >
                      {feature.icon}
                    </div>
                  </div>
                  <h3
                    className='text-lg md:text-xl font-semibold text-neutral-900 mb-2 
      transition-colors duration-500 group-hover:text-primary-dark'
                  >
                    {feature.title}
                  </h3>
                  <p
                    className='text-sm md:text-base text-neutral-800 transition-colors duration-500 
      group-hover:text-neutral-900'
                  >
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className='bg-neutral-50 py-16 md:py-24'>
        <div className='container mx-auto px-4'>
          <div className='text-center mb-12 md:mb-16'>
            <h3 className='font-display text-2xl md:text-3xl font-bold text-neutral-900 mb-4'>
              Loved by Users Worldwide
            </h3>
            <p className='text-neutral-600 max-w-2xl mx-auto px-4'>
              Join our growing community of global learners discovering the
              beauty of Odia language
            </p>
          </div>
          <div className='max-w-6xl mx-auto px-4 md:px-8'>
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className='w-full'
            >
              <CarouselContent className='-ml-2 md:-ml-4'>
                {testimonials.map((testimonial, index) => (
                  <CarouselItem
                    key={index}
                    className='pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3'
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className='h-full p-4 md:p-6 rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow duration-300'
                    >
                      <div className='flex items-start gap-4'>
                        <div className='w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center'>
                          <div className='text-primary-dark'>
                            {testimonial.icon}
                          </div>
                        </div>
                        <div>
                          <p className='text-sm md:text-base text-neutral-800 mb-4'>
                            {testimonial.quote}
                          </p>
                          <div>
                            <p className='font-semibold text-neutral-900'>
                              {testimonial.author}
                            </p>
                            <p className='text-xs md:text-sm text-neutral-600'>
                              {testimonial.role}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className='hidden md:flex'>
                <CarouselPrevious className='absolute -left-12 top-1/2' />
                <CarouselNext className='absolute -right-12 top-1/2' />
              </div>
            </Carousel>
          </div>
        </div>
      </div>

      <footer className='bg-white py-8 md:py-12 border-t border-neutral-200'>
        <div className='container mx-auto px-4'>
          <div className='flex flex-col md:flex-row justify-between items-center'>
            <div className='flex flex-col items-center md:items-start mb-6 md:mb-0'>
              <h4 className='font-display text-xl font-bold text-neutral-900 mb-2'>
                OdiaLingua
              </h4>
              <p className='text-neutral-600 text-sm text-center md:text-left'>
                Preserving and promoting Odia language through AI
              </p>
            </div>
            <div className='flex flex-col md:flex-row gap-6 md:gap-8'>
              <div className='flex space-x-6'>
                <a
                  onClick={() => navigate("/contact")}
                  className='text-neutral-800 hover:text-primary-dark transition-colors cursor-pointer'
                >
                  Contact
                </a>
              </div>
            </div>
          </div>
          <div className='text-center mt-6 text-sm text-neutral-600'>
            OdiaLingua made with ❤️ by{" "}
            <a
              href='https://github.com/HimanshuMohanty-Git24'
              target='_blank'
              rel='noopener noreferrer'
              className='text-primary-dark hover:text-primary transition-colors'
            >
              Himanshu Mohanty
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
