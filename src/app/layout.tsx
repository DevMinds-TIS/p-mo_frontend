import "./globals.css";
import { amiko } from "./fonts";
import type { Metadata } from 'next';
import { Providers } from "./provider";
import { AuthProvider } from "@/contexts/AuthContext";
import { AlertProvider } from "@/contexts/AlertContext";
import { UserProvider } from "@/contexts/UserContext";
import FooterComponent from "./_lib/components/footBar/FooterComponent";
import NavBarComponent from "./_lib/components/topBar/NavbarComponent";
import { TeacherListProvider } from "@/contexts/TeacherListContext";
import { ProjectProvider } from "@/contexts/ProjectContext";

export const metadata: Metadata = {
  title: 'P-MO',
};

export default function RootLayout({ children }: { children: React.ReactNode; }) {
  return (
    <html lang='es'>
      <body className={`${amiko.className} antialiased`}>
        <Providers>
          <UserProvider>
            <AuthProvider>
              <TeacherListProvider>
                <AlertProvider>
                  <ProjectProvider>
                    <NavBarComponent />
                    <section>
                      {children}
                    </section>
                    <FooterComponent />
                  </ProjectProvider>
                </AlertProvider>
              </TeacherListProvider>
            </AuthProvider>
          </UserProvider>
        </Providers>
      </body>
    </html>
  );
}
