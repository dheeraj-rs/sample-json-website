'use client';

import { Inter } from 'next/font/google';
import { useWebStyles } from '@/hooks/useWebStyles';
// import '@/styles/main.scss';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useWebStyles();
  
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}