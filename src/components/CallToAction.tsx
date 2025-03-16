
import React from 'react';
import { Shield, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const CallToAction: React.FC = () => {
  return (
    <section id="cta" className="section-spacing bg-background theme-transition relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-shield-500/5 dark:to-shield-900/10" />
      
      <div className="container-custom relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-100px" }}
          className="glass-card p-10 rounded-3xl overflow-hidden max-w-5xl mx-auto relative"
        >
          <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-shield-500/10 to-transparent dark:from-shield-500/5" />
          <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-cyber-500/10 to-transparent dark:from-cyber-500/5" />
          
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10">
            <div className="lg:w-2/3 text-center lg:text-left">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                Protect Yourself from <span className="gradient-text-enhanced">Online Fraud</span>
              </h2>
              <p className="text-foreground/80 text-lg mb-6 max-w-2xl">
                With FraudShield's AI-powered protection, you can browse, shop, and bank online with confidence, knowing you're protected from the latest scams and fraud attempts.
              </p>
            </div>
            
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-shrink-0"
            >
              <a 
                href="#" 
                className="glow-button bg-shield-500 hover:bg-shield-600 text-white font-medium px-8 py-4 rounded-lg transition-all duration-300 inline-flex items-center space-x-2 text-lg shadow-lg shadow-shield-500/20 hover:shadow-shield-500/40"
              >
                <Shield className="h-5 w-5" />
                <span>Get FraudShield Now</span>
                <ChevronRight className="h-5 w-5" />
              </a>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CallToAction;
