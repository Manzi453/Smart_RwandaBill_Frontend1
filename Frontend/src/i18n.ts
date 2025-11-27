// src/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// English translations
const en = {
    translation: {
        /* ---------------- COMMON ---------------- */
        common: {
            error: "An error occurred",
            goBack: "Go Back",
            loading: "Loading...",
            success: "Success",
            view: "View",
            export: "Export",
            exportStarted: "Export started",
            generating: "Generating...",
            save: "Save",
            cancel: "Cancel",
            delete: "Delete",
            edit: "Edit"
        },
        /* ---------------- AUTH ---------------- */
        login: {
            welcome: "Welcome Back",
            emailOrPhone: "Email or Phone Number",
            emailOrPhonePlaceholder: "user@example.com or 07XXXXXXXX",
            password: "Password",
            passwordPlaceholder: "••••••••",
            rememberMe: "Remember me",
            forgotPassword: "Forgot Password?",
            button: "Sign In",
            noAccount: "Don't have an account?",
            register: "Sign Up",
            error: "Invalid email/phone or password",
            googleButton: "Sign in with Google",
            orContinueWith: "Or continue with",
            errors: {
                emailRequired: "Email or phone is required",
                passwordRequired: "Password is required",
                invalidCredentials: "Invalid email/phone or password"
            }
        },
        signup: {
            title: "Create an Account",
            createAccount: "Create Account",
            fullName: "Full Name",
            fullNamePlaceholder: "John Doe",
            email: "Email",
            emailPlaceholder: "user@example.com",
            telephone: "Phone Number",
            telephonePlaceholder: "07XXXXXXXX",
            district: "District",
            selectDistrict: "Select District",
            sector: "Sector",
            selectSector: "Select Sector",
            password: "Password",
            passwordPlaceholder: "••••••••",
            confirmPassword: "Confirm Password",
            button: "Create Account",
            haveAccount: "Already have an account?",
            login: "Sign In",
            error: "Error creating account",
            adminDescription: "Register as a service administrator",
            memberDescription: "Join our community",
            role: "Account Type",
            selectRole: "Select account type",
            roles: {
                member: "Community Member",
                admin: "Service Administrator"
            },
            service: "Service Type",
            selectService: "Select service",
            submitButton: "Create Account",
            googleButton: "Sign up with Google",
            orContinueWith: "Or continue with",
            success: "Account created successfully!",
            adminSuccess: "Admin account created! Awaiting approval.",
            errors: {
                nameRequired: "Full name is required",
                invalidEmail: "Please enter a valid email",
                phoneRequired: "Phone number is required",
                passwordRequired: "Password is required",
                passwordMin: "Password must be at least 8 characters",
                passwordsDontMatch: "Passwords don't match",
                roleRequired: "Please select an account type",
                districtRequired: "District is required for admin accounts",
                sectorRequired: "Sector is required for admin accounts",
                serviceRequired: "Service is required for admin accounts"
            }
        },
        /* ---------------- SERVICES ---------------- */
        services: {
            water: "Water",
            sanitation: "Sanitation",
            security: "Security"
        },
        /* ---------------- DISTRICTS ---------------- */
        districts: {
            kigali: "Kigali City",
            north: "Northern Province",
            south: "Southern Province",
            east: "Eastern Province",
            west: "Western Province"
        },
        /* ---------------- LANDING PAGE ---------------- */
        landing: {
            appName: "RwandaBills",
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
            madeWithLove: "Made with ❤️ in Rwanda"
        },
        /* ---------------- ADMIN ---------------- */
        admin: {
            dashboard: {
                title: "Admin Dashboard",
                stats: {
                    totalUsers: "Total Users",
                    activeUsers: "Active Users",
                    pendingPayments: "Pending Payments",
                    totalRevenue: "Total Revenue"
                }
            },
            users: {
                title: "Users Management",
                searchPlaceholder: "Search users...",
                noUsersFound: "No users found",
                status: {
                    active: "Active",
                    inactive: "Inactive",
                    pending: "Pending Approval"
                },
                actions: {
                    view: "View",
                    edit: "Edit",
                    delete: "Delete",
                    approve: "Approve",
                    deactivate: "Deactivate"
                }
            },
            payments: {
                title: "Payments Management",
                customer: "Customer",
                service: "Service",
                amount: "Amount",
                status: "Status",
                dueDate: "Due Date",
                markAsPaid: "Mark as Paid",
                noPaymentsFound: "No payments found",
                statuses: {
                    paid: "Paid",
                    pending: "Pending",
                    overdue: "Overdue"
                }
            },
            billGeneration: {
                title: "Bill Generation",
                serviceType: "Service Type",
                selectService: "Select a service",
                district: "District",
                allDistricts: "All Districts",
                generateBills: "Generate Bills",
                success: "Bills generated successfully",
                error: "Failed to generate bills"
            },
            settings: {
                title: "Settings",
                general: "General",
                notifications: "Notifications",
                security: "Security",
                save: "Save Changes",
                reset: "Reset to Default"
            }
        }
    }
};

