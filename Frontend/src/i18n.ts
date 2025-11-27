// src/i18n.ts
import { initReactI18next } from "react-i18next";

const resources = {
    en: {
        translation: {
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
            },
            /* ---------------- COMMON ---------------- */
            view: "View",
            export: "Export",
            exportStarted: "Export started",
            generating: "Generating...",
            save: "Save",
            cancel: "Cancel",
            delete: "Delete",
            edit: "Edit",
            loading: "Loading...",
            error: "Error",
            success: "Success",
            /* ---------------- QUICK ACCESS ---------------- */
            quickAccess: {
              notifications: "Notifications",
              alerts: "Alerts",
              reports: "Reports",
              viewAll: "View All",
              markAllAsRead: "Mark all as read"
            },
            /* ---------------- DATE ---------------- */
            date: {
              months: {
                jan: "Jan",
                feb: "Feb",
                mar: "Mar",
                apr: "Apr",
                may: "May",
                jun: "Jun",
                jul: "Jul",
                aug: "Aug",
                sep: "Sep",
                oct: "Oct",
                nov: "Nov",
                dec: "Dec"
              },
              days: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
              today: "Today",
              yesterday: "Yesterday",
              tomorrow: "Tomorrow"
            },
            /* ---------------- ACTIVITY LOGS ---------------- */
            activityLogs: {
              newUserRegistration: "New user registration",
              paymentReceived: "Payment received",
              billGenerated: "Bill generated",
              timeAgo: (count: number, unit: string) => {
                switch(unit) {
                  case 'minute': return count === 1 ? '1 minute ago' : `${count} minutes ago`;
                  case 'hour': return count === 1 ? '1 hour ago' : `${count} hours ago`;
                  case 'day': return count === 1 ? '1 day ago' : `${count} days ago`;
                  default: return 'Just now';
                }
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
                title: "Create an Account",
                subtitle: "Already have an account?",
                signInLink: "Sign in",
                formTitle: "Get Started",
                adminDescription: "Register as a service administrator",
                memberDescription: "Join our community",
                fullName: "Full Name",
                fullNamePlaceholder: "John Doe",
                phone: "Phone Number",
                phonePlaceholder: "+250 7XX XXX XXX",
                email: "Email Address",
                emailPlaceholder: "you@example.com",
                password: "Password",
                passwordPlaceholder: "••••••••",
                confirmPassword: "Confirm Password",
                confirmPasswordPlaceholder: "••••••••",
                role: "Account Type",
                selectRole: "Select account type",
                district: "District",
                selectDistrict: "Select district",
                sector: "Sector",
                selectSector: "Select sector",
                service: "Service",
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
            roles: {
                member: "Community Member",
                admin: "Service Administrator"
            },
            services: {
                water: "Water Service",
                sanitation: "Sanitation Service",
                security: "Security Service"
            },
        },
    },

    /* ---------------- FRENCH ---------------- */
    fr: {
        translation: {
            /* ---------------- SIGNUP ---------------- */
            signup: {
                title: "Créer un compte",
                subtitle: "Vous avez déjà un compte ?",
                signInLink: "Se connecter",
                formTitle: "Inscription",
                adminDescription: "Inscrivez-vous en tant qu'administrateur pour gérer les services communautaires",
                memberDescription: "Inscrivez-vous pour accéder à vos services communautaires",
                fullName: "Nom complet",
                fullNamePlaceholder: "Entrez votre nom complet",
                email: "Email",
                emailPlaceholder: "Entrez votre email",
                phone: "Numéro de téléphone",
                phonePlaceholder: "Entrez votre numéro de téléphone",
                password: "Mot de passe",
                passwordPlaceholder: "Créez un mot de passe",
                confirmPassword: "Confirmer le mot de passe",
                confirmPasswordPlaceholder: "Confirmez votre mot de passe",
                role: "Type de compte",
                selectRole: "Sélectionnez le type de compte",
                district: "District",
                selectDistrict: "Sélectionnez un district",
                sector: "Secteur",
                selectSector: "Sélectionnez un secteur",
                service: "Service",
                selectService: "Sélectionnez un service",
                submitButton: "Créer un compte",
                orContinueWith: "Ou continuez avec",
                googleButton: "Continuer avec Google",
                success: "Compte créé avec succès ! Redirection vers la connexion...",
                adminSuccess: "Demande de compte administrateur soumise ! Veuillez attendre l'approbation.",
                errors: {
                    required: "Ce champ est requis",
                    emailInvalid: "Veuillez entrer un email valide",
                    passwordMismatch: "Les mots de passe ne correspondent pas",
                    passwordTooShort: "Le mot de passe doit contenir au moins 8 caractères",
                    phoneInvalid: "Veuillez entrer un numéro de téléphone valide"
                }
            },

            /* ---------------- ROLES ---------------- */
            roles: {
                member: "Membre de la communauté",
                admin: "Administrateur de service",
                superadmin: "Super Administrateur"
            },

            /* ---------------- STATUS ---------------- */
            status: {
                pending: "En attente",
                approved: "Approuvé",
                rejected: "Rejeté"
            },

            /* ---------------- ADMIN APPROVALS ---------------- */
            admin: {
                pendingApprovals: "Approbations en attente",
                noPendingApprovals: "Aucune approbation en attente",
                approve: "Approuver",
                reject: "Rejeter",
                approved: "Approuvé avec succès",
                rejected: "Rejeté avec succès",
                enterRejectionReason: "Veuillez entrer une raison pour le rejet :",
                actions: "Actions"
            },

            /* ---------------- COMMON ---------------- */
            common: {
                processing: "Traitement...",
                name: "Nom",
                email: "Email",
                telephone: "Téléphone",
                district: "District",
                sector: "Secteur",
                service: "Service",
                status: "Statut",
                actions: "Actions"
            },

            /* ---------------- ERRORS ---------------- */
            errors: {
                fetchPendingAdmins: "Échec du chargement des approbations en attente",
                approveAdmin: "Échec de l'approbation de l'administrateur",
                rejectAdmin: "Échec du rejet de l'administrateur",
                registrationFailed: "Échec de l'inscription. Veuillez réessayer.",
                formValidation: "Veuillez corriger les erreurs du formulaire et réessayer"
            },

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
            /* ---------------- SIGNUP ---------------- */
            signup: {
                title: "Funga Konti",
                subtitle: "Ufite konti mbere?",
                loginLink: "Injira",
                form: {
                    fullName: "Amazina yose",
                    email: "Imeri",
                    telephone: "Numero ya telefone",
                    password: "Ijambo banga",
                    confirmPassword: "Emeza ijambo banga",
                    role: "Ubwoko bwa konte",
                    district: "Akarere",
                    sector: "Umurenge",
                    service: "Service",
                    selectRole: "Hitamo ubwoko bwa konte",
                    selectDistrict: "Hitamo akarere",
                    selectSector: "Hitamo umurenge",
                    selectService: "Hitamo service",
                    member: "Umuryango w'Abaturage",
                    admin: "Umutwara abandi bantu",
                    submit: "Funga Konti",
                    googleSignup: "Iyandikishe kuri Google"
                },
                errors: {
                    nameRequired: "Izina rirakenewe",
                    emailRequired: "Imeri irakenewe",
                    invalidEmail: "Imeri ntabwo ariyo",
                    phoneRequired: "Numero ya telefone irakenewe",
                    passwordRequired: "Ijambo banga rirakenewe",
                    passwordMin: "Ijambo banga kigomba kugira nibura inyuguti 8",
                    passwordsDontMatch: "Amajambo y'ibanga ntabwo ari kimwe",
                    roleRequired: "Nyamuneka hitamo ubwoko bwa konte",
                    districtRequired: "Akarere gakenewe kuri konte z'abakoresha",
                    sectorRequired: "Umurenge ukenewe kuri konte z'abakoresha",
                    serviceRequired: "Service irakenewe kuri konte z'abakoresha"
                },
                success: "Konte yashizweho neza!",
                error: "Ntushoboye gushinga konte. Nyamuneka gerageza nanone."
            },
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
