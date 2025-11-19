import { z } from 'zod';

// Rwanda phone number regex (starts with +250 or 07/08/09)
const phoneRegex = /^(\+250|0)[7-9]\d{8}$/;

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email or phone number is required')
    .refine(
      (value) => {
        // Check if it's an email or phone
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value) || phoneRegex.test(value);
      },
      'Please enter a valid email or phone number'
    ),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password must be less than 100 characters'),
});

export const signupSchema = z
  .object({
    fullName: z
      .string()
      .min(2, 'Full name must be at least 2 characters')
      .max(100, 'Full name must be less than 100 characters')
      .regex(/^[a-zA-Z\s]+$/, 'Full name can only contain letters and spaces'),
    telephone: z
      .string()
      .regex(phoneRegex, 'Please enter a valid Rwandan phone number (07XXXXXXXX)'),
    email: z
      .string()
      .email('Please enter a valid email address')
      .max(255, 'Email must be less than 255 characters'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(100, 'Password must be less than 100 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
      ),
    confirmPassword: z.string(),
    district: z
      .string()
      .min(1, 'Please select a district'),
    sector: z
      .string()
      .min(1, 'Please select a sector'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export const paymentSchema = z.object({
  amount: z
    .number()
    .min(100, 'Minimum contribution is RWF 100')
    .max(1000000, 'Maximum contribution is RWF 1,000,000'),
  cardNumber: z
    .string()
    .regex(/^\d{4}\s\d{4}\s\d{4}\s\d{4}$/, 'Card number must be in format XXXX XXXX XXXX XXXX')
    .refine((val) => {
      const digits = val.replace(/\s/g, '');
      return /^\d{16}$/.test(digits);
    }, 'Invalid card number'),
  expiryMonth: z
    .string()
    .regex(/^(0[1-9]|1[0-2])$/, 'Invalid expiry month'),
  expiryYear: z
    .string()
    .regex(/^\d{2}$/, 'Invalid expiry year')
    .refine((val) => {
      const year = parseInt(val);
      const currentYear = new Date().getFullYear() % 100;
      return year >= currentYear;
    }, 'Card has expired'),
  cvv: z
    .string()
    .regex(/^\d{3,4}$/, 'CVV must be 3 or 4 digits'),
  cardholderName: z
    .string()
    .min(2, 'Cardholder name is required')
    .max(50, 'Cardholder name is too long')
    .regex(/^[a-zA-Z\s]+$/, 'Cardholder name can only contain letters and spaces'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
export type PaymentFormData = z.infer<typeof paymentSchema>;
