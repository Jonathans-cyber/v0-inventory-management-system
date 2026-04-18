import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Inventario IT - Gestión de Equipos",
  description: "Sistema de gestión de inventario de equipos de cómputo",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="bg-[#0f172a]">
      <body>{children}</body>
    </html>
  );
}
