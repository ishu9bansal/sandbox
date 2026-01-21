import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import ReduxProvider from "@/store/ReduxProvider";
import { SidebarProvider } from "@/contexts/SidebarContext";
import { Toaster } from "@/components/ui/sonner";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "Sandbox - Web Projects Playground",
  description: "A sandbox environment for experimenting with web projects",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className={inter.variable}>
        <body className="antialiased">
          <ReduxProvider>
            <SidebarProvider>
              <div className="flex min-h-screen">
                <Sidebar />
                <div className="flex-1 flex flex-col min-w-0">
                  <Navbar />
                  <main className="flex-1 p-4 md:p-6 bg-gray-50 dark:bg-gray-900">
                    {children}
                  </main>
                  <Toaster />
                </div>
              </div>
            </SidebarProvider>
          </ReduxProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
