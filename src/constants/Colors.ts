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
  },
};
