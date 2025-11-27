// Landing.tsx
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Clock,
  Droplets,
  Trash2,
  Users,
  Shield,
  Smartphone,
  Star,
} from "lucide-react";

import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export const Landing = () => {
  const { t } = useTranslation();
  const [phoneNumber, setPhoneNumber] = useState("");

  const features = [
    {
      icon: Smartphone,
      title: t("mobileMoneyIntegration"),
      description: t("mobileMoneyDesc"),
    },
    {
      icon: Clock,
      title: t("realTimeNotifications"),
      description: t("notificationsDesc"),
    },
    {
      icon: Shield,
      title: t("securePayments"),
      description: t("securePaymentsDesc"),
    },
    {
      icon: CheckCircle2,
      title: t("digitalReceipts"),
      description: t("digitalReceiptsDesc"),
    },
  ];

  const services = [
    {
      icon: Droplets,
      title: t("waterBills"),
      description: t("waterBillsDesc"),
      color: "text-blue-500",
    },
    {
      icon: Shield,
      title: t("securityServices"),
      description: t("securityServicesDesc"),
      color: "text-green-500",
    },
    {
      icon: Trash2,
      title: t("sanitation"),
      description: t("sanitationDesc"),
      color: "text-orange-500",
    },
  ];

  return (
    <motion.div
      className="min-h-screen bg-background"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <header className="border-b border-border/50 sticky top-0 z-50 bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 gradient-hero rounded-xl flex items-center justify-center">
              <span className="text-white font-bold">RB</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">{t("rwandaBills")}</h1>
              <p className="text-xs text-muted-foreground">{t("smartCommunityBilling")}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="ghost" asChild>
              <Link to="/login">{t("login")}</Link>
            </Button>
            <Button variant="gradient" asChild>
              <Link to="/signup">{t("signUp")}</Link>
            </Button>
            <div className="ml-4">
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-4 bg-hero-pattern relative overflow-hidden">
        <div className="absolute inset-0 bg-background/10"></div>
        <div className="container mx-auto relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-primary-foreground mb-6 animate-fade-in">
              {t("payBills")}
              <span className="block text-accent-light">{t("payBillsDesc")}</span>
            </h1>
            <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto animate-fade-in">
              {t("joinThousands")}
            </p>

            {/* Quick Start Form */}
            <Card className="max-w-md mx-auto bg-card/90 backdrop-blur-sm border-0 shadow-2xl animate-slide-up">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-primary">{t("getStartedToday")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="phone" className="text-sm font-medium">
                    {t("enterPhoneNumber")}
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="07XXXXXXXX"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <Button
                  className="w-full"
                  variant="hero"
                  size="lg"
                  disabled={!phoneNumber}
                  asChild
                >
                  <Link to={`/signup?phone=${encodeURIComponent(phoneNumber)}`}>
                    {t("createAccount")}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  {t("freeToJoin")}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              {t("payAllCommunityBills")}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t("managePayments")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <Card
                  key={index}
                  className="text-center gradient-card border-0 shadow-lg hover:shadow-glow transition-smooth"
                >
                  <CardHeader>
                    <div
                      className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center`}
                    >
                      <Icon className={`h-8 w-8 ${service.color}`} />
                    </div>
                    <CardTitle className="text-xl">{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{service.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              {t("whyChooseRwandaBills")}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t("experienceFuture")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={index}
                  className="text-center hover:shadow-lg transition-smooth"
                >
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">50K+</div>
              <div className="text-muted-foreground">{t("activeUsers")}</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-secondary mb-2">
                RWF 2.5B
              </div>
              <div className="text-muted-foreground">{t("billsPaid")}</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-accent mb-2">99.9%</div>
              <div className="text-muted-foreground">{t("uptime")}</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-success mb-2">4.9/5</div>
              <div className="text-muted-foreground flex items-center justify-center">
                <Star className="h-4 w-4 text-yellow-500 mr-1 fill-current" />
                {t("userRating")}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 gradient-hero">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            {t("readyToSimplify")}
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            {t("joinThousands")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" size="xl" className="min-w-[200px]" asChild>
              <Link to="/signup">
                <Users className="mr-2 h-5 w-5" />
                {t("forCitizens")}
              </Link>
            </Button>
            <Button variant="outline" size="xl" className="min-w-[200px]" asChild>
              <Link to="/login">
                <BarChart3 className="mr-2 h-5 w-5" />
                {t("forAdmins")}
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border/50 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-8 h-8 gradient-hero rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">RB</span>
              </div>
              <div>
                <div className="font-semibold">{t("rwandaBills")}</div>
                <div className="text-sm text-muted-foreground">
                  {t("allRightsReserved")}
                </div>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              {t("madeWithLove")}
            </div>
          </div>
        </div>
      </footer>
    </motion.div>
  );
};
