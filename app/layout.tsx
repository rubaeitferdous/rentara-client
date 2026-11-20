import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";

import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import SiteLayout from "@/components/SiteLayout";
import { cn } from "@/lib/utils";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Rentara — Premium Equipment Rental Marketplace",
  description:
    "Rent certified industrial construction machinery, cinema photography kits, commercial fleet haulers, and event sound gear with guaranteed availability and secure checkout.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, "font-sans", geist.variable)}
    >
      <body className="min-h-screen bg-background text-foreground antialiased selection:bg-amber-500/20 selection:text-amber-700 dark:selection:text-amber-300">
        <ThemeProvider>
          <SiteLayout>{children}</SiteLayout>
          <Toaster
            position="top-right"
            toastOptions={{
              className:
                "!bg-card !text-foreground !border !border-border !shadow-lg !shadow-amber-950/5 !rounded-xl !text-sm",
              duration: 3500,
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
