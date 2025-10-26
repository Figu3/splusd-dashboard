import { PROTOCOLS } from '../config';

/**
 * Get the color for a protocol or location
 */
export const getProtocolColor = (location: string): string => {
  if (location === 'Idle Wallets') return '#6b7280';

  const protocolKey = Object.keys(PROTOCOLS).find(
    key => PROTOCOLS[key].name === location
  );
  return protocolKey ? PROTOCOLS[protocolKey].color : '#6b7280';
};

/**
 * Color palette for consistent theming
 */
export const colors = {
  // Primary colors
  primary: '#8b5cf6',
  primaryHover: '#7c3aed',

  // Background colors
  bgDark: '#0a0e1a',
  bgCard: '#1a1f35',
  bgCardHover: '#252b45',

  // Border colors
  border: '#2d3548',
  borderAccent: '#8b5cf6',

  // Text colors
  textPrimary: '#ffffff',
  textSecondary: '#9ca3af',
  textTertiary: '#6b7280',

  // Status colors
  success: '#10b981',
  successBg: '#10b98120',
  error: '#ef4444',
  errorBg: '#ef444420',
  warning: '#f59e0b',
  warningBg: '#f59e0b20',

  // Chart colors
  chart: {
    purple: '#8b5cf6',
    green: '#10b981',
    amber: '#f59e0b',
    blue: '#3b82f6',
    gray: '#6b7280',
  }
} as const;

/**
 * Get status color based on value change
 */
export const getChangeColor = (change: number): string => {
  if (change > 0) return colors.success;
  if (change < 0) return colors.error;
  return colors.textSecondary;
};

/**
 * Get background color for status
 */
export const getChangeBgColor = (change: number): string => {
  if (change > 0) return colors.successBg;
  if (change < 0) return colors.errorBg;
  return 'transparent';
};
