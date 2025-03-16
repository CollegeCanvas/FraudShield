
import React from 'react';
import { Shield } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-card theme-transition border-t border-border">
      <div className="container-custom py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-1">
            <div className="flex items-center space-x-2 text-foreground mb-4">
              <Shield className="h-8 w-8 text-shield-500" />
              <span className="font-display text-xl font-semibold">FraudShield</span>
            </div>
            <p className="text-foreground/70 mb-6">
              Advanced fraud detection and protection for a safer online experience.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-foreground/70 hover:text-foreground transition-colors duration-300">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" /></svg>
              </a>
              <a href="#" className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-foreground/70 hover:text-foreground transition-colors duration-300">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.008 10.008 0 01-3.127 1.195 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" /></svg>
              </a>
              <a href="#" className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-foreground/70 hover:text-foreground transition-colors duration-300">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm4.441 16.892c-2.102.144-6.784.144-8.883 0C5.282 16.736 5.017 15.622 5 12c.017-3.629.285-4.736 2.558-4.892 2.099-.144 6.782-.144 8.883 0C18.718 7.264 18.982 8.378 19 12c-.018 3.629-.285 4.736-2.559 4.892zM10 9.658l4.917 2.338L10 14.342V9.658z" /></svg>
              </a>
              <a href="#" className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-foreground/70 hover:text-foreground transition-colors duration-300">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" /></svg>
              </a>
            </div>
          </div>
          
          <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold text-lg mb-3">Product</h3>
              <ul className="space-y-2">
                <li><a href="#features" className="text-foreground/70 hover:text-foreground transition-colors duration-300">Features</a></li>
                <li><a href="#pricing" className="text-foreground/70 hover:text-foreground transition-colors duration-300">Pricing</a></li>
                <li><a href="#" className="text-foreground/70 hover:text-foreground transition-colors duration-300">Browser Extension</a></li>
                <li><a href="#" className="text-foreground/70 hover:text-foreground transition-colors duration-300">Security API</a></li>
                <li><a href="#" className="text-foreground/70 hover:text-foreground transition-colors duration-300">Release Notes</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-3">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-foreground/70 hover:text-foreground transition-colors duration-300">Blog</a></li>
                <li><a href="#" className="text-foreground/70 hover:text-foreground transition-colors duration-300">Documentation</a></li>
                <li><a href="#" className="text-foreground/70 hover:text-foreground transition-colors duration-300">Security Guide</a></li>
                <li><a href="#" className="text-foreground/70 hover:text-foreground transition-colors duration-300">Fraud Database</a></li>
                <li><a href="#" className="text-foreground/70 hover:text-foreground transition-colors duration-300">Help Center</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-3">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-foreground/70 hover:text-foreground transition-colors duration-300">About Us</a></li>
                <li><a href="#" className="text-foreground/70 hover:text-foreground transition-colors duration-300">Careers</a></li>
                <li><a href="#" className="text-foreground/70 hover:text-foreground transition-colors duration-300">Press</a></li>
                <li><a href="#" className="text-foreground/70 hover:text-foreground transition-colors duration-300">Contact</a></li>
                <li><a href="#" className="text-foreground/70 hover:text-foreground transition-colors duration-300">Partners</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center">
          <p className="text-foreground/70 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} FraudShield. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <a href="#" className="text-foreground/70 hover:text-foreground text-sm transition-colors duration-300">Privacy Policy</a>
            <a href="#" className="text-foreground/70 hover:text-foreground text-sm transition-colors duration-300">Terms of Service</a>
            <a href="#" className="text-foreground/70 hover:text-foreground text-sm transition-colors duration-300">Security</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