// French translations
const fr = {
    translation: {
        /* ---------------- COMMON ---------------- */
        common: {
            error: "Une erreur s'est produite",
            goBack: "Retour",
            loading: "Chargement...",
            success: "Succès",
            view: "Voir",
            export: "Exporter",
            exportStarted: "Exportation démarrée",
            generating: "Génération en cours...",
            save: "Enregistrer",
            cancel: "Annuler",
            delete: "Supprimer",
            edit: "Modifier"
        },
        /* ---------------- AUTH ---------------- */
        login: {
            welcome: "Bienvenue",
            emailOrPhone: "Email ou numéro de téléphone",
            emailOrPhonePlaceholder: "utilisateur@exemple.com ou 07XXXXXXXX",
            password: "Mot de passe",
            passwordPlaceholder: "••••••••",
            rememberMe: "Se souvenir de moi",
            forgotPassword: "Mot de passe oublié ?",
            button: "Se connecter",
            noAccount: "Vous n'avez pas de compte ?",
            register: "S'inscrire",
            error: "Email/téléphone ou mot de passe invalide",
            googleButton: "Se connecter avec Google",
            orContinueWith: "Ou continuer avec",
            errors: {
                emailRequired: "L'email ou le téléphone est requis",
                passwordRequired: "Le mot de passe est requis",
                invalidCredentials: "Email/téléphone ou mot de passe invalide"
            }
        },
        signup: {
            title: "Créer un compte",
            createAccount: "Créer un compte",
            fullName: "Nom complet",
            fullNamePlaceholder: "Jean Dupont",
            email: "Email",
            emailPlaceholder: "utilisateur@exemple.com",
            telephone: "Numéro de téléphone",
            telephonePlaceholder: "07XXXXXXXX",
            district: "District",
            selectDistrict: "Sélectionnez un district",
            sector: "Secteur",
            selectSector: "Sélectionnez un secteur",
            password: "Mot de passe",
            passwordPlaceholder: "••••••••",
            confirmPassword: "Confirmer le mot de passe",
            button: "Créer un compte",
            haveAccount: "Vous avez déjà un compte ?",
            login: "Se connecter",
            error: "Erreur lors de la création du compte",
            adminDescription: "S'inscrire en tant qu'administrateur de service",
            memberDescription: "Rejoindre notre communauté",
            role: "Type de compte",
            selectRole: "Sélectionnez un type de compte",
            roles: {
                member: "Membre de la communauté",
                admin: "Administrateur de service"
            },
            service: "Type de service",
            selectService: "Sélectionnez un service",
            submitButton: "Créer un compte",
            googleButton: "S'inscrire avec Google",
            orContinueWith: "Ou continuer avec",
            success: "Compte créé avec succès !",
            adminSuccess: "Compte administrateur créé ! En attente d'approbation.",
            errors: {
                nameRequired: "Le nom complet est requis",
                invalidEmail: "Veuillez entrer un email valide",
                phoneRequired: "Le numéro de téléphone est requis",
                passwordRequired: "Le mot de passe est requis",
                passwordMin: "Le mot de passe doit contenir au moins 8 caractères",
                passwordsDontMatch: "Les mots de passe ne correspondent pas",
                roleRequired: "Veuillez sélectionner un type de compte",
                districtRequired: "Le district est requis pour les comptes administrateurs",
                sectorRequired: "Le secteur est requis pour les comptes administrateurs",
                serviceRequired: "Le service est requis pour les comptes administrateurs"
            }
        },
        /* ---------------- SERVICES ---------------- */
        services: {
            water: "Eau",
            sanitation: "Assainissement",
            security: "Sécurité"
        },
        /* ---------------- DISTRICTS ---------------- */
        districts: {
            kigali: "Ville de Kigali",
            north: "Province du Nord",
            south: "Province du Sud",
            east: "Province de l'Est",
            west: "Province de l'Ouest"
        },
        /* ---------------- LANDING PAGE ---------------- */
        landing: {
            appName: "RwandaBills",
            smartCommunityBilling: "Facturation communautaire intelligente",
            payBills: "Payez facilement vos factures communautaires",
            payBillsDesc: "Paiements rapides, sécurisés et pratiques",
            joinThousands: "Rejoignez des milliers de citoyens utilisant RwandaBills pour simplifier les paiements quotidiens.",
            getStartedToday: "Commencer maintenant",
            enterPhoneNumber: "Entrez votre numéro de téléphone",
            freeToJoin: "Inscription gratuite — rapide et sécurisée.",
            payAllCommunityBills: "Payez toutes vos factures communautaires",
            managePayments: "Gérez tous vos paiements d'eau, d'assainissement et de sécurité au même endroit.",
            waterBills: "Factures d'eau",
            waterBillsDesc: "Payez facilement vos factures d'eau mensuelles avec des mises à jour en temps réel.",
            securityServices: "Services de sécurité",
            securityServicesDesc: "Gérez les paiements de sécurité communautaire à tout moment.",
            sanitation: "Assainissement",
            sanitationDesc: "Accédez aux services de facturation du nettoyage et de la gestion des déchets.",
            whyChooseRwandaBills: "Pourquoi choisir RwandaBills ?",
            experienceFuture: "Découvrez l'avenir des paiements de services communautaires.",
            mobileMoneyIntegration: "Intégration Mobile Money",
            mobileMoneyDesc: "Payez instantanément via MTN ou Airtel Money.",
            realTimeNotifications: "Notifications en temps réel",
            notificationsDesc: "Recevez des alertes instantanées pour les paiements et les factures.",
            securePayments: "Paiements sécurisés",
            securePaymentsDesc: "Vos transactions sont cryptées et protégées.",
            digitalReceipts: "Reçus numériques",
            digitalReceiptsDesc: "Recevez des reçus vérifiés instantanément après paiement.",
            activeUsers: "Utilisateurs actifs",
            billsPaid: "Factures payées",
            uptime: "Temps de fonctionnement",
            userRating: "Évaluation des utilisateurs",
            readyToSimplify: "Prêt à simplifier vos paiements communautaires ?",
            forCitizens: "Pour les citoyens",
            forAdmins: "Pour les administrateurs",
            allRightsReserved: "Tous droits réservés.",
            madeWithLove: "Fait avec ❤️ au Rwanda"
        },
        /* ---------------- ADMIN ---------------- */
        admin: {
            dashboard: {
                title: "Tableau de bord administrateur",
                stats: {
                    totalUsers: "Utilisateurs totaux",
                    activeUsers: "Utilisateurs actifs",
                    pendingPayments: "Paiements en attente",
                    totalRevenue: "Revenu total"
                }
            },
            users: {
                title: "Gestion des utilisateurs",
                searchPlaceholder: "Rechercher des utilisateurs...",
                noUsersFound: "Aucun utilisateur trouvé",
                status: {
                    active: "Actif",
                    inactive: "Inactif",
                    pending: "En attente d'approbation"
                },
                actions: {
                    view: "Voir",
                    edit: "Modifier",
                    delete: "Supprimer",
                    approve: "Approuver",
                    deactivate: "Désactiver"
                }
            },
            payments: {
                title: "Gestion des paiements",
                customer: "Client",
                service: "Service",
                amount: "Montant",
                status: "Statut",
                dueDate: "Date d'échéance",
                markAsPaid: "Marquer comme payé",
                noPaymentsFound: "Aucun paiement trouvé",
                statuses: {
                    paid: "Payé",
                    pending: "En attente",
                    overdue: "En retard"
                }
            },
            billGeneration: {
                title: "Génération de factures",
                serviceType: "Type de service",
                selectService: "Sélectionner un service",
                district: "District",
                allDistricts: "Tous les districts",
                generateBills: "Générer les factures",
                success: "Factures générées avec succès",
                error: "Échec de la génération des factures"
            },
            settings: {
                title: "Paramètres",
                general: "Général",
                notifications: "Notifications",
                security: "Sécurité",
                save: "Enregistrer les modifications",
                reset: "Réinitialiser"
            }
        }
    }
};

