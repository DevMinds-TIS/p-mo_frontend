"use client";
import "./globals.css";
import { amiko } from "./fonts";
import { Providers } from "./provider";
import { AuthProvider } from "@/contexts/AuthContext";
import { AlertProvider } from "@/contexts/AlertContext";
import FooterComponent from "./_lib/components/footBar/FooterComponent";
import NavBarComponent from "./_lib/components/topBar/NavbarComponent";
import Header from "./(pages)/landing/Header";

export default function RootLayout({ children }: { children: React.ReactNode; }) {
  return (
    <html lang='es'>
      <body className={`${amiko.className} antialiased`}>
        <Providers>
          <AuthProvider>
            <AlertProvider>
              {/* <NavBarComponent /> */}
              <Header />
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
