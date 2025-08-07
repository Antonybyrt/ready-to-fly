"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import auth from '@/services/auth.service';
import { ErrorService } from '@/services/error.service';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plane, Mail, Lock, Eye, EyeOff } from 'lucide-react';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const result = await auth.login(email, password);
            if (result) {
                router.push('/dashboard');
            } else {
                ErrorService.errorMessage("Error while connecting", "Email or password incorrect");
            }
        } catch (err) {
            ErrorService.errorMessage("Error while connecting", err as string);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center px-4 bg-gradient-to-br from-blue-950 via-blue-900 to-purple-900 relative overflow-hidden">
            {/* Animated background elements */}
            <motion.div
                className="absolute top-20 left-20 w-72 h-72 bg-pink-500/20 rounded-full blur-3xl"
                animate={{
                    x: [0, 100, 0],
                    y: [0, -100, 0],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear"
                }}
            />
            <motion.div
                className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
                animate={{
                    x: [0, -100, 0],
                    y: [0, 100, 0],
                }}
                transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: "linear"
                }}
            />

            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="w-full max-w-md"
            >
                <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-2xl">
                    <CardHeader className="text-center space-y-4">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                            className="mx-auto w-16 h-16 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full flex items-center justify-center shadow-lg"
                        >
                            <Plane className="w-8 h-8 text-white" />
                        </motion.div>
                        <div>
                            <CardTitle className="text-3xl font-bold text-white mb-2">Ready to Soar! ✈️</CardTitle>
                            <CardDescription className="text-white/80">Connect to your Ready to Fly account</CardDescription>
                        </div>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={onSubmit} className="space-y-6">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                <label htmlFor="email" className="block text-sm font-medium text-white/90 mb-2">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
                                    <Input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="pl-10 bg-white/10 border-white/20 text-white placeholder-white/50 focus:border-pink-400 focus:ring-pink-400"
                                        placeholder="Enter your email"
                                        required
                                    />
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 }}
                            >
                                <label htmlFor="password" className="block text-sm font-medium text-white/90 mb-2">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="pl-10 bg-white/10 border-white/20 text-white placeholder-white/50 focus:border-pink-400 focus:ring-pink-400"
                                        placeholder="Enter your password"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white/80"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                            >
                                <Button
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 transform hover:scale-105"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                                        />
                                    ) : null}
                                    {loading ? "Taking off..." : "Let's Fly!"}
                                </Button>
                            </motion.div>
                        </form>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="mt-8 text-center"
                        >
                            <p className="text-white/70 text-sm">
                                Don't have an account?{' '}
                                <a 
                                    href="mailto:antony.loussararian@gmail.com?subject=Access Request" 
                                    className="text-pink-300 hover:text-pink-200 underline transition-colors"
                                >
                                    Request access
                                </a>
                            </p>
                        </motion.div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
};

export default LoginPage;
