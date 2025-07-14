'use client';

export function useTheme() {
  return theme;
}

import '@/styles/courier-prime.css';

export const theme = {
  // Next.js minimal dark theme
  background: 'bg-black',
  surface: 'bg-zinc-800 bg-opacity-50',
  surfaceSecondary: 'bg-zinc-700',
  text: 'text-gray-200',
  textSecondary: 'text-gray-400',
  accent: 'text-purple-400',
  accentHover: 'hover:text-purple-300',
  error: 'text-red-500',
  warning: 'text-yellow-500',
  success: 'text-green-500',
  border: 'border-gray-700',
  borderSecondary: 'border-gray-600',
  shadow: 'shadow-md',
  borderRadius: 'rounded-lg',
  borderRadiusLarge: 'rounded-xl',
  transition: 'transition-colors duration-200',
  fontFamily: 'font-family: var(--font-family)',
  // Modern button colors
  buttonPrimary: 'bg-purple-500',
  buttonPrimaryHover: 'hover:bg-purple-600',
  buttonPrimaryText: 'text-white',
  buttonPrimaryShadow: 'shadow-purple-500/20',
};
