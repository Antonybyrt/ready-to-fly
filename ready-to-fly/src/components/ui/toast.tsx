import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';

export interface ToastProps {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  onClose: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({ 
  id, 
  type, 
  title, 
  message, 
  duration = 5000, 
  onClose 
}) => {
  const { isDarkMode } = useTheme();
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const startTime = Date.now();
    const endTime = startTime + duration;

    const updateProgress = () => {
      const now = Date.now();
      const remaining = Math.max(0, endTime - now);
      const newProgress = (remaining / duration) * 100;
      
      if (newProgress > 0) {
        setProgress(newProgress);
        requestAnimationFrame(updateProgress);
      } else {
        onClose(id);
      }
    };

    const timer = setTimeout(() => {
      onClose(id);
    }, duration);

    requestAnimationFrame(updateProgress);

    return () => clearTimeout(timer);
  }, [duration, id, onClose]);

  const getToastStyles = () => {
    const baseStyles = `relative overflow-hidden rounded-lg shadow-lg border ${
      isDarkMode 
        ? 'bg-gray-800/95 backdrop-blur-md border-gray-700' 
        : 'bg-white/95 backdrop-blur-md border-gray-200'
    }`;

    switch (type) {
      case 'success':
        return `${baseStyles} border-green-500/20`;
      case 'error':
        return `${baseStyles} border-red-500/20`;
      case 'warning':
        return `${baseStyles} border-yellow-500/20`;
      case 'info':
        return `${baseStyles} border-blue-500/20`;
      default:
        return baseStyles;
    }
  };

  const getIcon = () => {
    const iconClass = `w-5 h-5 ${
      isDarkMode ? 'text-white' : 'text-white'
    }`;

    switch (type) {
      case 'success':
        return <CheckCircle className={iconClass} />;
      case 'error':
        return <AlertCircle className={iconClass} />;
      case 'warning':
        return <AlertTriangle className={iconClass} />;
      case 'info':
        return <Info className={iconClass} />;
      default:
        return <Info className={iconClass} />;
    }
  };

  const getIconBg = () => {
    switch (type) {
      case 'success':
        return 'bg-gradient-to-br from-green-400 to-green-600';
      case 'error':
        return 'bg-gradient-to-br from-red-400 to-red-600';
      case 'warning':
        return 'bg-gradient-to-br from-yellow-400 to-yellow-600';
      case 'info':
        return 'bg-gradient-to-br from-blue-400 to-blue-600';
      default:
        return 'bg-gradient-to-br from-gray-400 to-gray-600';
    }
  };

  const getProgressColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-500';
      case 'warning':
        return 'bg-yellow-500';
      case 'info':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 300, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 300, scale: 0.95 }}
      transition={{ type: "spring", duration: 0.3 }}
      className={`w-80 max-w-sm ${getToastStyles()}`}
    >
      {/* Progress Bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700">
        <motion.div
          className={`h-full ${getProgressColor()}`}
          initial={{ width: '100%' }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>

      <div className="p-4">
        <div className="flex items-start space-x-3">
          {/* Icon */}
          <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${getIconBg()}`}>
            {getIcon()}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <p className={`text-sm font-semibold ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {title}
            </p>
            {message && (
              <p className={`text-sm mt-1 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {message}
              </p>
            )}
          </div>

          {/* Close Button */}
          <button
            onClick={() => onClose(id)}
            className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
              isDarkMode 
                ? 'text-gray-400 hover:text-white hover:bg-gray-700' 
                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
            }`}
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default Toast; 