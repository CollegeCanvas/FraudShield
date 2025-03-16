
import React, { useState } from 'react';
import { CheckCircle2, Shield, ShieldCheck, ShieldAlert } from 'lucide-react';

interface PricingPlan {
  name: string;
  description: string;
  price: string;
  features: string[];
  icon: JSX.Element;
  mostPopular: boolean;
}

const PricingSection: React.FC = () => {
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly');
  
  const pricingPlans: PricingPlan[] = [
    {
      name: 'Basic',
      description: 'Essential protection for casual browsing',
      price: billing === 'monthly' ? '₹299' : '₹2,999',
      features: [
        'Basic fraud detection',
        'Email phishing protection',
        'Safe browsing alerts',
        'Monthly threat reports',
      ],
      icon: <Shield className="h-6 w-6" />,
      mostPopular: false,
    },
    {
      name: 'Premium',
      description: 'Advanced protection for daily users',
      price: billing === 'monthly' ? '₹599' : '₹5,999',
      features: [
        'Advanced AI detection',
        'Real-time website scanning',
        'Safe shopping guarantee',
        'Banking protection',
        'Priority support',
        'Cross-device protection',
      ],
      icon: <ShieldCheck className="h-6 w-6" />,
      mostPopular: true,
    },
    {
      name: 'Family',
      description: 'Complete protection for up to 5 users',
      price: billing === 'monthly' ? '₹999' : '₹9,999',
      features: [
        'Protection for 5 users',
        'Parental controls',
        'Identity theft monitoring',
        'VPN included',
        '24/7 support',
        'Personalized security dashboard',
        'Secure password manager',
      ],
      icon: <ShieldAlert className="h-6 w-6" />,
      mostPopular: false,
    },
  ];

  return (
    <section id="pricing" className="section-spacing bg-background theme-transition relative">
      <div className="container-custom relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Simple, Transparent Pricing</h2>
          <p className="text-foreground/80 text-lg mb-8">
            Choose the plan that works best for your browsing needs
          </p>
          
          <div className="flex justify-center">
            <div className="bg-muted p-1 rounded-full inline-flex items-center">
              <button
                onClick={() => setBilling('monthly')}
                className={`px-4 py-2 rounded-full transition-all duration-300 ${
                  billing === 'monthly'
                    ? 'bg-white dark:bg-slate-800 text-foreground shadow-sm'
                    : 'bg-transparent text-foreground/70 hover:text-foreground'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBilling('yearly')}
                className={`px-4 py-2 rounded-full transition-all duration-300 ${
                  billing === 'yearly'
                    ? 'bg-white dark:bg-slate-800 text-foreground shadow-sm'
                    : 'bg-transparent text-foreground/70 hover:text-foreground'
                }`}
              >
                Yearly <span className="text-xs text-shield-500 font-medium ml-1">Save 20%</span>
              </button>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pricingPlans.map((plan, index) => (
            <div
              key={index}
              className={`relative rounded-2xl overflow-hidden theme-transition animate-slide-up flex flex-col card-hover ${
                plan.mostPopular
                  ? 'shadow-lg ring-2 ring-shield-500 dark:ring-shield-400'
                  : 'subtle-border'
              }`}
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {plan.mostPopular && (
                <div className="absolute top-0 right-0 bg-shield-500 text-white px-3 py-1 text-xs font-semibold rounded-bl-lg">
                  Most Popular
                </div>
              )}
              
              <div className="p-6 md:p-8 bg-card theme-transition flex-grow">
                <div className="flex items-center mb-4">
                  <div className={`h-12 w-12 rounded-full ${
                    plan.mostPopular ? 'bg-shield-500 text-white' : 'bg-muted text-foreground'
                  } flex items-center justify-center mr-4`}>
                    {plan.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{plan.name}</h3>
                    <p className="text-sm text-foreground/70">{plan.description}</p>
                  </div>
                </div>
                
                <div className="mt-6 mb-8">
                  <div className="flex items-end">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-foreground/70 ml-2">/{billing}</span>
                  </div>
                </div>
                
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 mr-3 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="p-6 md:p-8 border-t border-border theme-transition bg-card">
                <button 
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-300 ${
                    plan.mostPopular
                      ? 'bg-shield-500 hover:bg-shield-600 text-white'
                      : 'bg-secondary hover:bg-secondary/80 text-foreground'
                  }`}
                >
                  Get {plan.name}
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center glass-card p-6 md:p-8 rounded-2xl max-w-4xl mx-auto">
          <h3 className="text-xl font-semibold mb-4">Need Protection for Your Organization?</h3>
          <p className="text-foreground/80 mb-6">
            FraudShield offers custom enterprise solutions with advanced threat protection and admin controls
          </p>
          <a 
            href="#" 
            className="glow-button inline-flex items-center justify-center bg-foreground text-background dark:bg-background dark:text-foreground font-medium px-6 py-3 rounded-lg hover:opacity-90 transition-all duration-300"
          >
            Contact Sales for Enterprise Pricing
          </a>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
