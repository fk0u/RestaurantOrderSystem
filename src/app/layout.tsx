import type { Metadata, Viewport } from "next";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import { DockNav } from "@/components/dock-nav";
import { FabCart } from "@/components/fab-cart";
import { Toaster } from "@/components/ui/sonner"
import { cn } from "@/lib/utils";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0f172a", // Darker theme color for mobile bar
};

export const metadata: Metadata = {
  title: "RestoApp - Mobile First",
  description: "Modern Ordering System",
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="h-full">
      <body className={cn(
        "min-h-full bg-slate-50 font-sans antialiased selection:bg-orange-500 selection:text-white",
        fontSans.variable
      )}>
        {/* Desktop Background Ambience */}
        <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden bg-slate-100/50">
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-400/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-orange-400/10 rounded-full blur-[120px]" />
        </div>

        <div className="relative min-h-screen flex flex-col max-w-screen-xl mx-auto shadow-sm bg-white border-x border-slate-100">
          <main className="flex-1 w-full relative pb-32">
            {children}
          </main>

          <div className="block md:hidden">
            <FabCart />
          </div>

          <DockNav />
        </div>
        <Toaster />
      </body>
    </html>
  );
}
