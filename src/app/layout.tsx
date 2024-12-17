import "./globals.css";
import { amiko } from "./fonts";
import type { Metadata } from 'next'
import { Providers } from "./provider";
import { AuthProvider } from "@/contexts/AuthContext";
import { AlertProvider } from "@/contexts/AlertContext";
import FooterComponent from "./_lib/components/footBar/FooterComponent";

export const metadata: Metadata = {
  title: 'P-MO Project Management Officer',
  description: 'P-MO fue desarrollado para facilitar la gestión organizativa de los docentes de la materia de Taller de Ingeniería de Software',
}

export default function RootLayout({ children }: { children: React.ReactNode; }) {
  return (
    <html lang='es'>
      <body className={`${amiko.className} antialiased`}>
        <Providers>
          <AuthProvider>
            <AlertProvider>
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
