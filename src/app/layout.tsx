import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { Poppins, Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers';
import { theme } from '@/styles/theme';

// Fonts
const poppins = Poppins({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['400', '500', '600', '700'],
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Mapéro — Bons plans apéro près de chez vous',
  description:
    'Mapéro vous connecte aux meilleurs bars et restaurants partenaires pour profiter de réductions exclusives sur vos apéros.',
};

// 👉 Fix TS : autoriser les variables CSS personnalisées
type CSSVars = React.CSSProperties & Record<string, string>;

// 👉 On construit proprement les variables CSS
const cssVariables: CSSVars = {};

Object.entries(theme.colors).forEach(([key, value]) => {
  cssVariables[`--theme-color-${key}`] = value;
});

Object.entries(theme.radius).forEach(([key, value]) => {
  cssVariables[`--theme-radius-${key}`] = value;
});

Object.entries(theme.shadow).forEach(([key, value]) => {
  cssVariables[`--theme-shadow-${key}`] = value;
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr" className={`${poppins.variable} ${inter.variable}`}>
      <body style={cssVariables}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
