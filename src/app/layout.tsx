import { amiko } from "./fonts";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='es'>
      <body className={`${amiko.className} antialiased`}>
        {children}
      </body>
  </html>
  );
}
