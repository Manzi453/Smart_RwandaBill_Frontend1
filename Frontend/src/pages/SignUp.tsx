// SignUpPage.tsx
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FcGoogle } from "react-icons/fc";
import { motion } from "framer-motion";
import { toast } from "sonner";

declare global {
  interface Window {
    google?: any;
  }
}

// Mock data for districts and sectors
const DISTRICTS = [
  "Kigali",
  "Gasabo",
  "Nyarugenge",
  "Kicukiro",
  "Rubavu",
  "Musanze",
  "Huye",
  "Nyagatare",
];
const SECTORS = {
  Kigali: ["Nyarugenge", "Kacyiru", "Kimihurura", "Remera"],
  Gasabo: ["Gisozi", "Jali", "Kinyinya", "Ndera"],
  Nyarugenge: ["Muhima", "Nyakabanda", "Rwezamenyo"],
  Kicukiro: ["Gatenga", "Kicukiro", "Niboye"],
  Rubavu: ["Gisenyi", "Rubavu", "Nyamyumba"],
  Musanze: ["Muhoza", "Nyange", "Shingiro"],
  Huye: ["Ngoma", "Tumba", "Mukura"],
  Nyagatare: ["Nyagatare", "Rwimiyaga", "Tabagwe"],
};

export default function SignUpPage() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    telephone: "",
    password: "",
    fullName: "",
    email: "",
    district: "",
    sector: "",
  });

  // Read phone number from URL query parameter
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const phone = searchParams.get("phone");
    if (phone) {
      setForm((prev) => ({ ...prev, telephone: decodeURIComponent(phone) }));
    }
  }, [location.search]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setForm({
      ...form,
      [name]: value,
      ...(name === "district" && { sector: "" }), // reset sector if district changes
    });
  };

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getRoleFromEmail = (email: string): string[] => {
    const emailLower = email.toLowerCase();
    
    // Check for super admin
    if (emailLower === 'musanaivan453@gmail.com') {
      return ['super_admin'];
    }
    
    // Check for admin (water, sanitation, or security in email)
    const adminKeywords = ['water', 'sanitation', 'security'];
    const isAdmin = adminKeywords.some(keyword => emailLower.includes(keyword));
    
    return isAdmin ? ['admin'] : ['user'];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      // Basic validation
      if (!form.telephone || !form.password || !form.fullName || !form.email || !form.district || !form.sector) {
        throw new Error('Please fill in all required fields');
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(form.email)) {
        throw new Error('Please enter a valid email address');
      }

      // Password validation
      if (form.password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }

      setIsLoading(true);
      
      // Simulate signup delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Determine roles based on email
      const roles = getRoleFromEmail(form.email);
      
      // Map roles to proper format
      const roleMapping: { [key: string]: string } = {
        'super_admin': 'ROLE_SUPERADMIN',
        'admin': 'ROLE_ADMIN',
        'user': 'ROLE_USER'
      };
      
      // Mock signup - store user data in localStorage
      const mockUser = {
        id: Date.now().toString(),
        username: form.fullName,
        email: form.email,
        telephone: form.telephone,
        district: form.district,
        sector: form.sector,
        roles: roles.map(r => roleMapping[r] || 'ROLE_USER')
      };

      localStorage.setItem('token', 'mock-token-' + Date.now());
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      toast.success('Signup successful! Redirecting...');
      
      // Redirect based on role
      if (roles.includes('super_admin')) {
        navigate('/superadmin/dashboard');
      } else if (roles.includes('admin')) {
        navigate('/admin/dashboard');
      } else {
        navigate('/user/dashboard');
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      setError(error.message || 'An error occurred during signup. Please try again.');
      toast.error(error.message || 'Signup failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    console.log("Google sign up initiated");
    
    // Mock Google signup
    try {
      const mockUser = {
        id: Date.now().toString(),
        username: 'Google User',
        email: 'googleuser@example.com',
        roles: ['user']
      };

      localStorage.setItem('token', 'mock-token-' + Date.now());
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      toast.success('Google signup successful! Redirecting...');
      navigate('/user/dashboard');
    } catch (error: any) {
      console.error("Google signup failed:", error);
      toast.error("Google signup failed");
    }
  };
  const availableSectors = form.district
    ? SECTORS[form.district as keyof typeof SECTORS] || []
    : [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 px-4 relative overflow-hidden py-8"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
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
            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl mb-4 shadow-lg"
          >
            <span className="text-white font-bold text-2xl">RB</span>
          </motion.div>
          <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
          <p className="text-purple-200">Join Rwanda Bills today</p>
        </div>

        {/* Main Card */}
        <Card className="shadow-2xl rounded-3xl overflow-hidden border-0 backdrop-blur-xl bg-white/95">
          <CardContent className="p-8">
            <Button
              type="button"
              variant="outline"
              className="w-full mb-4"
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
                <span className="px-2 bg-white text-gray-500">
                  {t("orContinueWith")}
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="fullName">{t("fullName")}</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  type="text"
                  placeholder={t("enterFullName")}
                  value={form.fullName}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Telephone */}
              <div className="space-y-2">
                <Label htmlFor="telephone">{t("phoneNumber")}</Label>
                <Input
                  id="telephone"
                  name="telephone"
                  type="tel"
                  placeholder={t("phonePlaceholder")}
                  value={form.telephone}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">{t("email")}</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder={t("emailPlaceholder")}
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">{t("password")}</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder={t("createStrongPassword")}
                  value={form.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                />
              </div>

              {/* District */}
              <div className="space-y-2">
                <Label htmlFor="district">{t("district")}</Label>
                <Select
                  value={form.district}
                  onValueChange={(value) =>
                    handleSelectChange("district", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("selectDistrict")} />
                  </SelectTrigger>
                  <SelectContent>
                    {DISTRICTS.map((district) => (
                      <SelectItem key={district} value={district}>
                        {district}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Sector */}
              {form.district && (
                <div className="space-y-2">
                  <Label htmlFor="sector">{t("sector")}</Label>
                  <Select
                    value={form.sector}
                    onValueChange={(value) =>
                      handleSelectChange("sector", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t("selectSector")} />
                    </SelectTrigger>
                    <SelectContent>
                      {availableSectors.map((sector) => (
                        <SelectItem key={sector} value={sector}>
                          {sector}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Buttons side by side */}
              <div className="flex gap-2">
                <Button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  size="lg"
                  disabled={!form.district || !form.sector}
                >
                  {t("createAccount")}
                </Button>
                <Button
                  type="button"
                  onClick={() => navigate("/")}
                  variant="outline"
                  className="flex-1"
                  size="lg"
                >
                  {t("GoBack")}
                </Button>
              </div>
            </form>

            <p className="text-center text-gray-600 text-sm mt-6">
              {t("alreadyHaveAccount")}{" "}
              <Link
                to="/login"
                className="text-blue-600 font-medium hover:underline"
              >
                {t("signIn")}
              </Link>
            </p>

            <p className="text-xs text-center text-gray-500 mt-4">
              {t("agreeToTerms")}
            </p>
          </CardContent>
        </Card>

        {/* Footer Text */}
        <p className="text-center text-purple-200 text-xs mt-6">
          By signing up, you agree to our Terms of Service and Privacy Policy
        </p>
      </motion.div>
    </motion.div>
  );
}
