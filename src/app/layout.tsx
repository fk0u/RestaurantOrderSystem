import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { DockNav } from "@/components/dock-nav";
import { SidebarNav } from "@/components/sidebar-nav";
import { Toaster } from "sonner";
import { cn } from "@/lib/utils";

const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "Platter - Restaurant Order System",
  description: "Pengalaman pesan makan masa depan.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={cn("min-h-screen bg-slate-50 font-sans antialiased", outfit.variable)}>
        <div className="flex min-h-screen">
          <SidebarNav />
          <main className="flex-1 md:ml-64 w-full transition-all relative pb-24 md:pb-0">
            {children}
          </main>



          <DockNav />
        </div>
        <Toaster />
      </body>
    </html>
  );
}
