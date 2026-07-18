import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "ORION X — Intelligent Enterprise OS",
    template: "%s | ORION X",
  },
  description:
    "ORION X ist eine Premium AI-native Enterprise-Webplattform — das intelligente Betriebssystem für Ihre Arbeit.",
  keywords: [
    "ORION X",
    "KI-Plattform",
    "Enterprise OS",
    "KI-Assistent",
    "Projektmanagement",
    "Business Intelligence",
    "Automation",
  ],
  authors: [{ name: "ORION X" }],
  creator: "ORION X",
  publisher: "ORION X",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "de_DE",
    siteName: "ORION X",
    title: "ORION X — Intelligent Enterprise OS",
    description:
      "Die Premium AI-native Enterprise-Webplattform für intelligentes Arbeiten.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="de"
      className={`dark ${inter.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
