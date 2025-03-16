
import React, { useState } from 'react';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  accentColor: string;
  darkAccentColor: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon: Icon,
  title,
  description,
  accentColor,
  darkAccentColor
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div
      className={`relative p-6 rounded-xl card-hover cursor-pointer theme-transition glass-card`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`absolute inset-0 rounded-xl opacity-0 transition-opacity duration-500 ${
          isHovered ? 'opacity-10' : ''
        }`}
        style={{ 
          background: `radial-gradient(circle at center, var(--tw-${accentColor}) 0%, transparent 70%)`,
          zIndex: -1 
        }}
      />
      
      <div className={`w-12 h-12 mb-4 rounded-lg flex items-center justify-center theme-transition ${
        isHovered 
          ? `bg-${accentColor} dark:bg-${darkAccentColor}` 
          : `bg-${accentColor}/10 dark:bg-${darkAccentColor}/20`
      }`}>
        <Icon 
          className={`h-6 w-6 theme-transition ${
            isHovered 
              ? 'text-white' 
              : `text-${accentColor} dark:text-${darkAccentColor}`
          }`} 
        />
      </div>
      
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-foreground/80">{description}</p>
      
      <div 
        className={`absolute bottom-0 left-0 h-1 theme-transition ${
          isHovered ? `bg-${accentColor} dark:bg-${darkAccentColor}` : 'bg-transparent'
        }`}
        style={{ width: isHovered ? '30%' : '0%', transition: 'width 0.3s ease, background-color 0.7s ease' }}
      />
    </div>
  );
};

export default FeatureCard;
