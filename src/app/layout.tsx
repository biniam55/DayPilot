import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ServiceWorkerRegistration } from "@/components/ServiceWorkerRegistration";
import { AuthProvider } from "@/contexts/AuthContext"; // Real Firebase auth
// import { DemoAuthProvider as AuthProvider } from "@/contexts/DemoAuthContext"; // Demo mode (no Firebase needed)

export const metadata: Metadata = {
  title: "DayPilot - Smart Task Management",
  description: "AI-powered daily planner and task management app",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "DayPilot",
  },
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" }
  ],
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <AuthProvider>
          <ServiceWorkerRegistration />
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
