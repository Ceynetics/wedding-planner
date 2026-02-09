/**
 * Below are the colors that are used in the app. The colors are defined in a way that
 * they can be easily used in both light and dark mode.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#F8FAFC',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    card: '#FFFFFF',
    border: '#E2E8F0',
    primary: '#6366F1',
    secondary: '#94A3B8',
    error: '#EF4444',
    placeholder: '#94A3B8',
    inputBackground: '#F1F5F9',
    success: '#10B981',
    warning: '#F59E0B',

    // colors for guest cards
    statusPending: '#F59E0B',
    statusPendingBg: '#FFFBEB',
    statusConfirmed: '#10B981',
    statusConfirmedBg: '#ECFDF5',
    statusError: '#EF4444',
    statusErrorBg: '#FEF2F2',
    brideTag: '#F472B6',
    brideTagBg: '#FDF2F8',
    groomTag: '#60A5FA',
    groomTagBg: '#EFF6FF',

    // colors for expenses
    expenseRed: '#E11D48',
    expenseRedBg: '#FFF1F2',
    expensePurple: '#A855F7',
    expensePink: '#EC4899',
    expenseBlue: '#3B82F6',

    // colors for vendors
    vendorContact: '#6366F1',
    vendorContactBg: '#EEF2FF',
    starRating: '#F59E0B',
  },
  dark: {
    text: '#ECEDEE',
    background: '#0F172A',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    card: '#1E293B',
    border: '#334155',
    primary: '#818CF8',
    secondary: '#64748B',
    error: '#F87171',
    placeholder: '#64748B',
    inputBackground: '#1E293B',
    success: '#34D399', // Slightly lighter green for dark mode accessibility
    warning: '#FBBF24', // Slightly lighter amber for dark mode accessibility

    // colors for guest cards
    statusPending: '#FBBF24',
    statusPendingBg: '#45350B',
    statusConfirmed: '#34D399',
    statusConfirmedBg: '#064E3B',
    statusError: '#F87171',
    statusErrorBg: '#450A0A',
    brideTag: '#F472B6',
    brideTagBg: '#4D1D39',
    groomTag: '#60A5FA',
    groomTagBg: '#1E3A8A',

    // colors for expenses
    expenseRed: '#FB7185',
    expenseRedBg: '#4C0519',
    expensePurple: '#C084FC',
    expensePink: '#F472B6',
    expenseBlue: '#60A5FA',

    // colors for vendors
    vendorContact: '#818CF8',
    vendorContactBg: '#1E1B4B',
    starRating: '#FBBF24',
  },
};
