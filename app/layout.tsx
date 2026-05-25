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
  description: "Private synchronisierte Taskboard-App mit Supabase-Sync.",
  manifest: "/manifest.webmanifest",
  applicationName: "Taskboard",
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
};

export const viewport: Viewport = {
  themeColor: "#0b0b0f",
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
