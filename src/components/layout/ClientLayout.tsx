'use client';

import dynamic from 'next/dynamic';

const Header = dynamic(() => import('@/components/layout/Header'));

const Footer = dynamic(() => import('@/components/layout/Footer'));

export default function ClientLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
