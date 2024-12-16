import "./globals.css";
import { amiko } from "./fonts";
import type { Metadata } from 'next'
import { Providers } from "./provider";
import { AuthProvider } from "@/contexts/AuthContext";
import { AlertProvider } from "@/contexts/AlertContext";
import FooterComponent from "./_lib/components/footBar/FooterComponent";
import NavBarComponent from "./_lib/components/topBar/NavbarComponent";

export const metadata: Metadata = {
  title: 'P-MO',
}

export default function RootLayout({ children }: { children: React.ReactNode; }) {
  return (
    <html lang='es'>
      <body className={`${amiko.className} antialiased`}>
        <Providers>
          <AuthProvider>
            <AlertProvider>
              <NavBarComponent />
              <section>
                {children}
              </section>
              <FooterComponent />
            </AlertProvider>
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
