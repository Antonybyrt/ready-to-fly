import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plane, User, LogOut, Plus, Calendar, Moon, Sun, Menu, X } from 'lucide-react';
import auth from '@/services/auth.service';
import { useRouter } from 'next/router';
import { IUser } from '@/models/user.model';
import { Button } from './button';
import { cn } from '@/lib/utils';
import { useTheme } from '@/components/ThemeProvider';
import { AnimatePresence } from 'framer-motion';

const Header = () => {
  const [user, setUser] = useState<IUser | null>(); 
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const { isDarkMode, toggleTheme } = useTheme();

  useEffect(() => {
    const fetchUser = async () => {
      if (user) return;
      
      const userData = await auth.getUser();
      if (userData) {
        setUser(userData);
      } else {
        router.push('../auth/logout');
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { href: '/newFlight', label: 'New Flight', icon: Plus },
    { href: '/myFlights', label: 'My Flights', icon: Calendar },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn(
        "w-full fixed top-0 z-50 transition-all duration-300",
        isScrolled 
          ? isDarkMode 
            ? "bg-gray-900/90 backdrop-blur-md border-b border-gray-700 shadow-lg"
            : "bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-lg"
          : isDarkMode
            ? "bg-gradient-to-r from-gray-900 to-gray-800"
            : "bg-gradient-to-r from-blue-600 to-blue-700"
      )}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div 
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="relative">
              <Image
                src="/corsair.png"
                alt="Logo"
                width={60}
                height={60}
                className="rounded-full shadow-lg"
              />
            </div>
            <Link href="/dashboard">
              <motion.h1 
                className={cn(
                  "text-2xl font-bold transition-colors hidden sm:block",
                  isDarkMode 
                    ? "text-white hover:text-pink-300"
                    : "text-white hover:text-pink-200"
                )}
                whileHover={{ x: 5 }}
              >
                READY TO FLY
              </motion.h1>
            </Link>
          </motion.div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link href={item.href}>
                    <Button
                      variant="ghost"
                      className={cn(
                        "transition-all duration-200 group",
                        isDarkMode
                          ? "text-white hover:text-pink-300 hover:bg-white/10"
                          : "text-white hover:text-pink-200 hover:bg-white/20"
                      )}
                    >
                      <Icon className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                      {item.label}
                    </Button>
                  </Link>
                </motion.div>
              );
            })}
          </nav>

          {/* User Menu and Theme Toggle */}
          <motion.div 
            className="flex items-center space-x-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            {/* Theme Toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={toggleTheme}
              className={cn(
                "transition-colors",
                isDarkMode 
                  ? "border-gray-600 text-gray-300 hover:bg-gray-800" 
                  : "border-white/30 text-white hover:bg-white/20"
              )}
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>

            {user && (
              <motion.div
                className="flex items-center space-x-2 text-white"
                whileHover={{ scale: 1.05 }}
              >
                <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <span className="hidden sm:block font-medium">{user.email}</span>
              </motion.div>
            )}
            
            <Link href="../auth/logout">
              <Button
                variant="destructive"
                size="sm"
                className="bg-pink-500 hover:bg-pink-600 text-white"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Log out
              </Button>
            </Link>
          </motion.div>
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-white hover:bg-white/10"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className={cn(
              "md:hidden border-t",
              isDarkMode 
                ? "bg-gray-900/95 backdrop-blur-md border-gray-700" 
                : "bg-white/95 backdrop-blur-md border-gray-200"
            )}
          >
            <div className="container mx-auto px-4 py-4">
              <nav className="flex flex-col space-y-3">
                {navItems.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link href={item.href}>
                        <Button
                          variant="ghost"
                          className={cn(
                            "w-full justify-start transition-all duration-200 group",
                            isDarkMode
                              ? "text-white hover:text-pink-300 hover:bg-white/10"
                              : "text-gray-900 hover:text-pink-600 hover:bg-gray-100"
                          )}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <Icon className="w-4 h-4 mr-3 group-hover:scale-110 transition-transform" />
                          {item.label}
                        </Button>
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;