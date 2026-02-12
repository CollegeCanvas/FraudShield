
import React, { useEffect, useRef } from 'react';
import { Shield, CheckCircle2, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import UrlScanner from './UrlScanner';

const HeroSection: React.FC = () => {
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
      { threshold: 0.1 }
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

  const scrollToFeatures = () => {
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="min-h-screen flex items-center relative overflow-hidden pt-20 pb-16 md:pt-24 md:pb-20" ref={containerRef}>
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-shield-500/10 via-transparent to-transparent dark:from-shield-900/20" />
      </div>

      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center space-x-2"
            >
              <span className="inline-flex items-center rounded-full bg-shield-100 dark:bg-shield-900/50 px-3 py-1 text-sm font-medium text-shield-600 dark:text-shield-300">
                <Shield className="mr-1 h-3 w-3" /> AI-Powered Protection
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-tight"
            >
              Stay Safe from <span className="gradient-text-enhanced">Online Fraud</span> with <span className="cyber-gradient-text">Advanced AI</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg md:text-xl text-foreground/80 max-w-lg"
            >
              FraudShield detects and blocks fraudulent websites, phishing attempts, and scams in real-time, keeping your personal data secure while you browse.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4"
            >
              <motion.a
                href="https://drive.usercontent.google.com/u/0/uc?id=1zuW1ltvO6C6hg2REqPgYlMSexT-WaQ60&export=download"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="glow-button bg-shield-500 text-white font-medium px-6 py-3 rounded-lg hover:bg-shield-600 transition-all duration-300 text-center transform hover:shadow-lg hover:shadow-shield-500/25"
              >
                Install FraudShield
              </motion.a>
              <motion.a
                href="#how-it-works"
                whileHover={{ y: 3 }}
                className="group flex items-center justify-center space-x-2 font-medium text-foreground/80 hover:text-foreground transition-colors duration-300"
              >
                <span>How it works</span>
                <ChevronDown className="h-4 w-4 group-hover:translate-y-1 transition-transform duration-300" />
              </motion.a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-6 pt-6"
            >
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="h-5 w-5 text-cyber-500" />
                <span className="text-sm">Real-time Protection</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="h-5 w-5 text-cyber-500" />
                <span className="text-sm">99.7% Accuracy</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="h-5 w-5 text-cyber-500" />
                <span className="text-sm">Privacy Focused</span>
              </div>
            </motion.div>
          </div>

          {/* ── Right side: Interactive URL Scanner ── */}
          <UrlScanner />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        >
          <button
            onClick={scrollToFeatures}
            className="flex items-center justify-center h-12 w-12 rounded-full bg-secondary/80 backdrop-blur-md hover:bg-secondary transition-all duration-300 animate-float"
            aria-label="Scroll to features"
          >
            <ChevronDown className="h-5 w-5 text-foreground" />
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
