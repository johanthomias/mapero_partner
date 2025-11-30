export const theme = {
  colors: {
    primary: '#4E73DF',
    success: '#1CC88A',
    warning: '#F6C23E',
    danger: '#E74A3B',
    background: '#F8F9FC',
    card: '#FFFFFF',
    text: '#1F2937',
    subtleText: '#6B7280',
    border: '#E5E7EB',
  },
  radius: {
    sm: '6px',
    md: '12px',
    lg: '20px',
  },
  shadow: {
    card: '0 4px 16px rgba(0, 0, 0, 0.05)',
  },
} as const;

export type Theme = typeof theme;
