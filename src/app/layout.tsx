import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import './globals.css';
import { getServerSession } from 'next-auth';
import SessionProvider from '@/components/common/SessionProvider'; // Create this file if it doesn't exist

// Load Roboto font
const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '700'], // Specify font weights (400 = Regular, 700 = Bold)
  variable: '--font-roboto', // Create a CSS variable for Tailwind use
});

export const metadata: Metadata = {
  title: 'Ai.DIT',
  description: 'A.I Audit Assistant and Agent',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession();

  return (
    <SessionProvider session={session}>
      <html lang='en'>
        <body className={roboto.variable}>{children}</body>
      </html>
    </SessionProvider>
  );
}
