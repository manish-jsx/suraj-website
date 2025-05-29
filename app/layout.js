import './globals.css';
import ClientLayout from '@/components/ClientLayout';
import MobileNav from '@/components/MobileNav';

export const metadata = {
  title: "Cinematographer Portfolio",
  description: "Award-winning cinematographer showcasing cinematic excellence",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="font-sans bg-black text-white">
        <MobileNav />
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
