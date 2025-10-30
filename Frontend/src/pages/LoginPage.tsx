import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2, Mail, Lock, ArrowRight } from "lucide-react";
import { toast } from "sonner";

interface LoginFormData {
  emailOrPhone: string;
  password: string;
}

export default function LoginPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const redirectBasedOnRole = (role: string) => {
    switch (role) {
      case 'ROLE_SUPERADMIN':
        navigate('/superadmin');
        break;
      case 'ROLE_ADMIN':
        navigate('/admin');
        break;
      case 'ROLE_USER':
      default:
        navigate('/dashboard');
    }
  };

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user.roles && user.roles.length > 0) {
        redirectBasedOnRole(user.roles[0]);
      }
    }
  }, [navigate]);

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate login delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock credentials for different user types
      let mockUser: any = null;
      const emailLower = data.emailOrPhone.toLowerCase();
      
      // SuperAdmin credentials
      if (emailLower === 'superadmin@example.com' || emailLower === '+250788000000') {
        mockUser = {
          id: '1',
          username: 'SuperAdmin',
          email: 'superadmin@example.com',
          emailOrPhone: data.emailOrPhone,
          roles: ['ROLE_SUPERADMIN'],
          telephone: '+250788000000',
          district: 'Kigali',
          sector: 'Nyarugenge'
        };
      }
      // Admin credentials
      else if (emailLower === 'admin@example.com' || emailLower === '+250788111111') {
        mockUser = {
          id: '2',
          username: 'Admin User',
          email: 'admin@example.com',
          emailOrPhone: data.emailOrPhone,
          roles: ['ROLE_ADMIN'],
          telephone: '+250788111111',
          district: 'Gasabo',
          sector: 'Gisozi'
        };
      }
      // Regular User credentials
      else if (emailLower === 'user@example.com' || emailLower === '+250788222222') {
        mockUser = {
          id: '3',
          username: 'Regular User',
          email: 'user@example.com',
          emailOrPhone: data.emailOrPhone,
          roles: ['ROLE_USER'],
          telephone: '+250788222222',
          district: 'Kicukiro',
          sector: 'Gatenga'
        };
      }
      // Default: accept any credentials as regular user
      else {
        mockUser = {
          id: '4',
          username: 'Test User',
          email: data.emailOrPhone,
          emailOrPhone: data.emailOrPhone,
          roles: ['ROLE_USER'],
          telephone: '+250788999999',
          district: 'Kigali',
          sector: 'Nyarugenge'
        };
      }
      
      // Store in localStorage
      localStorage.setItem('token', 'mock-token-' + Date.now());
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      toast.success('Login successful!');
      redirectBasedOnRole(mockUser.roles[0]);
    } catch (error: any) {
      console.error('Login error:', error);
      setError('Failed to login. Please check your credentials.');
      toast.error('Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 px-4 relative overflow-hidden"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo Section */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl mb-4 shadow-lg"
          >
            <span className="text-white font-bold text-2xl">RB</span>
          </motion.div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-blue-200">Sign in to Rwanda Bills</p>
        </div>

        {/* Main Card */}
        <Card className="shadow-2xl rounded-3xl overflow-hidden border-0 backdrop-blur-xl bg-white/95">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Email/Phone Field */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-2"
              >
                <Label htmlFor="emailOrPhone" className="text-gray-700 font-semibold">Email or Phone</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-blue-500" />
                  <Input
                    id="emailOrPhone"
                    type="text"
                    placeholder="superadmin@example.com"
                    {...register('emailOrPhone')}
                    className="pl-10 py-2 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Try: superadmin@example.com | admin@example.com | user@example.com
                </p>
              </motion.div>

              {/* Password Field */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-2"
              >
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-gray-700 font-semibold">Password</Label>
                  <a href="#" className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                    Forgot?
                  </a>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-blue-500" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    {...register('password', { required: 'Password is required' })}
                    className="pl-10 py-2 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition"
                  />
                </div>
              </motion.div>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-4 bg-red-50 border border-red-200 rounded-xl"
                >
                  <p className="text-red-600 text-sm font-medium">{error}</p>
                </motion.div>
              )}

              {/* Sign In Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-4 rounded-xl transition duration-200 flex items-center justify-center gap-2 shadow-lg"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign In
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </motion.div>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">New to Rwanda Bills?</span>
                </div>
              </div>

              {/* Sign Up Link */}
              <a
                href="/signup"
                className="w-full block text-center py-3 px-4 rounded-xl border-2 border-blue-200 text-blue-600 font-semibold hover:bg-blue-50 transition duration-200"
              >
                Create Account
              </a>
            </form>
          </CardContent>
        </Card>

        {/* Footer Text */}
        <p className="text-center text-blue-200 text-xs mt-6">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </motion.div>
    </motion.div>
  );
}
