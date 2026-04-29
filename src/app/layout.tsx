import type { Metadata } from 'next';
import { DM_Serif_Display, DM_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import ChatBot from '@/components/ChatBot';

const serif = DM_Serif_Display({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-serif',
  display: 'swap',
});

const sans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'small RNA MetaVir — Documentation',
  description:
    'Documentation and AI assistant for the small RNA MetaVir bioinformatics pipeline for viral sequence identification via small RNA profiling.',
  metadataBase: new URL('https://rnai-bioinfo.github.io/small-rna-metavir-docs/'),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable} ${mono.variable}`}>
      <body className="bg-cream-50">
        <div className="bg-grain min-h-screen">
          <NavBar />
          <main className="relative z-10">{children}</main>
          <Footer />
          <ChatBot />
        </div>
      </body>
    </html>
  );
}
