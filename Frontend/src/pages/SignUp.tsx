// SignUpPage.tsx
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FcGoogle } from "react-icons/fc";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";

declare global {
    interface Window {
        google?: {
            accounts: {
                id: {
                    initialize: (config: {
                        client_id: string;
                        callback: (response: { credential: string }) => void;
                    }) => void;
                    prompt: () => void;
                };
            };
        };
    }
}

const DISTRICTS = ["Kigali", "Gasabo", "Nyarugenge", "Kicukiro", "Rubavu", "Musanze", "Huye", "Nyagatare"];
const SECTORS: Record<string, string[]> = {
    Kigali: ["Nyarugenge", "Kacyiru", "Kimihurura", "Remera"],
    Gasabo: ["Gisozi", "Jali", "Kinyinya", "Ndera"],
    Nyarugenge: ["Muhima", "Nyakabanda", "Rwezamenyo"],
    Kicukiro: ["Gatenga", "Kicukiro", "Niboye"],
    Rubavu: ["Gisenyi", "Rubavu", "Nyamyumba"],
    Musanze: ["Muhoza", "Nyange", "Shingiro"],
    Huye: ["Ngoma", "Tumba", "Mukura"],
    Nyagatare: ["Nyagatare", "Rwimiyaga", "Tabagwe"],
};
const SERVICES = ["water", "sanitation", "security"];

