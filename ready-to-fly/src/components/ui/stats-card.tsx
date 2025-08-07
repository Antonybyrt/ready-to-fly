import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  color?: 'blue' | 'green' | 'red' | 'purple' | 'pink' | 'yellow';
}

const colorVariants = {
  blue: {
    bg: 'bg-blue-500/10',
    text: 'text-blue-600',
    icon: 'text-blue-500'
  },
  green: {
    bg: 'bg-green-500/10',
    text: 'text-green-600',
    icon: 'text-green-500'
  },
  red: {
    bg: 'bg-red-500/10',
    text: 'text-red-600',
    icon: 'text-red-500'
  },
  purple: {
    bg: 'bg-purple-500/10',
    text: 'text-purple-600',
    icon: 'text-purple-500'
  },
  pink: {
    bg: 'bg-pink-500/10',
    text: 'text-pink-600',
    icon: 'text-pink-500'
  },
  yellow: {
    bg: 'bg-yellow-500/10',
    text: 'text-yellow-600',
    icon: 'text-yellow-500'
  }
};

export function StatsCard({ 
  title, 
  value, 
  description, 
  icon: Icon, 
  trend, 
  className,
  color = 'blue' 
}: StatsCardProps) {
  const colors = colorVariants[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={cn("h-full hover:shadow-lg transition-all duration-300 border-0 shadow-md", className)}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className={cn("p-3 rounded-full", colors.bg)}>
              <Icon className={cn("w-6 h-6", colors.icon)} />
            </div>
            {trend && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className={cn(
                  "flex items-center space-x-1 text-sm font-medium",
                  trend.isPositive ? "text-green-600" : "text-red-600"
                )}
              >
                <span>{trend.isPositive ? '+' : ''}{trend.value}%</span>
              </motion.div>
            )}
          </div>
          <CardTitle className="text-lg font-semibold text-gray-900">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {value}
          </div>
          {description && (
            <p className="text-sm text-gray-600">
              {description}
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
} 