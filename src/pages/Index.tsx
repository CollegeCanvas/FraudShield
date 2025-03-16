
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import HowItWorks from '../components/HowItWorks';
import FraudStats from '../components/FraudStats';
import CallToAction from '../components/CallToAction';
import Footer from '../components/Footer';
import ParticleBackground from '../components/ParticleBackground';
import { ThemeProvider } from '../context/ThemeContext';
import { Shield, AlertCircle, ZapOff, ShieldCheck, Zap, Scan, Lock } from 'lucide-react';
import FeatureCard from '../components/FeatureCard';

const Index = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const features = [
    {
      icon: Shield,
      title: 'Real-time Protection',
      description: 'Our AI engine scans websites in real-time to detect and block fraudulent activities before they can harm you.',
      accentColor: 'shield-500',
      darkAccentColor: 'shield-400'
    },
    {
      icon: AlertCircle,
      title: 'Phishing Detection',
      description: 'FraudShield identifies phishing attempts that try to steal your personal information or login credentials.',
      accentColor: 'red-500',
      darkAccentColor: 'red-400'
    },
    {
      icon: ZapOff,
      title: 'Malware Blocking',
      description: 'Proactively blocks websites that attempt to distribute malware or other harmful software to your device.',
      accentColor: 'amber-500',
      darkAccentColor: 'amber-400'
    },
    {
      icon: Scan,
      title: 'Safe Browsing Mode',
      description: 'Activate our secure browsing environment for sensitive transactions like banking and shopping.',
      accentColor: 'green-500',
      darkAccentColor: 'green-400'
    },
    {
      icon: Lock,
      title: 'Data Protection',
      description: 'Prevents websites from collecting your personal data without permission, keeping your digital footprint private.',
      accentColor: 'cyber-500',
      darkAccentColor: 'cyber-400'
    },
    {
      icon: Zap,
      title: 'AI-Powered Analysis',
      description: 'Our machine learning algorithms constantly evolve to recognize new and sophisticated fraud techniques.',
      accentColor: 'purple-500',
      darkAccentColor: 'purple-400'
    }
  ];

  return (
    <ThemeProvider>
      <div className={`min-h-screen theme-transition antialiased overflow-x-hidden ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <ParticleBackground />
        <Navbar />
        <HeroSection />
        
        <section id="features" className="section-spacing bg-background theme-transition relative">
          <div className="container-custom">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-flex items-center rounded-full bg-shield-100 dark:bg-shield-900/50 px-3 py-1 text-sm font-medium text-shield-600 dark:text-shield-300 mb-4">
                <ShieldCheck className="mr-1 h-3 w-3" /> Advanced Protection Features
              </div>
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Comprehensive Security for Your Digital Life</h2>
              <p className="text-foreground/80 text-lg">
                FraudShield provides advanced protection against online threats with AI-powered features that keep you safe
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <FeatureCard
                  key={index}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                  accentColor={feature.accentColor}
                  darkAccentColor={feature.darkAccentColor}
                />
              ))}
            </div>
          </div>
        </section>
        
        <HowItWorks />
        <FraudStats />
        <CallToAction />
        <Footer />
      </div>
    </ThemeProvider>
  );
};

export default Index;