export default function SignUpPage() {
    const { t } = useTranslation();
    const location = useLocation();
    const navigate = useNavigate();
    const { googleSignup } = useAuth();

    const [form, setForm] = useState({
        telephone: "",
        password: "",
        fullName: "",
        email: "",
        district: "",
        sector: "",
        role: "member" as "member" | "admin",
        service: "" as "" | "water" | "sanitation" | "security",
    });

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const phone = searchParams.get("phone");
        if (phone) setForm(prev => ({ ...prev, telephone: decodeURIComponent(phone) }));
    }, [location.search]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSelectChange = (name: string, value: string) => {
        setForm(prev => ({
            ...prev,
            [name]: value,
            ...(name === "district" ? { sector: "" } : {}),
        }));
    };

    const availableSectors = form.district ? SECTORS[form.district] || [] : [];

    const isFormValid = () => {
        if (form.role === "admin") return !!form.district && !!form.sector && !!form.service;
        return true; // member accounts don't need service
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const submitData = { ...form };
        if (form.role === "admin" && form.service) {
            submitData.email = `admin${form.service}@example.com`;
        }
        const { role, ...dataToSend } = submitData;

        let endpoint = "http://localhost:8083/api/auth/signup";
        if (form.role === "admin") endpoint = "http://localhost:8083/api/auth/signup/admin";

        try {
            const response = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dataToSend),
            });

            const contentType = response.headers.get("content-type") || "";
            if (!response.ok) {
                if (contentType.includes("application/json")) {
                    const errorData = await response.json();
                    alert("Signup failed: " + (errorData.message || JSON.stringify(errorData)));
                } else {
                    const errorText = await response.text();
                    alert("Signup failed: " + errorText);
                }
                return;
            }

            alert("Signup successful!");
            navigate("/login");
        } catch (err: unknown) {
            if (err instanceof Error) {
                console.error("Signup error:", err);
                alert("An error occurred during signup: " + err.message);
            } else {
                console.error("Unknown signup error:", err);
                alert("An unknown error occurred during signup.");
            }
        }
    };

    const handleGoogleSignUp = async () => {
        if (!window.google?.accounts?.id) {
            alert("Google Identity Services not loaded.");
            return;
        }

        window.google.accounts.id.initialize({
            client_id: "YOUR_GOOGLE_CLIENT_ID",
            callback: async (response: { credential: string }) => {
                if (!response.credential) {
                    alert("Google login failed: No credentials returned.");
                    return;
                }
                const userInfo = JSON.parse(atob(response.credential.split(".")[1]));
                try {
                    await googleSignup({ fullName: userInfo.name, email: userInfo.email });
                    alert("Google signup successful! Please login.");
                    navigate("/login");
                } catch (err: unknown) {
                    console.error("Google signup error:", err);
                    const message = err instanceof Error ? err.message : "Unknown error";
                    alert("Google signup failed: " + message);
                }
            },
        });

        window.google.accounts.id.prompt();
    };

    return (
        <motion.div
            className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-blue-200 px-4 py-8"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.4 }}
        >
            <div className="w-full max-w-md">
                <Card className="shadow-lg rounded-2xl">
                    <CardHeader className="text-center">
                        <CardTitle className="text-3xl font-bold text-blue-600">{t("createAccount")}</CardTitle>
                        <p className="text-sm text-gray-600 mt-2">{t("joinRwandaBills")}</p>
                    </CardHeader>
                    <CardContent className="p-6">
                        <Button
                            type="button"
                            variant="outline"
                            className="w-full mb-6 border-gray-300"
                            onClick={handleGoogleSignUp}
                        >
                            <FcGoogle className="mr-2 h-5 w-5" />
                            {t("signUpWithGoogle")}
                        </Button>

                        <div className="relative mb-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">{t("orContinueWith")}</span>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Account Type */}
                            <div className="space-y-2">
                                <Label htmlFor="role">Account Type</Label>
                                <Select value={form.role} onValueChange={value => handleSelectChange("role", value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select account type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="member">Member</SelectItem>
                                        <SelectItem value="admin">Admin</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Admin Service */}
                            {form.role === "admin" && (
                                <div className="space-y-2">
                                    <Label htmlFor="service">Service Department</Label>
                                    <Select value={form.service} onValueChange={value => handleSelectChange("service", value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select service" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {SERVICES.map(service => (
                                                <SelectItem key={service} value={service}>
                                                    {service.charAt(0).toUpperCase() + service.slice(1)}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {form.service && (
                                        <p className="text-xs text-gray-600 mt-1">
                                            Email will be: <strong>admin{form.service}@example.com</strong>
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* Full Name */}
                            <div className="space-y-2">
                                <Label htmlFor="fullName">{t("fullName")}</Label>
                                <Input id="fullName" name="fullName" type="text" placeholder={t("enterFullName")} value={form.fullName} onChange={handleChange} required />
                            </div>

                            {/* Telephone */}
                            <div className="space-y-2">
                                <Label htmlFor="telephone">{t("phoneNumber")}</Label>
                                <Input id="telephone" name="telephone" type="tel" placeholder={t("phonePlaceholder")} value={form.telephone} onChange={handleChange} required />
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                                <Label htmlFor="email">{t("email")}</Label>
                                <Input id="email" name="email" type="email" placeholder={t("emailPlaceholder")} value={form.email} onChange={handleChange} required />
                            </div>

                            {/* Password */}
                            <div className="space-y-2">
                                <Label htmlFor="password">{t("password")}</Label>
                                <Input id="password" name="password" type="password" placeholder={t("createStrongPassword")} value={form.password} onChange={handleChange} required minLength={6} />
                            </div>

                            {/* District */}
                            <div className="space-y-2">
                                <Label htmlFor="district">{t("district")}</Label>
                                <Select value={form.district} onValueChange={value => handleSelectChange("district", value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder={t("selectDistrict")} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {DISTRICTS.map(d => (
                                            <SelectItem key={d} value={d}>
                                                {d}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Sector */}
                            {form.district && (
                                <div className="space-y-2">
                                    <Label htmlFor="sector">{t("sector")}</Label>
                                    <Select value={form.sector} onValueChange={value => handleSelectChange("sector", value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder={t("selectSector")} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {availableSectors.map(s => (
                                                <SelectItem key={s} value={s}>
                                                    {s}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}

                            {/* Buttons */}
                            <div className="flex gap-2">
                                <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700" size="lg" disabled={!isFormValid()}>
                                    {t("createAccount")}
                                </Button>
                                <Button type="button" onClick={() => navigate("/")} variant="outline" className="flex-1" size="lg">
                                    {t("GoBack")}
                                </Button>
                            </div>
                        </form>

                        <p className="text-center text-gray-600 text-sm mt-6">
                            {t("alreadyHaveAccount")}{" "}
                            <Link to="/login" className="text-blue-600 font-medium hover:underline">
                                {t("signIn")}
                            </Link>
                        </p>

                        <p className="text-xs text-center text-gray-500 mt-4">{t("agreeToTerms")}</p>
                    </CardContent>
                </Card>
            </div>
        </motion.div>
    );
}
