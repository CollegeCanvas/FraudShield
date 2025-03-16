
import React, { useEffect, useRef } from 'react';
import { Search, Shield, AlertTriangle, CheckCircle2, Zap, Lock, RefreshCw } from 'lucide-react';
import { motion } from "framer-motion";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { useTheme } from '../context/ThemeContext';
import Autoplay from 'embla-carousel-autoplay';

const HowItWorks: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const autoplayPlugin = useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true })
  );

  const steps = [
    {
      icon: Search,
      title: "URL Analysis",
      description: "FraudShield analyzes each website URL against our database of known threats and suspicious patterns.",
      color: "text-blue-500 dark:text-blue-400",
      bgColor: "bg-blue-500/10 dark:bg-blue-400/20",
      borderColor: "border-blue-500/30 dark:border-blue-400/30"
    },
    {
      icon: RefreshCw,
      title: "Real-time AI Scanning",
      description: "Our advanced AI scans website content for fraudulent indicators and malicious code.",
      color: "text-shield-500 dark:text-shield-400",
      bgColor: "bg-shield-500/10 dark:bg-shield-400/20",
      borderColor: "border-shield-500/30 dark:border-shield-400/30"
    },
    {
      icon: AlertTriangle,
      title: "Threat Detection",
      description: "When a threat is detected, FraudShield immediately alerts you before any data can be compromised.",
      color: "text-amber-500 dark:text-amber-400",
      bgColor: "bg-amber-500/10 dark:bg-amber-400/20",
      borderColor: "border-amber-500/30 dark:border-amber-400/30"
    },
    {
      icon: Lock,
      title: "Safe Browsing Mode",
      description: "Optional safe browsing mode prevents access to suspicious websites and protects your personal information.",
      color: "text-green-500 dark:text-green-400",
      bgColor: "bg-green-500/10 dark:bg-green-400/20",
      borderColor: "border-green-500/30 dark:border-green-400/30"
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in');
            entry.target.classList.remove('opacity-0');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -100px 0px' }
    );
    
    const elements = containerRef.current?.querySelectorAll('.animate-on-scroll');
    elements?.forEach(el => {
      observer.observe(el);
    });
    
    return () => {
      elements?.forEach(el => {
        observer.unobserve(el);
      });
    };
  }, []);

  return (
    <section id="how-it-works" className="section-spacing bg-background theme-transition relative" ref={containerRef}>
      <div className="container-custom relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 opacity-0 animate-on-scroll">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 cyber-gradient-text">How FraudShield Protects You</h2>
          <p className="text-foreground/80 text-lg">
            Our AI-powered technology works silently in the background to keep you safe from online threats
          </p>
        </div>
        
        <div className="relative mx-auto max-w-5xl opacity-0 animate-on-scroll">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            plugins={[autoplayPlugin.current]}
            className="w-full"
          >
            <CarouselContent>
              {steps.map((step, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/2">
                  <div className="p-1">
                    <motion.div 
                      className={`rounded-xl glass-card p-6 h-full border ${step.borderColor} transition-all duration-500`}
                      whileHover={{ 
                        scale: 1.03, 
                        boxShadow: theme === 'dark' 
                          ? `0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 0 10px ${step.color.split(' ')[1]}40` 
                          : `0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 0 10px ${step.color.split(' ')[1]}40` 
                      }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="flex flex-col h-full">
                        <div className="mb-4">
                          <div className={`relative h-16 w-16 rounded-full ${step.bgColor} flex items-center justify-center overflow-hidden group`}>
                            <motion.div
                              className="absolute inset-0 opacity-0 group-hover:opacity-100"
                              initial={{ scale: 0, opacity: 0 }}
                              whileHover={{ scale: 10, opacity: 0.15 }}
                              transition={{ duration: 0.5 }}
                              style={{ 
                                backgroundColor: step.color.split(' ')[1].replace('text-', '')
                              }}
                            />
                            <step.icon className={`h-8 w-8 ${step.color} relative z-10`} />
                          </div>
                        </div>
                        
                        <div className="relative z-10">
                          <h3 className={`text-xl font-semibold mb-2 ${step.color}`}>{step.title}</h3>
                          <p className="text-foreground/80">{step.description}</p>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex items-center justify-center gap-2 mt-6">
              <CarouselPrevious className="static transform-none mx-2" />
              <CarouselNext className="static transform-none mx-2" />
            </div>
          </Carousel>
        </div>
        
        <div className="mt-20 flex justify-center opacity-0 animate-on-scroll">
          <motion.div 
            className="max-w-3xl glass-card p-6 md:p-8 rounded-2xl relative overflow-hidden"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-shield-500 via-cyber-500 to-shield-500 bg-size-200"></div>
            
            <div className="flex flex-col md:flex-row items-center">
              <div className="mb-6 md:mb-0 md:mr-8">
                <motion.div 
                  className="h-16 w-16 rounded-full bg-shield-100 dark:bg-shield-900/50 flex items-center justify-center"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <Zap className="h-8 w-8 text-shield-500" />
                </motion.div>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-2">AI-Driven Protection That Learns</h3>
                <p className="text-foreground/80 mb-4">
                  FraudShield's machine learning algorithms continuously improve by analyzing new threats, ensuring you're always protected against the latest scams and phishing techniques.
                </p>
                
                <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-6">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <span className="text-sm">Self-improving AI</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <span className="text-sm">Weekly Updates</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <span className="text-sm">Custom Protection</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
