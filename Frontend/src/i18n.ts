// src/i18n.ts
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
    en: {
        translation: {
            /* ---------------- COMMON ---------------- */
            goBack: "Go Back",
            submit: "Submit",
            cancel: "Cancel",
            delete: "Delete",
            edit: "Edit",
            save: "Save",
            error: "Error",

            /* ---------------- LANDING PAGE ---------------- */
            rwandaBills: "Rwanda Bills",
            smartCommunityBilling: "Smart Community Billing",
            payBills: "Pay Your Community Bills Easily",
            payBillsDesc: "Fast, secure and convenient payments",
            joinThousands: "Join thousands of citizens using RwandaBills to simplify daily payments.",
            getStartedToday: "Get Started Today",
            enterPhoneNumber: "Enter phone number",
            freeToJoin: "Free to join — secure and fast.",
            payAllCommunityBills: "Pay All Your Community Bills",
            managePayments: "Manage all your water, sanitation and security payments in one place.",

            waterBills: "Water Bills",
            waterBillsDesc: "Easily pay your monthly water bills with real-time updates.",
            securityServices: "Security Services",
            securityServicesDesc: "Manage community security payments anytime.",
            sanitation: "Sanitation",
            sanitationDesc: "Access cleaning and waste management billing services.",

            whyChooseRwandaBills: "Why Choose RwandaBills?",
            experienceFuture: "Experience the future of community service payments.",

            mobileMoneyIntegration: "Mobile Money Integration",
            mobileMoneyDesc: "Pay instantly using MTN or Airtel Money.",
            realTimeNotifications: "Real-time Notifications",
            notificationsDesc: "Get instant alerts for payments and bills.",
            securePayments: "Secure Payments",
            securePaymentsDesc: "Your transactions are encrypted and protected.",
            digitalReceipts: "Digital Receipts",
            digitalReceiptsDesc: "Receive verified receipts instantly after payment.",

            activeUsers: "Active Users",
            billsPaid: "Bills Paid",
            uptime: "System Uptime",
            userRating: "User Rating",

            readyToSimplify: "Ready to simplify your community payments?",
            forCitizens: "For Citizens",
            forAdmins: "For Admins",

            allRightsReserved: "All rights reserved.",
            madeWithLove: "Made with ❤️ in Rwanda",

            /* ---------------- AUTH ---------------- */
            login: "Login",
            signUp: "Sign Up",
            createAccount: "Create Account",
            signIn: "Log In",

            /* ---------------- LOGIN ---------------- */
            loginPage: {
                welcome: "Welcome Back",
                emailOrPhone: "Email or Phone Number",
                emailOrPhonePlaceholder: "user@example.com or 07XXXXXXXX",
                password: "Password",
                forgotPassword: "Forgot Password?",
                button: "Login",
                error: "Invalid login attempt. Please try again.",
                noAccount: "Don't have an account?",
                register: "Sign Up",
            },


            /* ---------------- SIGNUP ---------------- */
            signup: {
                fullName: "Full Name",
                fullNamePlaceholder: "Enter your full name",
                phoneNumber: "Phone Number",
                phoneNumberPlaceholder: "07XXXXXXXX",
                email: "Email Address",
                emailPlaceholder: "your.email@example.com",
                password: "Password",
                confirmPassword: "Confirm Password",
                sector: "Sector",
                district: "District",
                button: "Create Account",
                haveAccount: "Already have an account?",
            },
        },
    },

    /* ---------------- FRENCH ---------------- */
    fr: {
        translation: {
            goBack: "Retour",
            submit: "Soumettre",
            cancel: "Annuler",
            delete: "Supprimer",
            edit: "Modifier",
            save: "Enregistrer",

            rwandaBills: "Rwanda Bills",
            smartCommunityBilling: "Facturation communautaire intelligente",
            payBills: "Payez vos factures communautaires facilement",
            payBillsDesc: "Paiements rapides, sécurisés et pratiques",
            joinThousands: "Rejoignez des milliers de citoyens utilisant RwandaBills.",
            getStartedToday: "Commencez aujourd'hui",
            enterPhoneNumber: "Entrez le numéro de téléphone",
            freeToJoin: "Inscription gratuite — rapide et sécurisée.",
            payAllCommunityBills: "Payez toutes vos factures communautaires",
            managePayments: "Gérez vos paiements d'eau, de sécurité et de propreté au même endroit.",

            waterBills: "Factures d'eau",
            waterBillsDesc: "Payez facilement vos factures d'eau mensuelles.",
            securityServices: "Services de sécurité",
            securityServicesDesc: "Gérez les paiements des services de sécurité.",
            sanitation: "Assainissement",
            sanitationDesc: "Accédez aux services de nettoyage et gestion des déchets.",

            whyChooseRwandaBills: "Pourquoi choisir RwandaBills ?",
            experienceFuture: "Découvrez l'avenir des paiements communautaires.",

            mobileMoneyIntegration: "Intégration Mobile Money",
            mobileMoneyDesc: "Payez instantanément via MTN ou Airtel Money.",
            realTimeNotifications: "Notifications en temps réel",
            notificationsDesc: "Recevez des alertes instantanées pour vos paiements.",
            securePayments: "Paiements sécurisés",
            securePaymentsDesc: "Vos transactions sont cryptées et protégées.",
            digitalReceipts: "Reçus numériques",
            digitalReceiptsDesc: "Recevez des reçus instantanément après paiement.",

            activeUsers: "Utilisateurs actifs",
            billsPaid: "Factures payées",
            uptime: "Disponibilité du système",
            userRating: "Note utilisateur",

            readyToSimplify: "Prêt à simplifier vos paiements ?",
            forCitizens: "Pour les citoyens",
            forAdmins: "Pour les administrateurs",

            allRightsReserved: "Tous droits réservés.",
            madeWithLove: "Fait avec ❤️ au Rwanda",

            login: "Connexion",
            signUp: "S'inscrire",
            createAccount: "Créer un compte",
            signIn: "Se connecter",
            welcome: "Bon retour",
            emailOrPhone: "Email ou numéro de téléphone",
            emailOrPhonePlaceholder: "utilisateur@example.com ou 07XXXXXXXX",
            password: "Mot de passe",
            forgotPassword: "Mot de passe oublié ?",
            button: "Connexion",
            error: "Échec de connexion. Veuillez réessayer.",
            noAccount: "Vous n'avez pas de compte ?",
            register: "Créer un compte",
        },
    },

    /* ---------------- KINYARWANDA ---------------- */
    rw: {
        translation: {
            goBack: "Subira inyuma",
            submit: "Ohereza",
            cancel: "Hagarika",
            delete: "Siba",
            edit: "Hindura",
            save: "Bika",

            rwandaBills: "Rwanda Bills",
            smartCommunityBilling: "Ubwisungane bwishyurirwa hamwe",
            payBills: "Ishyura fagitire z’umudugudu byoroshye",
            payBillsDesc: "Kwishyura byihuse kandi bitekanye",
            joinThousands: "Injira mu bihumbi by’abakoresha RwandaBills mu buryo bworoshye.",
            getStartedToday: "Tangirira hano",
            enterPhoneNumber: "Injiza numero ya telefone",
            freeToJoin: "Kwiyandikisha ni ubuntu — byihuse kandi bitekanye.",
            payAllCommunityBills: "Ishyura fagitire zose z’umudugudu",
            managePayments: "Cunga fagitire z’amazi, isuku n’umutekano hamwe.",

            waterBills: "Fagitire z’amazi",
            waterBillsDesc: "Ishyura fagitire z’amazi buri kwezi byoroshye.",
            securityServices: "Umutekano",
            securityServicesDesc: "Cunga ubwishyu bw’umutekano w’umudugudu.",
            sanitation: "Isuku",
            sanitationDesc: "Igeza ku bikorwa by’isuku n’iposita y’imyanda.",

            whyChooseRwandaBills: "Impamvu wahitamo RwandaBills",
            experienceFuture: "Menya uburyo bugezweho bwo kwishyura fagitire.",

            mobileMoneyIntegration: "Kwihuza na Mobile Money",
            mobileMoneyDesc: "Ishyura ako kanya ukoresheje MTN cyangwa Airtel Money.",
            realTimeNotifications: "Ubutumwa nyabutabire",
            notificationsDesc: "Akamenyesha ako kanya kuri fagitire n’amafaranga wishyuye.",
            securePayments: "Kwishyura bitekanye",
            securePaymentsDesc: "Amakuru yawe arinzwe kandi acungiwe umutekano.",
            digitalReceipts: "Ibisabwe by’ikoranabuhanga",
            digitalReceiptsDesc: "Uhabwa icyemezo cy’amafaranga ako kanya.",

            activeUsers: "Abakoresha bakora",
            billsPaid: "Fagitire zishyuwe",
            uptime: "Igihe sisitemu ikora",
            userRating: "Amanota y’abakoresha",

            readyToSimplify: "Witeguye koroshya fagitire zawe?",
            forCitizens: "Ku baturage",
            forAdmins: "Ku bayobozi",

            allRightsReserved: "Uburenganzira bwose burabitswe.",
            madeWithLove: "Byakozwe ❤️ mu Rwanda",

            login: "Injira",
            signUp: "Iyandikishe",
            createAccount: "Fungura konti",
            signIn: "Injira",
            welcome: "Murakaza neza",
            emailOrPhone: "Email cyangwa nimero ya telefone",
            emailOrPhonePlaceholder: "umukoresha@example.com cyangwa 07XXXXXXXX",
            password: "Ijambo ry'ibanga",
            forgotPassword: "Wibagiwe ijambo ry'ibanga?",
            button: "Injira",
            error: "Kwinjira byanze. Ongera ugerageze.",
            noAccount: "Nta konti ufite?",
            register: "Iyandikishe",
        },
    },
};

i18n.use(initReactI18next).init({
    resources,
    lng: "en",
    fallbackLng: "en",
    interpolation: {
        escapeValue: false,
    },
});

export default i18n;
