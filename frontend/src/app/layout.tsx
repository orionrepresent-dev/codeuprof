import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Código do Eu Profundo",
  description: "OS de Consciência Simbólica",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased flex h-screen overflow-hidden text-foreground bg-background">
        {children}
      </body>
    </html>
  );
}
