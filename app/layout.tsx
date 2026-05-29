import './globals.css';
import { Inter, Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import NextTopLoader from 'nextjs-toploader';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const space = Space_Grotesk({ subsets: ['latin'], variable: '--font-display' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export const metadata = {
  title: 'VOIDSTREAM',
  description: 'Premium streaming frontend platform.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`dark h-full ${inter.variable} ${space.variable} ${mono.variable}`}>
      <body className="bg-void-950 text-zinc-100 h-full flex flex-col no-scrollbar font-body" suppressHydrationWarning>
        <NextTopLoader color="#dc2626" showSpinner={false} height={3} />
        <Navbar />
        <main className="flex-1 flex flex-col pt-20">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
