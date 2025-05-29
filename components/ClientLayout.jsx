'use client';

import NavigationSystem from '@/components/Navigation/NavigationSystem';
import Footer from '@/components/Footer';

export default function ClientLayout({ children }) {
  return (
    <>
      <NavigationSystem />
      {children}
      <Footer />
    </>
  );
}
