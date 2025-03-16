
import React from 'react';
import { Shield } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-card theme-transition border-t border-border">
      <div className="container-custom py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-2 text-foreground">
            <Shield className="h-6 w-6 text-shield-500" />
            <span className="font-display text-xl font-semibold">FraudShield</span>
          </div>
          
          <div className="flex space-x-6">
            <a href="#" className="text-foreground/70 hover:text-foreground transition-colors duration-300">Features</a>
            <a href="#" className="text-foreground/70 hover:text-foreground transition-colors duration-300">How it Works</a>
            <a href="#" className="text-foreground/70 hover:text-foreground transition-colors duration-300">About</a>
            <a href="#" className="text-foreground/70 hover:text-foreground transition-colors duration-300">Contact</a>
          </div>
          
          <div className="flex space-x-4">
            <a href="#" className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-foreground/70 hover:text-foreground transition-colors duration-300">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" /></svg>
            </a>
            <a href="#" className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-foreground/70 hover:text-foreground transition-colors duration-300">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.008 10.008 0 01-3.127 1.195 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" /></svg>
            </a>
            <a href="#" className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-foreground/70 hover:text-foreground transition-colors duration-300">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm4.441 16.892c-2.102.144-6.784.144-8.883 0C5.282 16.736 5.017 15.622 5 12c.017-3.629.285-4.736 2.558-4.892 2.099-.144 6.782-.144 8.883 0C18.718 7.264 18.982 8.378 19 12c-.018 3.629-.285 4.736-2.559 4.892zM10 9.658l4.917 2.338L10 14.342V9.658z" /></svg>
            </a>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-border text-center">
          <p className="text-foreground/70 text-sm">
            © {new Date().getFullYear()} FraudShield. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
