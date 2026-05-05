import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Providers from "@/components/layout/Providers";

const geist = Geist({ subsets: ["latin"] });

const themeScript = `
try {
  var theme = localStorage.getItem("theme") === "dark" ? "dark" : "light";
  document.documentElement.classList.toggle("dark", theme === "dark");
  document.documentElement.dataset.theme = theme;
} catch (_) {}
`;

export const metadata: Metadata = {
  title: "Aulix - Plataforma de aprendizaje",
  description:
    "Explora cursos online, matriculate y avanza a tu ritmo con seguimiento de progreso en Aulix.",
  applicationName: "Aulix",
  keywords: [
    "Aulix",
    "cursos online",
    "plataforma de aprendizaje",
    "educacion online",
    "LMS",
  ],
  authors: [{ name: "Aulix" }],
  creator: "Aulix",
  openGraph: {
    title: "Aulix - Plataforma de aprendizaje",
    description:
      "Explora cursos online, matriculate y avanza a tu ritmo con seguimiento de progreso en Aulix.",
    type: "website",
    locale: "es_ES",
    siteName: "Aulix",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={geist.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
