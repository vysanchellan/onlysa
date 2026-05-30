import type { Metadata, Viewport } from "next";
import { Syne } from "next/font/google";
import { DM_Sans } from "next/font/google";
import { IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-syne",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-dm",
  display: "swap",
});

const ibmMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "OnlySA — For SA Eyes Only",
  description:
    "Anonymous hyperlocal confessions, reviews, and community opinions from South Africa. No name. No face. Just truth.",
  keywords: "South Africa, anonymous, confessions, reviews, Durban, Joburg, Cape Town, local",
  openGraph: {
    title: "OnlySA — For SA Eyes Only",
    description: "Anonymous. Unfiltered. SA.",
    type: "website",
    locale: "en_ZA",
    siteName: "OnlySA",
  },
  twitter: {
    card: "summary_large_image",
    title: "OnlySA — For SA Eyes Only",
    description: "Anonymous. Unfiltered. SA.",
  },
  other: {
    "apple-mobile-web-app-title": "OnlySA",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "mobile-web-app-capable": "yes",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#070709",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en-ZA"
      className={`dark ${syne.variable} ${dmSans.variable} ${ibmMono.variable}`}
    >
      <body className="bg-[#070709] text-white" style={{ fontFamily: "var(--font-dm, 'DM Sans', sans-serif)" }}>
        {children}
      </body>
    </html>
  );
}
