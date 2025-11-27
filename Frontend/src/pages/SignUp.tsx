import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import { z } from 'zod';

const signupSchema = z.object({
    fullName: z.string().min(3, 'Full name must be at least 3 characters'),
    email: z.string().email('Invalid email address'),
    telephone: z.string().min(10, 'Phone number must be at least 10 digits'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    role: z.enum(['member', 'admin']),
    service: z.enum(['water', 'sanitation', 'security']).optional(),
    district: z.string().min(1, 'District is required'),
    sector: z.string().min(1, 'Sector is required'),
}).refine((data) => {
    if (data.role === 'admin') {
        return data.service !== undefined;
    }
    return true;
}, {
    message: 'Service is required for admin accounts',
    path: ['service']
});
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/components/LanguageSwitcher";

type SignupFormData = {
    fullName: string;
    email: string;
    telephone: string;
    password: string;
    role: 'member' | 'admin';
    service?: 'water' | 'sanitation' | 'security';
    district: string;
    sector: string;
};

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
    const { t } = useTranslation();
    const [signupError, setSignupError] = useState<string | null>(null);
    const [districts] = useState<string[]>(["Kigali", "Gasabo", "Nyarugenge", "Kicukiro"]);
    const services = [
        { value: 'water', label: t('services.water') },
        { value: 'sanitation', label: t('services.sanitation') },
        { value: 'security', label: t('services.security') }
    ];
    const roles = [
        { value: 'member', label: t('signup.roles.member') },
        { value: 'admin', label: t('signup.roles.admin') }
    ];
    const [sectors, setSectors] = useState<string[]>([]);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<SignupFormData>({
        resolver: zodResolver(signupSchema),
        mode: "onBlur",
    });

    const selectedDistrict = watch('district');

    useEffect(() => {
        if (selectedDistrict) {
            setSectors([`${selectedDistrict} Sector 1`, `${selectedDistrict} Sector 2`]);
        } else {
            setSectors([]);
        }
    }, [selectedDistrict]);

    const mutation = useMutation({
        mutationFn: async (data: SignupFormData) => {
            setSignupError(null);
            try {
                const result = await signup({
                    fullName: data.fullName,
                    email: data.email,
                    password: data.password,
                    telephone: data.telephone,
                    district: data.district,
                    sector: data.sector,
                    role: data.role,
                    service: data.service
                });

                if (!result.success) {
                    throw new Error(result.message || 'Signup failed');
                }
            } catch (error) {
                const err = error as Error;
                setSignupError(err.message || t('signup.error'));
                throw error;
            }
        },
    });

    const onSubmit = (data: SignupFormData) => {
        mutation.mutate(data);
    };

    useEffect(() => {
        if (user) {
            navigate("/dashboard");
        }
    }, [user, navigate]);

    // Get translations
    const translations = {
        createAccount: t('signup.createAccount'),
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
        button: t('signup.button'),
        haveAccount: t('signup.haveAccount'),
        login: t('signup.login'),
        error: t('signup.error'),
        commonError: t('common.error'),
        goBack: t('common.goBack'),
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

                            <div>
                                <Label htmlFor="role">{t('signup.role')}</Label>
                                <select
                                    id="role"
                                    {...register("role")}
                                    className={`mt-1 block w-full rounded-md border ${errors.role ? 'border-red-500' : 'border-gray-300'} p-2`}
                                    disabled={mutation.isPending}
                                >
                                    <option value="">{t('signup.selectRole')}</option>
                                    {roles.map((role) => (
                                        <option key={role.value} value={role.value}>
                                            {role.label}
                                        </option>
                                    ))}
                                </select>
                                {errors.role && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.role.message as string}
                                    </p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="service">{t('signup.service')}</Label>
                                <select
                                    id="service"
                                    {...register("service")}
                                    className={`mt-1 block w-full rounded-md border ${errors.service ? 'border-red-500' : 'border-gray-300'} p-2`}
                                    disabled={!watch('role') || watch('role') !== 'admin' || mutation.isPending}
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