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

import { signupSchema } from "@/lib/validation";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "react-i18next";

// Extend the signup schema to include cooperativeName
type SignupFormData = {
    fullName: string;
    email: string;
    telephone: string;
    password: string;
    confirmPassword: string;
    district: string;
    sector: string;
    cooperativeName: string;
};
export default function SignupPage() {
    const { signup, user } = useAuth();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const [signupError, setSignupError] = useState<string | null>(null);
    const [districts] = useState<string[]>(["Kigali", "Gasabo", "Nyarugenge", "Kicukiro"]);
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
        // Update sectors based on selected district
        if (selectedDistrict) {
            // This is a simplified example - in a real app, you'd fetch sectors for the selected district
            setSectors([`${selectedDistrict} Sector 1`, `${selectedDistrict} Sector 2`, `${selectedDistrict} Sector 3`]);
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
                    // Add cooperativeName to user metadata or handle it as needed
                });

                if (!result.success) {
                    throw new Error(result.message || 'Signup failed');
                }
            } catch (error) {
                const err = error as Error;
                setSignupError(err.message || t("signupPage.error"));
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

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-blue-200 px-4"
        >
            <div className="w-full max-w-lg">
                <Card className="shadow-lg rounded-2xl">
                    <CardContent className="p-8">

                        {/* Title */}
                        <motion.h2
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-3xl font-bold text-center text-blue-600 mb-6"
                        >
                            {t("signupPage.createAccount")}
                        </motion.h2>

                        {/* Error Alert */}
                        {signupError && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-4"
                            >
                                <Alert variant="destructive">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertTitle>{t("common.error")}</AlertTitle>
                                    <AlertDescription>{signupError}</AlertDescription>
                                </Alert>
                            </motion.div>
                        )}

                        {/* Form */}
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                            {/* FULL NAME */}
                            <div>
                                <Label htmlFor="fullName">{t("signupPage.fullName")}</Label>
                                <Input
                                    id="fullName"
                                    type="text"
                                    placeholder={t("signupPage.fullNamePlaceholder")}
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

                            {/* EMAIL */}
                            <div>
                                <Label htmlFor="email">{t("signupPage.email")}</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder={t("signupPage.emailPlaceholder")}
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

                            {/* PHONE */}
                            <div>
                                <Label htmlFor="telephone">{t("signupPage.telephone")}</Label>
                                <Input
                                    id="telephone"
                                    type="text"
                                    placeholder={t("signupPage.telephonePlaceholder")}
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

                            {/* DISTRICT */}
                            <div>
                                <Label htmlFor="district">District</Label>
                                <select
                                    id="district"
                                    {...register("district")}
                                    className={`mt-1 block w-full rounded-md border ${errors.district ? 'border-red-500' : 'border-gray-300'} p-2`}
                                    disabled={mutation.isPending}
                                >
                                    <option value="">Select District</option>
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

                            {/* SECTOR */}
                            <div>
                                <Label htmlFor="sector">Sector</Label>
                                <select
                                    id="sector"
                                    {...register("sector")}
                                    className={`mt-1 block w-full rounded-md border ${errors.sector ? 'border-red-500' : 'border-gray-300'} p-2`}
                                    disabled={!selectedDistrict || mutation.isPending}
                                >
                                    <option value="">Select Sector</option>
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

                            {/* PASSWORD */}
                            <div>
                                <Label htmlFor="password">{t("signupPage.password")}</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
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

                            {/* BUTTONS */}
                            <div className="flex flex-col space-y-3">
                                <Button type="submit" className="w-full" disabled={mutation.isPending}>
                                    {mutation.isPending && (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    )}
                                    {t("signupPage.button")}
                                </Button>

                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full"
                                    onClick={() => navigate("/")}
                                >
                                    {t("goBack")}
                                </Button>
                            </div>
                        </form>

                        {/* Already have an account */}
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="text-center text-gray-600 text-sm mt-6"
                        >
                            {t("signupPage.haveAccount")}{" "}
                            <Link to="/login" className="text-blue-600 font-medium hover:underline">
                                {t("signupPage.login")}
                            </Link>
                        </motion.p>
                    </CardContent>
                </Card>
            </div>
        </motion.div>
    );
}
