import { amiko } from "./fonts";
import "./globals.css";
import { Providers } from "./provider";
import type { Metadata } from 'next'
 
export const metadata: Metadata = {
  title: 'P-MO',
}

export default function RootLayout(
  { children }: { children: React.ReactNode; }) {
  return (
    <html lang='es'>
      <body className={`${amiko.className} antialiased `}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
