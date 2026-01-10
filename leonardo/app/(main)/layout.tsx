import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { Providers } from "../providers";
import SidebarNavigation from "@/components/navigation/sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Leonardo.ai",
  description: "AI-powered image generation",
};

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <div
            className="relative grid min-h-screen grid-cols-[0_auto] md:grid-cols-[var(--sidebar-navigation-width)_auto]"
            style={
              {
                "--sidebar-navigation-width": "6.5rem",
              } as React.CSSProperties
            }
          >
            <SidebarNavigation />
            <div className="max-w-100vw min-w-full pt-16 sm:pt-14 md:pt-5 lg:pt-3">
              {children}
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
