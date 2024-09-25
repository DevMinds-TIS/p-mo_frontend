// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
//import "./prueba.css"; // Asegúrate de que esta línea esté descomentada si necesitas estilos globales

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Editar proyecto",
  description: "Página para que el docente edite los proyectos que crea",
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