// Kinyarwanda translations
const rw = {
    translation: {
        /* ---------------- COMMON ---------------- */
        common: {
            error: "Habaye ikibazo",
            goBack: "Subira inyuma",
            loading: "Birakorwa...",
            success: "Byagenze neza",
            view: "Reba",
            export: "Kohereza hanze",
            exportStarted: "Gutangira kohereza hanze",
            generating: "Ikorana...",
            save: "Bika",
            cancel: "Hagarika",
            delete: "Siba",
            edit: "Hindura"
        },
        /* ---------------- AUTH ---------------- */
        login: {
            welcome: "Murakaza neza",
            emailOrPhone: "Imeri cyangwa numero ya telefone",
            emailOrPhonePlaceholder: "umukoresha@urugero.rw cyangwa 07XXXXXXXX",
            password: "Ijambo banga",
            passwordPlaceholder: "••••••••",
            rememberMe: "Nibutse",
            forgotPassword: "Wibagiye ijambo banga?",
            button: "Injira",
            noAccount: "Ntugifite konti?",
            register: "Iyandikishe",
            error: "Imeri/Telefone cyangwa ijambo banga sibyemewe",
            googleButton: "Injira ukoresheje Google",
            orContinueWith: "Cyangwa komeza hamwe na",
            errors: {
                emailRequired: "Imeri cyangwa telefone birakenewe",
                passwordRequired: "Ijambo banga rirakenewe",
                invalidCredentials: "Imeri/Telefone cyangwa ijambo banga sibyemewe"
            }
        },
        signup: {
            title: "Funga Konti",
            createAccount: "Funga Konti",
            fullName: "Izina ruzuye",
            fullNamePlaceholder: "Yandikisha izina rwawe ruzuye",
            email: "Imeri",
            emailPlaceholder: "umukoresha@urugero.rw",
            telephone: "Numero ya telefone",
            telephonePlaceholder: "07XXXXXXXX",
            district: "Akarere",
            selectDistrict: "Hitamo Akarere",
            sector: "Umurenge",
            selectSector: "Hitamo Umurenge",
            password: "Ijambo banga",
            passwordPlaceholder: "••••••••",
            confirmPassword: "Emeza ijambo banga",
            button: "Funga Konti",
            haveAccount: "Ufite konti mbere?",
            login: "Injira",
            error: "Ikosa mu gushinga konti",
            adminDescription: "Iyandikishe nk'umuyobozi wa serivisi",
            memberDescription: "Injira muri komite y'abakoresha",
            role: "Ubwoko bwa konte",
            selectRole: "Hitamo ubwoko bwa konte",
            roles: {
                member: "Umwe mu baturage",
                admin: "Umuyobozi wa serivisi"
            },
            service: "Ubwoko bwa serivisi",
            selectService: "Hitamo serivisi",
            submitButton: "Funga Konti",
            googleButton: "Iyandikishe ukoresheje Google",
            orContinueWith: "Cyangwa komeza hamwe na",
            success: "Konti yashizweho neza!",
            adminSuccess: "Konti y'umuyobozi yashizweho! Tegereza icyemezo.",
            errors: {
                nameRequired: "Izina rirakenewe",
                invalidEmail: "Shyiramo imeri nshinganwa",
                phoneRequired: "Numero ya telefone irakenewe",
                passwordRequired: "Ijambo banga rirakenewe",
                passwordMin: "Ijambo banga kigomba kugira nibura inyuguti 8",
                passwordsDontMatch: "Amajambo banga ntabwo arahuye",
                roleRequired: "Hitamo ubwoko bwa konte",
                districtRequired: "Akarere gakenewe kuri konte z'abayobozi",
                sectorRequired: "Umurenge ukenewe kuri konte z'abayobozi",
                serviceRequired: "Serivisi irakenewe kuri konte z'abayobozi"
            }
        },
        /* ---------------- SERVICES ---------------- */
        services: {
            water: "Amazi",
            sanitation: "Ikirundo",
            security: "Umutekano"
        },
        /* ---------------- DISTRICTS ---------------- */
        districts: {
            kigali: "Umujyi wa Kigali",
            north: "Intara y'Amajyaruguru",
            south: "Intara y'Amajyepfo",
            east: "Intara y'Iburasirazuba",
            west: "Intara y'Iburengerazuba"
        },
        /* ---------------- LANDING PAGE ---------------- */
        landing: {
            appName: "RwandaBills",
            smartCommunityBilling: "Ubwisungane bwishyurirwa hamwe",
            payBills: "Ishyura fagitire z'umudugudu byoroshye",
            payBillsDesc: "Kwishyura byihuse kandi bitekanye",
            joinThousands: "Injira mu bihumbi by'abakoresha RwandaBills mu buryo bworoshye.",
            getStartedToday: "Tangira nonaha",
            enterPhoneNumber: "Injiza numero ya telefone",
            freeToJoin: "Kwiyandikisha ni ubuntu — byihuse kandi bitekanye.",
            payAllCommunityBills: "Ishyura fagitire zose z'umudugudu",
            managePayments: "Cunga fagitire z'amazi, isuku n'umutekano hamwe.",
            waterBills: "Fagitire z'amazi",
            waterBillsDesc: "Ishyura fagitire z'amazi buri kwezi byoroshye.",
            securityServices: "Umutekano",
            securityServicesDesc: "Cunga ubwishyu bw'umutekano w'umudugudu.",
            sanitation: "Isuku",
            sanitationDesc: "Igeza ku bikorwa by'isuku n'iposita y'imyanda.",
            whyChooseRwandaBills: "Impamvu wahitamo RwandaBills",
            experienceFuture: "Menya uburyo bugezweho bwo kwishyura fagitire.",
            mobileMoneyIntegration: "Kwihuza na Mobile Money",
            mobileMoneyDesc: "Ishyura ako kanya ukoresheje MTN cyangwa Airtel Money.",
            realTimeNotifications: "Ubutumwa nyabutabire",
            notificationsDesc: "Akamenyesha ako kanya kuri fagitire n'amafaranga wishyuye.",
            securePayments: "Kwishyura bitekanye",
            securePaymentsDesc: "Amakuru yawe arinzwe kandi acungiwe umutekano.",
            digitalReceipts: "Ibisabwe by'ikoranabuhanga",
            digitalReceiptsDesc: "Uhabwa icyemezo cy'amafaranga ako kanya.",
            activeUsers: "Abakoresha bakora",
            billsPaid: "Fagitire zishyuwe",
            uptime: "Igihe sisitemu ikora",
            userRating: "Amanota y'abakoresha",
            readyToSimplify: "Witeguye koroshya fagitire zawe?",
            forCitizens: "Ku baturage",
            forAdmins: "Ku bayobozi",
            allRightsReserved: "Uburenganzira bwose burabitswe.",
            madeWithLove: "Byakozwe ❤️ mu Rwanda"
        },
        /* ---------------- ADMIN ---------------- */
        admin: {
            dashboard: {
                title: "Ikibaho cy'umuyobozi",
                stats: {
                    totalUsers: "Abakoresha bose",
                    activeUsers: "Abakoresha bakora",
                    pendingPayments: "Amafaranga ateganyijwe",
                    totalRevenue: "Amafaranga yose"
                }
            },
            users: {
                title: "Gucunga abakoresha",
                searchPlaceholder: "Shakisha abakoresha...",
                noUsersFound: "Nta bakoresha babonetse",
                status: {
                    active: "Bakora",
                    inactive: "Bidakora",
                    pending: "Biteganyijwe"
                },
                actions: {
                    view: "Reba",
                    edit: "Hindura",
                    delete: "Siba",
                    approve: "Emeza",
                    deactivate: "Hagarika"
                }
            },
            payments: {
                title: "Gucunga amakuru y'amafaranga",
                customer: "Umukiriya",
                service: "Serivisi",
                amount: "Amafaranga",
                status: "Imimerere",
                dueDate: "Itariki yo kwishyura",
                markAsPaid: "Shyira nkayishyuwe",
                noPaymentsFound: "Nta mafaranga yabonetse",
                statuses: {
                    paid: "Yishyuwe",
                    pending: "Biteganyijwe",
                    overdue: "Yarangije igihe"
                }
            },
            billGeneration: {
                title: "Gukora fagitire",
                serviceType: "Ubwoko bwa serivisi",
                selectService: "Hitamo serivisi",
                district: "Akarere",
                allDistricts: "Ama karere yose",
                generateBills: "Kora fagitire",
                success: "Fagitire zakoze neza",
                error: "Ntibishobokoye gukora fagitire"
            },
            settings: {
                title: "Igenamiterere",
                general: "Ibisanzwe",
                notifications: "Amatangazo",
                security: "Umutekano",
                save: "Bika ibahindutse",
                reset: "Subiramo ibanza"
            }
        }
    }
};

// Initialize i18n
i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            en,
            fr,
            rw
        },
        fallbackLng: 'en',
        debug: process.env.NODE_ENV === 'development',
        detection: {
            order: ['localStorage', 'navigator'],
            caches: ['localStorage']
        },
        interpolation: {
            escapeValue: false // React already escapes values
        },
        react: {
            useSuspense: false
        }
    });

export default i18n;