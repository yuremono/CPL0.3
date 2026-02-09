import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Noto_Sans_JP } from "next/font/google";
import {
  Space_Mono,
  Press_Start_2P,
  VT323,
  Orbitron,
  Righteous,
} from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  display: "swap",
});

// Y2K Fonts
const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

const pressStart2P = Press_Start_2P({
  variable: "--font-press-start-2p",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

const vt323 = VT323({
  variable: "--font-vt323",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  display: "swap",
});

const righteous = Righteous({
  variable: "--font-righteous",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Z.AI - Creative Developer Portfolio",
  description: "Building digital experiences with precision and purpose. A creative developer portfolio showcasing modern web development projects.",
  keywords: ["portfolio", "web development", "creative developer", "Next.js", "TypeScript"],
  authors: [{ name: "Z.AI" }],
  openGraph: {
    title: "Z.AI - Creative Developer Portfolio",
    description: "Building digital experiences with precision and purpose.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Z.AI - Creative Developer Portfolio",
    description: "Building digital experiences with precision and purpose.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${notoSansJP.variable} ${spaceMono.variable} ${pressStart2P.variable} ${vt323.variable} ${orbitron.variable} ${righteous.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
