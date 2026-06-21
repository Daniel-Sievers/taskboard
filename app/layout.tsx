import type { Metadata, Viewport } from "next";
import { PwaManager } from "@/components/pwa/PwaManager";
import { PreferencesManager } from "@/components/preferences/PreferencesManager";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Taskboard",
    template: "%s · Taskboard",
  },
  description:
    "Private installierbare Taskboard-App mit Tageslisten, Boards, Demo-Modus und Supabase-Sync.",
  manifest: "/manifest.webmanifest",
  applicationName: "Taskboard",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Taskboard",
    description:
      "Private installierbare Taskboard-App mit öffentlicher Demo, Tageslisten, Boards und Supabase-Sync.",
    url: siteUrl,
    siteName: "Taskboard",
    type: "website",
  },
  appleWebApp: {
    capable: true,
    title: "Taskboard",
    statusBarStyle: "black-translucent",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: ["/favicon.ico"],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-title": "Taskboard",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0b0b0f" },
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
  ],
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className="dark" data-scroll-behavior="smooth">
      <body>
        <PreferencesManager />
        <PwaManager />
        {children}
      </body>
    </html>
  );
}
