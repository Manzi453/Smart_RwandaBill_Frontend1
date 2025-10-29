import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { authService } from "@/lib/api/auth";
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

  // Check if user is already logged in
  useEffect(() => {
    if (authService.isAuthenticated()) {
      const user = authService.getCurrentUser();
      if (user) {
        redirectBasedOnRole(user.roles[0]);
      }
    }
  }, []);

  const redirectBasedOnRole = (role: string) => {
    switch (role) {
      case 'ROLE_SUPERADMIN':
        navigate('/superadmin/dashboard');
        break;
      case 'ROLE_ADMIN':
        navigate('/admin/dashboard');
        break;
      case 'ROLE_USER':
      default:
        navigate('/user/dashboard');
    }
  };
    setIsLoading(true);
    setError(null);
    
    try {
      await authService.login({
        emailOrPhone: data.emailOrPhone,
        password: data.password
      });
      
      const user = authService.getCurrentUser();
      if (user) {
        toast.success('Login successful!');
        redirectBasedOnRole(user.roles[0]);
      }
    } catch (error: any) {
      console.error('Login error:', error);
      setError(error.message || 'Failed to login. Please check your credentials.');
      toast.error(error.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-blue-200 px-4"
    >
      <div className="w-full max-w-md">
        <Card className="shadow-lg rounded-2xl overflow-hidden">
          <CardHeader className="bg-blue-600 text-white p-6">
            <CardTitle className="text-2xl font-bold text-center">Welcome Back</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="emailOrPhone" className="text-gray-700">Email or Phone Number</Label>
                  <Input
                    id="emailOrPhone"
                    type="text"
                    placeholder="Email or Phone Number"
                    {...register('emailOrPhone')}
                    error={errors.emailOrPhone?.message}
                    className="w-full"
                  />
                  {errors.emailOrPhone && (
                    <p className="text-red-500 text-sm mt-1">{errors.emailOrPhone?.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-gray-700">Password</Label>
                    <a href="/forgot-password" className="text-sm text-blue-600 hover:underline">
                      Forgot password?
                    </a>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    className={`w-full ${errors.password ? 'border-red-500' : ''}`}
                    {...register('password', { required: 'Password is required' })}
                  />
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                  )}
                </div>

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition duration-200"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>

              <div className="mt-4 text-center text-sm text-gray-600">
                Don't have an account?{' '}
                <a href="/signup" className="text-blue-600 hover:underline font-medium">
                  Sign up
                </a>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
