import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
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
import { loginSchema, LoginFormData } from "@/lib/validation";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "react-i18next";

interface LoginError extends Error {
    response?: {
        status: number;
        data?: {
            message?: string;
            approved?: boolean;
        };
    };
}

export default function LoginPage() {
    const navigate = useNavigate();
    const { login, user } = useAuth();
    const { t } = useTranslation();
    const [loginError, setLoginError] = useState<string | null>(null);
    const [isUnapproved, setIsUnapproved] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        mode: "onBlur",
    });

    const mutation = useMutation({
        mutationFn: async (data: LoginFormData) => {
            setLoginError(null);
            setIsUnapproved(false);

            try {
                await login({
                    email: data.email,
                    password: data.password
                });
            } catch (error) {
                const loginError = error as LoginError;

                if (loginError.response?.status === 403) {
                    setIsUnapproved(true);
                    setLoginError(t("loginPage.error"));
                }
                else if (loginError.message) {
                    setLoginError(loginError.message);
                }
                else if (loginError.response?.data?.message) {
                    setLoginError(loginError.response.data.message);
                }
                else {
                    setLoginError(t("loginPage.error"));
                }

                throw error;
            }
        },
    });

    const onSubmit = (data: LoginFormData) => {
        mutation.mutate(data);
    };

    useEffect(() => {
        if (user) {
            switch (user.role) {
                case "superadmin":
                    navigate("/superadmin");
                    break;
                case "admin":
                    navigate("/admin");
                    break;
                case "member":
                    navigate("/dashboard");
                    break;
                default:
                    navigate("/");
            }
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
            <div className="w-full max-w-md">
                <Card className="shadow-lg rounded-2xl">
                    <CardContent className="p-8">

                        <motion.h2
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-3xl font-bold text-center text-blue-600 mb-6"
                        >
                            {t("loginPage.welcome")}
                        </motion.h2>

                        {loginError && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-4"
                            >
                                <Alert variant="destructive">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertTitle>{t("common.error")}</AlertTitle>
                                    <AlertDescription>{loginError}</AlertDescription>
                                </Alert>
                            </motion.div>
                        )}

                        {isUnapproved && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-4"
                            >
                                <Alert>
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertTitle>{t("loginPage.error")}</AlertTitle>
                                    <AlertDescription>
                                        {t("loginPage.error")}
                                    </AlertDescription>
                                </Alert>
                            </motion.div>
                        )}

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <div className="space-y-4">

                                <div>
                                    <Label htmlFor="email">{t("loginPage.emailOrPhone")}</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder={t("loginPage.emailOrPhonePlaceholder")}
                                        {...register("email")}
                                        disabled={mutation.isPending}
                                        className={`mt-1 ${errors.email ? 'border-red-500' : ''}`}
                                    />
                                    {errors.email && (
                                        <p className="mt-1 text-sm text-red-500">
                                            {errors.email.message as string}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="password">{t("loginPage.password")}</Label>
                                        <Link
                                            to="/forgot-password"
                                            className="text-sm font-medium text-blue-600 hover:underline"
                                        >
                                            {t("loginPage.forgotPassword") ?? "Forgot Password?"}
                                        </Link>
                                    </div>
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        {...register("password")}
                                        disabled={mutation.isPending}
                                        className={`mt-1 ${errors.password ? 'border-red-500' : ''}`}
                                    />
                                    {errors.password && (
                                        <p className="mt-1 text-sm text-red-500">
                                            {errors.password.message as string}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-col space-y-3">
                                <Button type="submit" className="w-full" disabled={mutation.isPending}>
                                    {mutation.isPending && (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    )}
                                    {t("loginPage.button")}
                                </Button>

                                <Button
                                    type="button"
                                    onClick={() => navigate("/")}
                                    variant="outline"
                                    className="w-full"
                                >
                                    {t("goBack")}
                                </Button>
                            </div>
                        </form>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.7 }}
                            className="text-center text-gray-600 text-sm mt-6"
                        >
                            {t("loginPage.noAccount")}{" "}
                            <Link to="/signup" className="text-blue-600 font-medium hover:underline">
                                {t("loginPage.register")}
                            </Link>
                        </motion.p>
                    </CardContent>
                </Card>
            </div>
        </motion.div>
    );
}
