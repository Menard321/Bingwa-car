import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Bingwa Cars | Magari ya Uhakika Dar es Salaam (Mwenge & Mikocheni)',
  description:
    'Enterprise multi-branch used car sales, Japan/UK custom importation, and 3D digital showroom in Dar es Salaam, Tanzania. Strict Owner-Locked Pricing in TZS & 100% TRA TANSAD verified.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="sw" className="dark">
      <body className="min-h-screen bg-[#050811] text-slate-100 antialiased selection:bg-amber-500 selection:text-slate-950">
        {children}
      </body>
    </html>
  );
}

