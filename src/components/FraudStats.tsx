
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

const fraudData = [
  { month: 'Jan', phishing: 420, malware: 240, scams: 380 },
  { month: 'Feb', phishing: 460, malware: 280, scams: 390 },
  { month: 'Mar', phishing: 490, malware: 300, scams: 410 },
  { month: 'Apr', phishing: 520, malware: 350, scams: 450 },
  { month: 'May', phishing: 580, malware: 390, scams: 480 },
  { month: 'Jun', phishing: 620, malware: 420, scams: 510 },
  { month: 'Jul', phishing: 680, malware: 450, scams: 540 },
  { month: 'Aug', phishing: 720, malware: 480, scams: 580 },
  { month: 'Sep', phishing: 780, malware: 520, scams: 610 },
  { month: 'Oct', phishing: 850, malware: 560, scams: 640 },
  { month: 'Nov', phishing: 910, malware: 590, scams: 680 },
  { month: 'Dec', phishing: 990, malware: 630, scams: 730 }
];

const demographicData = [
  { age: '18-24', victims: 25 },
  { age: '25-34', victims: 32 },
  { age: '35-44', victims: 18 },
  { age: '45-54', victims: 14 },
  { age: '55-64', victims: 8 },
  { age: '65+', victims: 3 }
];

const statsItems = [
  {
    icon: AlertTriangle,
    title: '8.7 Million',
    description: 'Phishing attacks reported in India last year',
    accentColor: 'red-500',
    darkAccentColor: 'red-400'
  },
  {
    icon: FileWarning,
    title: '₹1,200 Crore',
    description: 'Lost to online fraud in the last quarter',
    accentColor: 'amber-500',
    darkAccentColor: 'amber-400'
  },
  {
    icon: TrendingUp,
    title: '47% Increase',
    description: 'In fraud attempts since last year',
    accentColor: 'purple-500',
    darkAccentColor: 'purple-400'
  },
  {
    icon: Users,
    title: '1 in 4',
    description: 'Indians has experienced online fraud',
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
                  phishing: { label: "Phishing", theme: { light: "#6150fc", dark: "#7c7aff" } },
                  malware: { label: "Malware", theme: { light: "#ff719A", dark: "#ff719A" } },
                  scams: { label: "Scams", theme: { light: "#34bfdb", dark: "#73daeb" } }
                }}
              >
                <AreaChart data={fraudData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area 
                    type="monotone" 
                    dataKey="phishing" 
                    name="phishing" 
                    stackId="1" 
                    stroke="var(--color-phishing)" 
                    fill="var(--color-phishing)" 
                    fillOpacity={0.6}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="malware" 
                    name="malware" 
                    stackId="1" 
                    stroke="var(--color-malware)" 
                    fill="var(--color-malware)" 
                    fillOpacity={0.6}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="scams" 
                    name="scams" 
                    stackId="1" 
                    stroke="var(--color-scams)" 
                    fill="var(--color-scams)" 
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
                How FraudShield Makes a Difference
              </h3>
              <p className="text-foreground/80 mb-6">
                By leveraging advanced AI algorithms, FraudShield has detected and prevented over 12 million
                fraud attempts, protecting thousands of users across India from financial loss and identity theft.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-shield-500" />
                  <span>12M+ Threats Blocked</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-shield-500" />
                  <span>50K+ Protected Users</span>
                </div>
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-shield-500" />
                  <span>99.7% Detection Rate</span>
                </div>
              </div>
            </div>
            <div className="lg:w-1/3 bg-shield-50 dark:bg-shield-900/30 p-6 rounded-xl">
              <div className="text-center">
                <div className="text-4xl font-bold mb-2 cyber-gradient-text">₹850 Crore+</div>
                <p className="text-foreground/80">Potential financial loss prevented for users in India</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FraudStats;
