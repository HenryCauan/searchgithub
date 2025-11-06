import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GitHub Profile Search | Henry Cauan",
  description: "Aplicação desenvolvida em React e Next.js que permite buscar e visualizar perfis de usuários do GitHub, incluindo nome, bio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
