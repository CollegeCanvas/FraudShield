
import React, { useEffect, useRef } from 'react';
import { 
  Search, Shield, AlertTriangle, CheckCircle2, Zap, Lock, RefreshCw 
} from 'lucide-react';

const HowItWorks: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
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
  
  const steps = [
    {
      icon: Search,
      title: "URL Analysis",
      description: "FraudShield analyzes each website URL against our database of known threats and suspicious patterns.",
      color: "text-blue-500 dark:text-blue-400",
      bgColor: "bg-blue-500/10 dark:bg-blue-400/20"
    },
    {
      icon: RefreshCw,
      title: "Real-time AI Scanning",
      description: "Our advanced AI scans website content for fraudulent indicators and malicious code.",
      color: "text-shield-500 dark:text-shield-400",
      bgColor: "bg-shield-500/10 dark:bg-shield-400/20"
    },
    {
      icon: AlertTriangle,
      title: "Threat Detection",
      description: "When a threat is detected, FraudShield immediately alerts you before any data can be compromised.",
      color: "text-amber-500 dark:text-amber-400",
      bgColor: "bg-amber-500/10 dark:bg-amber-400/20"
    },
    {
      icon: Lock,
      title: "Safe Browsing Mode",
      description: "Optional safe browsing mode prevents access to suspicious websites and protects your personal information.",
      color: "text-green-500 dark:text-green-400",
      bgColor: "bg-green-500/10 dark:bg-green-400/20"
    }
  ];

  return (
    <section id="how-it-works" className="section-spacing bg-background theme-transition relative" ref={containerRef}>
      <div className="container-custom relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 opacity-0 animate-on-scroll">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">How FraudShield Protects You</h2>
          <p className="text-foreground/80 text-lg">
            Our AI-powered technology works silently in the background to keep you safe from online threats
          </p>
        </div>
        
        <div className="relative">
          {/* Center line */}
          <div className="absolute left-1/2 top-8 bottom-8 w-1 -translate-x-1/2 bg-muted hidden md:block"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-12 md:gap-y-32 relative">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isEven = index % 2 === 0;
              
              return (
                <div 
                  key={index} 
                  className={`${
                    isEven ? 'md:pr-12 md:text-right' : 'md:pl-12 md:text-left md:col-start-2'
                  } opacity-0 animate-on-scroll`}
                >
                  <div className={`flex items-center ${isEven ? 'md:justify-end' : 'md:justify-start'} mb-4`}>
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${step.bgColor}`}>
                      <Icon className={`h-6 w-6 ${step.color}`} />
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                    <p className="text-foreground/80">{step.description}</p>
                  </div>
                  
                  {/* Dot on the timeline */}
                  <div className={`absolute left-1/2 -translate-x-1/2 w-5 h-5 rounded-full border-4 border-background ${step.bgColor} hidden md:block`} style={{ top: `${index * 33.33 + 5}%` }}></div>
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="mt-20 flex justify-center opacity-0 animate-on-scroll">
          <div className="max-w-3xl glass-card p-6 md:p-8 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-shield-500 via-cyber-500 to-shield-500 bg-size-200"></div>
            
            <div className="flex flex-col md:flex-row items-center">
              <div className="mb-6 md:mb-0 md:mr-8">
                <div className="h-16 w-16 rounded-full bg-shield-100 dark:bg-shield-900/50 flex items-center justify-center">
                  <Zap className="h-8 w-8 text-shield-500" />
                </div>
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
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
