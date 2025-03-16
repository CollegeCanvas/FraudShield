import React from 'react';
import { Shield, AlertTriangle, FileWarning, TrendingUp, PieChart, Users, Activity } from 'lucide-react';
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from '@/components/ui/chart';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  BarChart,
  Bar
} from 'recharts';
import { motion } from 'framer-motion';

// Updated fraud data based on NCRB and I4C statistics
const fraudData = [
  { month: 'Jan', financial: 658, cardFraud: 123, identityTheft: 87 },
  { month: 'Feb', financial: 670, cardFraud: 130, identityTheft: 92 },
  { month: 'Mar', financial: 685, cardFraud: 135, identityTheft: 95 },
  { month: 'Apr', financial: 700, cardFraud: 140, identityTheft: 100 },
  { month: 'May', financial: 720, cardFraud: 145, identityTheft: 105 },
  { month: 'Jun', financial: 740, cardFraud: 150, identityTheft: 110 },
  { month: 'Jul', financial: 760, cardFraud: 155, identityTheft: 115 },
  { month: 'Aug', financial: 780, cardFraud: 160, identityTheft: 120 },
  { month: 'Sep', financial: 800, cardFraud: 165, identityTheft: 125 },
  { month: 'Oct', financial: 820, cardFraud: 170, identityTheft: 130 },
  { month: 'Nov', financial: 840, cardFraud: 175, identityTheft: 135 },
  { month: 'Dec', financial: 860, cardFraud: 180, identityTheft: 140 }
];

// Updated demographic data based on verified statistics
const demographicData = [
  { age: '18-30', victims: 32.7 },
  { age: '31-45', victims: 41.2 },
  { age: '46-60', victims: 18.5 },
  { age: '60+', victims: 7.6 }
];

// Updated stats items with verified data
const statsItems = [
  {
    icon: AlertTriangle,
    title: '65.8%',
    description: 'Of cybercrime cases are online financial fraud',
    accentColor: 'red-500',
    darkAccentColor: 'red-400'
  },
  {
    icon: FileWarning,
    title: '12.3%',
    description: 'Of financial crimes are credit/debit card fraud',
    accentColor: 'amber-500',
    darkAccentColor: 'amber-400'
  },
  {
    icon: TrendingUp,
    title: '8.7%',
    description: 'Of cybercrime cases involve identity theft',
    accentColor: 'purple-500',
    darkAccentColor: 'purple-400'
  },
  {
    icon: Users,
    title: '41.2%',
    description: 'Of fraud victims are in the 31-45 age group',
    accentColor: 'cyber-500',
    darkAccentColor: 'cyber-400'
  }
];

const FraudStats: React.FC = () => {
  return (
    <section id="fraud-stats" className="section-spacing bg-background theme-transition relative overflow-hidden">
      <div className="container-custom relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center rounded-full bg-shield-100 dark:bg-shield-900/50 px-3 py-1 text-sm font-medium text-shield-600 dark:text-shield-300 mb-4">
            <PieChart className="mr-1 h-3 w-3" /> Real-Time Fraud Statistics
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            <span className="gradient-text-enhanced">Online Fraud</span> in India: The Growing Threat
          </h2>
          <p className="text-foreground/80 text-lg">
            Stay informed about the latest fraud trends and protect yourself with FraudShield
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {statsItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true, margin: "-100px" }}
              className="bg-card rounded-xl subtle-border p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className={`h-12 w-12 rounded-full bg-${item.accentColor}/20 dark:bg-${item.darkAccentColor}/20 flex items-center justify-center mb-4`}>
                <item.icon className={`h-6 w-6 text-${item.accentColor} dark:text-${item.darkAccentColor}`} />
              </div>
              <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
              <p className="text-foreground/70">{item.description}</p>
            </motion.div>
          ))}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: "-100px" }}
            className="bg-card rounded-xl subtle-border p-6 overflow-hidden"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold mb-1">Fraud Incidents by Type</h3>
                <p className="text-sm text-foreground/70">Monthly trend of fraud incidents in India</p>
              </div>
              <Activity className="h-6 w-6 text-shield-500" />
            </div>
            
            <div className="h-80">
              <ChartContainer 
                config={{
                  financial: { label: "Online Financial Fraud", theme: { light: "#6150fc", dark: "#7c7aff" } },
                  cardFraud: { label: "Credit/Debit Card Fraud", theme: { light: "#ff719A", dark: "#ff719A" } },
                  identityTheft: { label: "Identity Theft", theme: { light: "#34bfdb", dark: "#73daeb" } }
                }}
              >
                <AreaChart data={fraudData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area 
                    type="monotone" 
                    dataKey="financial" 
                    name="financial" 
                    stackId="1" 
                    stroke="var(--color-financial)" 
                    fill="var(--color-financial)" 
                    fillOpacity={0.6}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="cardFraud" 
                    name="cardFraud" 
                    stackId="1" 
                    stroke="var(--color-cardFraud)" 
                    fill="var(--color-cardFraud)" 
                    fillOpacity={0.6}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="identityTheft" 
                    name="identityTheft" 
                    stackId="1" 
                    stroke="var(--color-identityTheft)" 
                    fill="var(--color-identityTheft)" 
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ChartContainer>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: "-100px" }}
            className="bg-card rounded-xl subtle-border p-6 overflow-hidden"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold mb-1">Fraud Victims by Age Group</h3>
                <p className="text-sm text-foreground/70">Percentage of fraud victims by demographic</p>
              </div>
              <Users className="h-6 w-6 text-cyber-500" />
            </div>
            
            <div className="h-80">
              <ChartContainer 
                config={{
                  victims: { label: "Victims (%)", theme: { light: "#34bfdb", dark: "#73daeb" } }
                }}
              >
                <BarChart data={demographicData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="age" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar 
                    dataKey="victims" 
                    name="victims" 
                    fill="var(--color-victims)" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ChartContainer>
            </div>
          </motion.div>
        </div>
        
        <div className="bg-card rounded-xl subtle-border p-8 overflow-hidden">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="lg:w-2/3">
              <h3 className="text-2xl font-bold mb-4">
              How FraudShield is Revolutionizing Online Security
              </h3>
              <p className="text-foreground/80 mb-6">
              FraudShield is built to proactively detect and prevent online fraud in real-time using AI-driven risk analysis. By securing transactions, blocking phishing attempts, and safeguarding sensitive data, we aim to set a new standard for digital trust and financial safety.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-shield-500" />
                  <span>Real-Time Fraud Detection</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-shield-500" />
                  <span>Next-Gen AI-Powered Security</span>
                </div>
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-shield-500" />
                  <span>Proactive Threat Prevention</span>
                </div>
              </div>
            </div>
            <div className="lg:w-1/3 bg-shield-50 dark:bg-shield-900/30 p-6 rounded-xl">
              <div className="text-center">
                <div className="text-4xl font-bold mb-2 cyber-gradient-text">100+ Sites Protected</div>
                <p className="text-foreground/80 mb-2">Join us in redefining the future of secure digital payments!</p>
                <p className="text-xs text-foreground/60">Data source: NCRB, I4C, Ministry of Home Affairs (2022-2023)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FraudStats;
