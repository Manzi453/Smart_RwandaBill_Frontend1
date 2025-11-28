import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent } from "@/components/ui/Card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { z } from 'zod';
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/components/LanguageSwitcher";

// Define valid roles and services as constants
export const USER_ROLES = ['admin', 'member'] as const;
export type UserRole = typeof USER_ROLES[number];

export const SERVICE_TYPES = ['water', 'sanitation', 'security'] as const;
export type ServiceType = typeof SERVICE_TYPES[number];

const signupSchema = z.object({
    fullName: z.string()
        .min(3, 'Full name must be at least 3 characters')
        .max(100, 'Full name must be less than 100 characters'),
    email: z.string()
        .email('Invalid email address')
        .min(5, 'Email must be at least 5 characters')
        .max(100, 'Email must be less than 100 characters'),
    telephone: z.string()
        .min(10, 'Phone number must be at least 10 digits')
        .max(20, 'Phone number must be less than 20 digits'),
    password: z.string()
        .min(8, 'Password must be at least 8 characters')
        .max(100, 'Password must be less than 100 characters'),
    role: z.enum(USER_ROLES).default('member'),
    service: z.enum(SERVICE_TYPES).optional(),
    district: z.string()
        .min(1, 'District is required')
        .max(100, 'District must be less than 100 characters'),
    sector: z.string()
        .min(1, 'Sector is required')
        .max(100, 'Sector must be less than 100 characters'),
}).refine((data) => {
    if (data.role === 'admin') {
        return data.service !== undefined;
    }
    return true;
}, {
    message: 'Service is required for admin accounts',
    path: ['service']
});

type SignupFormData = z.infer<typeof signupSchema>;

declare global {
    interface Error {
        response?: {
            status?: number;
            data?: {
                message?: string;
            };
        };
    }
}

