import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { InstallPrompt } from "@/components/install-prompt";
import { SiteHeader } from "@/components/site-header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Vlereso - Vlerësime të verifikuara në Shqipëri",
    template: "%s | Vlereso",
  },
  description:
    "Platformë publike për vlerësime të verifikuara të bizneseve, institucioneve dhe shërbimeve në Shqipëri.",
  applicationName: "Vlereso",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "Vlereso",
    statusBarStyle: "default",
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  openGraph: {
    title: "Vlereso",
    description:
      "Vlerëso vendet ku shkon. Ndihmo të tjerët të dinë çfarë të presin.",
    siteName: "Vlereso",
    locale: "sq_AL",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sq" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-screen">
        <SiteHeader />
        {children}
        <InstallPrompt />
      </body>
    </html>
  );
}
