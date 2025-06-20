'use client';

export function useTheme() {
  return theme;
}

export const theme = {
  // Next.js minimal dark theme
  background: 'bg-black',
  surface: 'bg-gray-800',
  surfaceSecondary: 'bg-gray-700',
  text: 'text-gray-200',
  textSecondary: 'text-gray-400',
  accent: 'text-blue-500',
  accentHover: 'hover:text-blue-600',
  error: 'text-red-500',
  warning: 'text-yellow-500',
  success: 'text-green-500',
  border: 'border-gray-700',
  borderSecondary: 'border-gray-600',
  shadow: 'shadow-md',
  borderRadius: 'rounded-lg',
  borderRadiusLarge: 'rounded-xl',
  transition: 'transition-colors duration-200',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  // Modern button colors
  buttonPrimary: 'bg-purple-500',
  buttonPrimaryHover: 'hover:bg-purple-600',
  buttonPrimaryText: 'text-white',
  buttonPrimaryShadow: 'shadow-purple-500/20',
};
