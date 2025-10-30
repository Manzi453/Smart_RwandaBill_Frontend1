import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import UserNavbar from "../components/user/UserNavbar";
import UserProfile from "../components/user/UserProfile";
import UserSettings from "../components/user/UserSettings";
import { Dashboard } from "../components/user/Dashboard";

// Animation variants
const pageVariants = {
  initial: { opacity: 0, x: -20 },
  in: { opacity: 1, x: 0 },
  out: { opacity: 0, x: 20 }
};

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 1
};

// Animated component wrapper
const AnimatedPage = ({ children }) => (
  <motion.div
    initial="initial"
    animate="in"
    exit="out"
    variants={pageVariants}
  >
    {children}
  </motion.div>
);

// Main User component with navbar and sections
const User = () => {
  return (
    <AnimatePresence mode="wait">
      <Dashboard />
    </AnimatePresence>
  );
};

export { User };
