// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
//import "./prueba.css"; // Asegúrate de que esta línea esté descomentada si necesitas estilos globales

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Registrar equipo",
  description: "Página para registro de equipos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}

