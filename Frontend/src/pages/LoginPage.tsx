// LoginPage.tsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { loginSchema, LoginFormData } from "@/lib/validation";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginPage() {
    const navigate = useNavigate();
    const { login, user } = useAuth();

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
            await login(data as { email: string; password: string });
        },
        onSuccess: () => {
            // This will be handled by the useEffect below
        },
        onError: (error: any) => {
            alert(error.message || "Login failed");
        },
    });

    const onSubmit = (data: LoginFormData) => {
        mutation.mutate(data);
    };

    // Redirect based on user role after successful login
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
                            Welcome Back
                        </motion.h2>

                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            className="space-y-4"
                            noValidate
                        >
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 }}
                                className="space-y-2"
                            >
                                <Label htmlFor="email">Phone number or Email</Label>
                                <Input
                                    id="email"
                                    {...register("email")}
                                    type="text"
                                    placeholder="Phone number or Email"
                                    aria-invalid={errors.email ? "true" : "false"}
                                />
                                {errors.email && (
                                    <p role="alert" className="text-red-600 text-sm mt-1">
                                        {errors.email.message}
                                    </p>
                                )}
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 }}
                                className="space-y-2"
                            >
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    {...register("password")}
                                    type="password"
                                    placeholder="Password"
                                    aria-invalid={errors.password ? "true" : "false"}
                                />
                                {errors.password && (
                                    <p role="alert" className="text-red-600 text-sm mt-1">
                                        {errors.password.message}
                                    </p>
                                )}
                            </motion.div>

                            {/* Buttons side by side */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="flex gap-2 mt-4"
                            >
                                <Button
                                    type="submit"
                                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                                    size="lg"
                                    disabled={mutation.isPending}
                                >
                                    {mutation.isPending ? (
                                        <Loader2 className="animate-spin h-5 w-5 mx-auto" />
                                    ) : (
                                        "Login"
                                    )}
                                </Button>
                                <Button
                                    type="button"
                                    onClick={() => navigate("/")}
                                    variant="outline"
                                    className="flex-1"
                                    size="lg"
                                    disabled={mutation.isPending}
                                >
                                    Go Back
                                </Button>
                            </motion.div>
                        </form>

                        {mutation.isError && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.6 }}
                                className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md"
                            >
                                <p className="text-red-600 text-sm">
                                    {mutation.error instanceof Error
                                        ? mutation.error.message
                                        : "Login failed"}
                                </p>
                            </motion.div>
                        )}

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.7 }}
                            className="text-center text-gray-600 text-sm mt-4"
                        >
                            Don't have an account?{" "}
                            <a
                                href="/signup"
                                className="text-blue-600 font-medium hover:underline"
                            >
                                Register
                            </a>
                        </motion.p>
                    </CardContent>
                </Card>
            </div>
        </motion.div>
    );
}