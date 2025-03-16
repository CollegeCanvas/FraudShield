
import React, { useState, useEffect } from 'react';
import ThemeToggle from './ThemeToggle';
import { Shield, Menu, X } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Features', href: '#features' },
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'Pricing', href: '#pricing' },
  ];

  return (
    <nav 
      className={`fixed w-full z-50 transition-all duration-500 ${
        isScrolled 
          ? 'py-2 bg-background/80 backdrop-blur-lg shadow-sm' 
          : 'py-4 bg-transparent'
      }`}
    >
      <div className="container-custom flex justify-between items-center">
        {/* Logo */}
        <a href="#" className="flex items-center space-x-2 text-foreground">
          <Shield className="h-8 w-8 text-shield-500" />
          <span className="font-display text-xl font-semibold">FraudShield</span>
        </a>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          <div className="flex space-x-6">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-foreground/80 hover:text-foreground transition-colors duration-300 font-medium"
              >
                {link.name}
              </a>
            ))}
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <a 
              href="#" 
              className="glow-button bg-shield-500 text-white font-medium px-4 py-2 rounded-lg hover:bg-shield-600 transition-all duration-300"
            >
              Install Now
            </a>
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex items-center space-x-4 md:hidden">
          <ThemeToggle />
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-foreground focus:outline-none"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div 
        className={`md:hidden absolute w-full bg-background/95 backdrop-blur-lg border-b border-border transition-all duration-500 ease-in-out overflow-hidden ${
          isMenuOpen ? 'max-h-96 opacity-100 border-opacity-100' : 'max-h-0 opacity-0 border-opacity-0'
        }`}
      >
        <div className="container-custom py-4 flex flex-col space-y-4">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-foreground/80 hover:text-foreground py-2 transition-colors duration-300 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              {link.name}
            </a>
          ))}
          <a
            href="#"
            className="bg-shield-500 text-white font-medium px-4 py-2 rounded-lg hover:bg-shield-600 transition-all duration-300 text-center"
          >
            Install Now
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
