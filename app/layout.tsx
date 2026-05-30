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
    <html lang="en-ZA" className="dark">
      <head>
        {/* Preconnect for Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Syne:wght@600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className="grain"
        style={{
          fontFamily: "var(--font-body)",
          background: "var(--bg)",
        }}
      >
        {children}
      </body>
    </html>
  );
}
