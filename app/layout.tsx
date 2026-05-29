import type { Metadata, Viewport } from "next";
import { Bebas_Neue, DM_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

const jetBrainsMono = JetBrains_Mono({
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
    siteName: "OnlySA",
    locale: "en_ZA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "OnlySA — For SA Eyes Only",
    description: "Anonymous. Unfiltered. SA.",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "OnlySA",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#080808",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-ZA" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/icons/icon-192.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icons/icon-192.svg" />
      </head>
      <body className={`${bebasNeue.variable} ${dmSans.variable} ${jetBrainsMono.variable} noise`}>
        {children}
      </body>
    </html>
  );
}
