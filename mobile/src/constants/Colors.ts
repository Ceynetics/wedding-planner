/**
 * Below are the colors that are used in the app. The colors are defined in a way that
 * they can be easily used in both light and dark mode.
 */

const tintColorLight = '#E63946';
const tintColorDark = '#FF6B6B';

export const Colors = {
  light: {
    text: '#2D2D2D',
    background: '#F5F5F5',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    card: '#FFFFFF',
    border: '#E5E5E5',
    primary: tintColorLight,
    secondary: '#757575',
    error: '#C62828',
    placeholder: '#9CA3AF',
    inputBackground: '#FFFFFF',
    success: '#388E3C',
    warning: '#FBC02D',
    shadow: '#000000',

    // colors for guest cards
    statusPending: '#F59E0B',
    statusPendingBg: '#FFFBEB',
    statusConfirmed: '#10B981',
    statusConfirmedBg: '#ECFDF5',
    statusError: '#EF4444',
    statusErrorBg: '#FEF2F2',
    brideTag: '#E63946',
    brideTagBg: '#FFEBEE',
    groomTag: '#1E88E5',
    groomTagBg: '#E3F2FD',

    // colors for expenses
    expenseRed: '#E11D48',
    expenseRedBg: '#FFF1F2',
    expensePurple: '#8E24AA',
    expensePurpleBg: '#F3E5F5',
    expensePink: '#D81B60',
    expenseBlue: '#1E88E5',

    // colors for vendors
    vendorContact: '#E63946',
    vendorContactBg: '#FFEBEE',
    starRating: '#FBC02D',
    emphasis: '#B71C1C',
    paginationBg: '#E0E0E0',
    primaryContrast: '#FFFFFF',
  },
  dark: {
    text: '#ECEDEE',
    background: '#1A1A1A',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    card: '#252525',
    border: '#333333',
    primary: '#FF6B6B',
    secondary: '#A1A1AA',
    error: '#EF5350',
    placeholder: '#6B7280',
    inputBackground: '#2C2C2C',
    success: '#66BB6A',
    warning: '#FDD835',
    shadow: '#000000',

    // colors for guest cards
    statusPending: '#FBBF24',
    statusPendingBg: '#45350B',
    statusConfirmed: '#34D399',
    statusConfirmedBg: '#064E3B',
    statusError: '#F87171',
    statusErrorBg: '#450A0A',
    brideTag: '#FF6B6B',
    brideTagBg: '#4D0A1B',
    groomTag: '#60A5FA',
    groomTagBg: '#1E3A8A',

    // colors for expenses
    expenseRed: '#FB7185',
    expenseRedBg: '#4C0519',
    expensePurple: '#E1BEE7',
    expensePurpleBg: '#4A148C',
    expensePink: '#F48FB1',
    expenseBlue: '#90CAF9',

    // colors for vendors
    vendorContact: '#FF6B6B',
    vendorContactBg: '#3F1218',
    starRating: '#FBBF24',
    emphasis: '#FFCDD2',
    paginationBg: '#333333',
    primaryContrast: '#1A1A1A',
  },
};
