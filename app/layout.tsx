import type { Metadata, Viewport } from "next";
import "./globals.css";

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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body className="noise">
        {children}
      </body>
    </html>
  );
}
