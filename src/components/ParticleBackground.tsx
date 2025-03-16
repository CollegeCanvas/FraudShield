
import React, { useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';

interface Particle {
  x: number;
  y: number;
  z: number;
  size: number;
  speedX: number;
  speedY: number;
  speedZ: number;
  opacity: number;
  color: string;
}

const ParticleBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let particles: Particle[] = [];
    let animationFrameId: number;
    let mouseX = 0;
    let mouseY = 0;
    
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };
    
    const initParticles = () => {
      particles = [];
      const particleCount = Math.min(Math.floor(window.innerWidth * 0.05), 100);
      
      // Colors based on theme
      const colors = theme === 'dark' 
        ? ['#6150fc', '#34bfdb', '#8B5CF6', '#D946EF'] 
        : ['#34bfdb', '#6150fc', '#8B5CF6', '#D946EF'];
      
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          z: Math.random() * 1000,
          size: Math.random() * 3 + 0.5,
          speedX: (Math.random() - 0.5) * 0.5,
          speedY: (Math.random() - 0.5) * 0.5,
          speedZ: Math.random() * 0.5 + 0.1,
          opacity: Math.random() * 0.7 + 0.3,
          color: colors[Math.floor(Math.random() * colors.length)]
        });
      }
    };
    
    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Sort particles by z-index for pseudo-3D effect
      particles.sort((a, b) => a.z - b.z);
      
      particles.forEach((particle, i) => {
        // Update position with 3D movement
        particle.x += particle.speedX + (mouseX - canvas.width/2) * 0.0001 * particle.z;
        particle.y += particle.speedY + (mouseY - canvas.height/2) * 0.0001 * particle.z;
        particle.z -= particle.speedZ;
        
        // Reset particle if it goes out of bounds or behind the camera
        if (particle.x < 0 || particle.x > canvas.width || 
            particle.y < 0 || particle.y > canvas.height ||
            particle.z < 0) {
          particle.x = Math.random() * canvas.width;
          particle.y = Math.random() * canvas.height;
          particle.z = 1000;
          particle.opacity = Math.random() * 0.7 + 0.3;
        }
        
        // Calculate size based on z position for perspective
        const scale = 1000 / (1000 + particle.z);
        const size = particle.size * scale;
        
        // Draw particle with glow effect
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2);
        
        // Add glow
        const glow = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, size * 3
        );
        glow.addColorStop(0, particle.color);
        glow.addColorStop(1, 'transparent');
        
        ctx.fillStyle = particle.color;
        ctx.fill();
        
        // Add subtle glow
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, size * 2, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.globalAlpha = particle.opacity * 0.3;
        ctx.fill();
        ctx.globalAlpha = 1;
        
        // Connect particles within certain distance, with depth consideration
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[j].x - particle.x;
          const dy = particles[j].y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 120 * scale) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(particles[j].x, particles[j].y);
            
            // Line color based on average z-depth
            const avgZ = (particle.z + particles[j].z) / 2;
            const opacity = Math.max(0, 0.5 * (1 - distance / (120 * scale)) * (1 - avgZ / 1000));
            
            ctx.strokeStyle = theme === 'dark' 
              ? `rgba(97, 80, 252, ${opacity})` 
              : `rgba(50, 191, 219, ${opacity})`;
            ctx.lineWidth = Math.max(0.3, 1.5 * scale);
            ctx.stroke();
          }
        }
      });
      
      animationFrameId = requestAnimationFrame(drawParticles);
    };
    
    // Track mouse movement for interactive effect
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    handleResize();
    window.addEventListener('resize', handleResize);
    drawParticles();
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);
  
  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 z-0 pointer-events-none opacity-80 transition-opacity duration-1000"
    />
  );
};

export default ParticleBackground;
