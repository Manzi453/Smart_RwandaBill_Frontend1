# TODO: Internationalization for User Components

## Overview
Ensure all hardcoded strings in User page and user components use the translation function `t` from react-i18next. Replace strings with `t('key')` calls where appropriate.

## Files to Edit
- [ ] src/pages/User.tsx: Main user page with sections
- [ ] src/components/user/UserNavbar.tsx: Navigation bar
- [ ] src/components/user/UserProfile.tsx: Profile management
- [ ] src/components/user/UserSettings.tsx: Settings panel
- [ ] src/components/user/EnhancedDashboard.tsx: Dashboard with tabs
- [ ] src/components/user/DashboardStatCards.tsx: Stats cards
- [ ] src/components/user/QuickActionsPanel.tsx: Quick actions
- [ ] src/components/user/PaymentCalendar.tsx: Calendar view
- [ ] src/components/user/SpendingAnalytics.tsx: Analytics charts
- [ ] src/components/user/EnhancedSettings.tsx: Enhanced settings
- [ ] src/components/user/EnhancedProfileManagement.tsx: Profile management
- [ ] src/components/user/SearchAndBulkActions.tsx: Search and bulk actions
- [ ] src/components/user/SecurityFeatures.tsx: Security settings
- [ ] src/components/user/NotificationsPanel.tsx: Notifications
- [ ] src/components/user/QuickPaymentButton.tsx: Payment button
- [ ] src/components/user/ReceiptGenerator.tsx: Receipt generation
- [ ] src/components/user/PaymentProcessor.tsx: Payment processing

## Steps for Each File
1. Import `useTranslation` if not already imported
2. Identify hardcoded strings
3. Replace with `t('key')` using existing keys from i18n.ts or add new keys if needed
4. Ensure `t` is destructured from `useTranslation()`

## Additional Tasks
- [ ] Update src/i18n.ts with any new translation keys if required
- [ ] Test translations in English and Kinyarwanda
- [ ] Verify no hardcoded strings remain

## Notes
- Use existing translation keys where possible
- Follow consistent naming conventions for new keys
- Ensure all user-facing text is translatable