export default function SignupPage() {
    const { signup, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useTranslation();
    const [signupError, setSignupError] = useState<string | null>(null);
    const [isAdminSignup, setIsAdminSignup] = useState(false);
    const [districts] = useState<string[]>(["Kigali", "Gasabo", "Nyarugenge", "Kicukiro"]);
    const [sectors, setSectors] = useState<string[]>([]);
    
    // Services for admin signup
    const services = [
        { value: 'water', label: t('services.water') },
        { value: 'sanitation', label: t('services.sanitation') },
        { value: 'security', label: t('services.security') }
    ];
    
    // Check if this is an admin signup from the URL
    useEffect(() => {
        const isAdmin = new URLSearchParams(location.search).get('type') === 'admin';
        setIsAdminSignup(isAdmin);
    }, [location]);

    const {
        register,
        handleSubmit,
        watch,
        resetField,
        formState: { errors },
    } = useForm<SignupFormData>({
        resolver: zodResolver(signupSchema),
        mode: "onBlur",
        defaultValues: {
            role: undefined
        }
    });

    const selectedDistrict = watch('district');

    // Update form when switching between user and admin signup
    useEffect(() => {
        if (isAdminSignup) {
            resetField('role', { defaultValue: 'admin' });
        } else {
            resetField('role', { defaultValue: undefined });
            resetField('service', { defaultValue: undefined });
        }
    }, [isAdminSignup, resetField]);

    useEffect(() => {
        if (selectedDistrict) {
            setSectors([`${selectedDistrict} Sector 1`, `${selectedDistrict} Sector 2`]);
        } else {
            setSectors([]);
        }
    }, [selectedDistrict]);

    const mutation = useMutation({
        mutationFn: async (formData: SignupFormData) => {
            setSignupError(null);
            
            // Prepare the signup data with proper typing
            // Prepare signup data with proper typing
            const signupData = {
                fullName: formData.fullName,
                email: formData.email,
                telephone: formData.telephone,
                district: formData.district,
                sector: formData.sector,
                password: formData.password,
                role: isAdminSignup ? 'admin' as const : 'member' as const,
                ...(isAdminSignup && formData.service ? {
                    service: formData.service
                } : {})
            };
            
            console.log('Prepared signup data:', JSON.stringify(signupData, null, 2));

            try {
                const result = await signup(signupData);
                
                if (!result.success) {
                    throw new Error(result.message || 'Signup failed');
                }
                
                return result;
            } catch (error) {
                const err = error as Error;
                setSignupError(err.message || t('signup.error'));
                throw error;
            }
        },
    });

    const onSubmit = async (formData: SignupFormData) => {
        try {
            await mutation.mutateAsync(formData, {
                onSuccess: (result) => {
                    // Show success message
                    toast.success(result.message || (isAdminSignup 
                        ? 'Admin registration submitted for approval' 
                        : 'Registration successful! You can now log in.'));
                    
                    // Reset form
                    // navigate to login after a short delay
                    setTimeout(() => {
                        navigate('/login', { 
                            state: { 
                                message: isAdminSignup 
                                    ? 'Your admin account is pending approval. You will be notified once approved.'
                                    : 'You can now log in with your credentials.'
                            } 
                        });
                    }, 2000);
                },
                onError: (error: Error) => {
                    console.error('Signup error:', error);
                    // Show more detailed error message if available
                    const errorMessage = error.response?.data?.message || error.message || 'Signup failed';
                    toast.error(errorMessage);
                }
            });
        } catch (error) {
            console.error('Unexpected error during signup:', error);
            toast.error('An unexpected error occurred. Please try again.');
        }
    };

    useEffect(() => {
        if (user) {
            navigate("/dashboard");
        }
    }, [user, navigate]);

    // Get translations
    const translations = {
        createAccount: isAdminSignup ? t('signup.createAdminAccount') : t('signup.createAccount'),
        fullName: t('signup.fullName'),
        fullNamePlaceholder: t('signup.fullNamePlaceholder'),
        email: t('signup.email'),
        emailPlaceholder: t('signup.emailPlaceholder'),
        telephone: t('signup.telephone'),
        telephonePlaceholder: t('signup.telephonePlaceholder'),
        district: t('signup.district'),
        selectDistrict: t('signup.selectDistrict'),
        sector: t('signup.sector'),
        selectSector: t('signup.selectSector'),
        role: t('signup.role'),
        selectRole: t('signup.selectRole'),
        service: t('signup.service'),
        selectService: t('signup.selectService'),
        password: t('signup.password'),
        passwordPlaceholder: t('signup.passwordPlaceholder'),
        button: isAdminSignup ? t('signup.requestAdminAccess') : t('signup.button'),
        haveAccount: t('signup.haveAccount'),
        login: t('signup.login'),
        error: t('signup.error'),
        commonError: t('common.error'),
        goBack: t('common.goBack'),
        userType: {
            user: t('signup.userType.user'),
            admin: t('signup.userType.admin')
        },
        adminNote: t('signup.adminNote')
    };
    
    const toggleUserType = () => {
        const newType = isAdminSignup ? 'user' : 'admin';
        navigate(`/signup?type=${newType}`, { replace: true });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-blue-200 px-4"
        >
            <div className="w-full max-w-lg relative">
                <div className="absolute top-4 right-4 z-10">
                    <LanguageSwitcher />
                </div>
                <Card className="shadow-lg rounded-2xl">
                    <CardContent className="p-8">
                        <motion.h2
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-3xl font-bold text-center text-blue-600 mb-6"
                        >
                            {translations.createAccount}
                        </motion.h2>

                        {signupError && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-4"
                            >
                                <Alert variant="destructive">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertTitle>{translations.commonError}</AlertTitle>
                                    <AlertDescription>{signupError}</AlertDescription>
                                </Alert>
                            </motion.div>
                        )}

                        {/* User Type Toggle */}
                        <div className="flex justify-center mb-6">
                            <div className="bg-gray-100 p-1 rounded-lg flex">
                                <button
                                    type="button"
                                    className={`px-4 py-2 rounded-md ${!isAdminSignup ? 'bg-white shadow' : 'hover:bg-gray-50'}`}
                                    onClick={toggleUserType}
                                >
                                    {translations.userType.user}
                                </button>
                                <button
                                    type="button"
                                    className={`px-4 py-2 rounded-md ${isAdminSignup ? 'bg-white shadow' : 'hover:bg-gray-50'}`}
                                    onClick={toggleUserType}
                                >
                                    {translations.userType.admin}
                                </button>
                            </div>
                        </div>

                        {isAdminSignup && (
                            <div className="mb-4 p-3 bg-blue-50 text-blue-700 text-sm rounded-md">
                                {translations.adminNote}
                            </div>
                        )}

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <div>
                                <Label htmlFor="fullName">{translations.fullName}</Label>
                                <Input
                                    id="fullName"
                                    type="text"
                                    placeholder={translations.fullNamePlaceholder}
                                    {...register("fullName")}
                                    className={`mt-1 ${errors.fullName ? "border-red-500" : ""}`}
                                    disabled={mutation.isPending}
                                />
                                {errors.fullName && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.fullName.message as string}
                                    </p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="email">{translations.email}</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder={translations.emailPlaceholder}
                                    {...register("email")}
                                    className={`mt-1 ${errors.email ? "border-red-500" : ""}`}
                                    disabled={mutation.isPending}
                                />
                                {errors.email && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.email.message as string}
                                    </p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="telephone">{translations.telephone}</Label>
                                <Input
                                    id="telephone"
                                    type="text"
                                    placeholder={translations.telephonePlaceholder}
                                    {...register("telephone")}
                                    className={`mt-1 ${errors.telephone ? "border-red-500" : ""}`}
                                    disabled={mutation.isPending}
                                />
                                {errors.telephone && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.telephone.message as string}
                                    </p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="district">{translations.district}</Label>
                                <select
                                    id="district"
                                    {...register("district")}
                                    className={`mt-1 block w-full rounded-md border ${errors.district ? 'border-red-500' : 'border-gray-300'} p-2`}
                                    disabled={mutation.isPending}
                                >
                                    <option value="">{translations.selectDistrict}</option>
                                    {districts.map((district) => (
                                        <option key={district} value={district}>
                                            {district}
                                        </option>
                                    ))}
                                </select>
                                {errors.district && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.district.message as string}
                                    </p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="sector">{translations.sector}</Label>
                                <select
                                    id="sector"
                                    {...register("sector")}
                                    className={`mt-1 block w-full rounded-md border ${errors.sector ? 'border-red-500' : 'border-gray-300'} p-2`}
                                    disabled={!selectedDistrict || mutation.isPending}
                                >
                                    <option value="">{translations.selectSector}</option>
                                    {sectors.map((sector) => (
                                        <option key={sector} value={sector}>
                                            {sector}
                                        </option>
                                    ))}
                                </select>
                                {errors.sector && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.sector.message as string}
                                    </p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="password">{translations.password}</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder={translations.passwordPlaceholder}
                                    {...register("password")}
                                    className={`mt-1 ${errors.password ? "border-red-500" : ""}`}
                                    disabled={mutation.isPending}
                                />
                                {errors.password && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.password.message as string}
                                    </p>
                                )}
                            </div>

                            {isAdminSignup && (
                                <>
                                    <input type="hidden" {...register("role")} value="admin" />
                                    <div>
                                        <Label htmlFor="service">{t('signup.service')}</Label>
                                        <select
                                            id="service"
                                            {...register("service")}
                                            className={`mt-1 block w-full rounded-md border ${errors.service ? 'border-red-500' : 'border-gray-300'} p-2`}
                                            disabled={mutation.isPending}
                                        >
                                            <option value="">{t('signup.selectService')}</option>
                                            {services.map((service) => (
                                                <option key={service.value} value={service.value}>
                                                    {service.label}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.service && (
                                            <p className="mt-1 text-sm text-red-500">
                                                {errors.service.message as string}
                                            </p>
                                        )}
                                    </div>
                                </>
                            )}

                            <div className="flex flex-col space-y-3">
                                <Button type="submit" className="w-full" disabled={mutation.isPending}>
                                    {mutation.isPending && (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    )}
                                    {translations.button}
                                </Button>

                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full"
                                    onClick={() => navigate("/")}
                                >
                                    {translations.goBack}
                                </Button>
                            </div>
                        </form>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="text-center text-gray-600 text-sm mt-6"
                        >
                            {translations.haveAccount}{" "}
                            <Link to="/login" className="text-blue-600 font-medium hover:underline">
                                {translations.login}
                            </Link>
                        </motion.p>
                    </CardContent>
                </Card>
            </div>
        </motion.div>
    );
}