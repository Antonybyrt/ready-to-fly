import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { cn } from '@/lib/utils';
import { Home, Plus, Calendar, BarChart3, Settings } from 'lucide-react';

interface NavigationItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navigationItems: NavigationItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/newFlight', label: 'Nouveau Vol', icon: Plus },
  { href: '/myFlights', label: 'Mes Vols', icon: Calendar },
];

export function Navigation() {
  const router = useRouter();

  return (
    <nav className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex items-center space-x-2 bg-white/80 backdrop-blur-md rounded-full px-4 py-2 shadow-lg border border-white/20"
      >
        {navigationItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = router.pathname === item.href;
          
          return (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * index }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href={item.href}>
                <motion.div
                  className={cn(
                    "flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-200",
                    isActive
                      ? "bg-gradient-to-r from-pink-400 to-pink-600 text-white shadow-lg"
                      : "text-gray-600 hover:text-pink-500 hover:bg-pink-50"
                  )}
                  whileHover={{ y: -2 }}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium hidden sm:block">
                    {item.label}
                  </span>
                </motion.div>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>
    </nav>
  );
} 