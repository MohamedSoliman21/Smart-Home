import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/lib/auth';
import { DeviceProvider } from '@/lib/deviceContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Smart Home Dashboard',
  description: 'A fully animated smart home IoT interface',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <DeviceProvider>
            {children}
          </DeviceProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
