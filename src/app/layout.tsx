import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Luis Fotografía — Momentos que Perduran",
  description:
    "Fotógrafo profesional especializado en bodas, retratos y eventos. Capturando emociones auténticas con una visión artística única.",
  keywords: ["fotografía", "fotógrafo profesional", "bodas", "retratos", "sesiones fotográficas"],
  openGraph: {
    title: "Luis Fotografía — Momentos que Perduran",
    description: "Fotógrafo profesional especializado en bodas, retratos y eventos.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  );
}
