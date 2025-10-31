import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Loader2, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { z } from 'zod';

// Define registration form schema
const registerSchema = z.object({
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be less than 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phoneNumber: z.string()
    .min(10, 'Please enter a valid phone number')
    .regex(/^[0-9+\-\s()]+$/, 'Please enter a valid phone number'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signup, isLoading, isAuthenticated } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check for success messages in URL params
  React.useEffect(() => {
    const params = new URLSearchParams(location.search);
    const successMessage = params.get('success');

    if (successMessage) {
      setSuccess(successMessage);
      // Clear the success message after 5 seconds
      const timer = setTimeout(() => setSuccess(null), 5000);
      // Clean up the URL
      window.history.replaceState({}, document.title, window.location.pathname);
      return () => clearTimeout(timer);
    }
  }, [location]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      phoneNumber: '',
    },
  });

  // Watch password field to validate confirm password
  const password = watch('password');

  const onSubmit = async (data: RegisterFormData) => {
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);
    
    try {
      await signup({
        username: data.username,
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phoneNumber,
      });
      
      // Show success message
      setSuccess('Registration successful! Please check your email to verify your account.');
      
      // Redirect to login after a delay
      setTimeout(() => {
        navigate('/login', { 
          state: { 
            message: 'Registration successful! Please check your email to verify your account.' 
          },
          replace: true
        });
      }, 3000);
      
    } catch (err: any) {
      console.error('Registration error:', err);
      const errorMessage = err.response?.data?.message || 
                         err.response?.data?.error || 
                         err.message || 
                         'Registration failed. Please try again.';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-lg overflow-hidden">
          <CardHeader className="bg-blue-600 text-white p-6 relative">
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute left-4 top-4 text-white hover:bg-blue-700"
              onClick={() => navigate(-1)}
              disabled={isLoading || isSubmitting}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <CardTitle className="text-2xl font-bold text-center">Create an Account</CardTitle>
            <p className="text-center text-blue-100 text-sm mt-1">Join us today</p>
          </CardHeader>
          <CardContent className="p-6">
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {success ? (
              <Alert className="mb-6 bg-green-50 border-green-200">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertTitle>Success</AlertTitle>
                <AlertDescription className="text-green-700">
                  {success}
                </AlertDescription>
              </Alert>
            ) : (
              <p className="text-sm text-gray-600 mb-6">
                Fill in the form below to create your account.
              </p>
            )}
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="John"
                    disabled={isLoading || isSubmitting}
                    {...register('firstName')}
                    className={errors.firstName ? 'border-red-500' : ''}
                    autoComplete="given-name"
                  />
                  {errors.firstName && (
                    <p className="text-sm text-red-500 mt-1">{errors.firstName.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Doe"
                    disabled={isLoading || isSubmitting}
                    {...register('lastName')}
                    className={errors.lastName ? 'border-red-500' : ''}
                    autoComplete="family-name"
                  />
                  {errors.lastName && (
                    <p className="text-sm text-red-500 mt-1">{errors.lastName.message}</p>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="username">Username *</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="johndoe"
                  disabled={isLoading || isSubmitting}
                  {...register('username')}
                  className={errors.username ? 'border-red-500' : ''}
                  autoComplete="username"
                />
                {errors.username && (
                  <p className="text-sm text-red-500 mt-1">{errors.username.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  disabled={isLoading || isSubmitting}
                  {...register('email')}
                  className={errors.email ? 'border-red-500' : ''}
                  autoComplete="email"
                />
                {errors.email && (
                  <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number *</Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  disabled={isLoading || isSubmitting}
                  {...register('phoneNumber')}
                  className={errors.phoneNumber ? 'border-red-500' : ''}
                  autoComplete="tel"
                />
                {errors.phoneNumber && (
                  <p className="text-sm text-red-500 mt-1">{errors.phoneNumber.message}</p>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Password *</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    disabled={isLoading || isSubmitting}
                    {...register('password')}
                    className={errors.password ? 'border-red-500' : ''}
                    autoComplete="new-password"
                  />
                  {errors.password && (
                    <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password *</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    disabled={isLoading || isSubmitting}
                    {...register('confirmPassword')}
                    className={errors.confirmPassword ? 'border-red-500' : ''}
                    autoComplete="new-password"
                  />
                  {errors.confirmPassword && (
                    <p className="text-sm text-red-500 mt-1">{errors.confirmPassword.message}</p>
                  )}
                </div>
              </div>
              
              <div className="pt-2">
                <Button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
                  disabled={isLoading || isSubmitting}
                  size="lg"
                >
                  {(isLoading || isSubmitting) ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
          
          <CardFooter className="bg-gray-50 px-6 py-4 border-t">
            <p className="text-center text-sm text-gray-600 w-full">
              Already have an account?{' '}
              <Link 
                to="/login" 
                className="font-medium text-blue-600 hover:underline"
                onClick={(e) => {
                  if (isSubmitting || isLoading) e.preventDefault();
                }}
              >
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
