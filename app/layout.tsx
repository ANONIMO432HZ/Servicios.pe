import type {Metadata} from 'next';
import { Inter, Public_Sans } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const publicSans = Public_Sans({
  subsets: ['latin'],
  variable: '--font-public-sans',
});

export const metadata: Metadata = {
  title: 'GovCheck - Consulta Vehicular',
  description: 'Plataforma de consulta vehicular institucional',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="es" className={`${inter.variable} ${publicSans.variable}`}>
      <body suppressHydrationWarning className="antialiased min-h-screen bg-background">
        {children}
      </body>
    </html>
  );
}
