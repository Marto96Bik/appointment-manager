"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import "./globals.css";
import { Roboto } from "next/font/google";
import Sidebar from "./components/sidebar";
import { usePathname } from "next/navigation";

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showSidebar = pathname !== "/login";

  return (
    <html lang="es" className={`h-full bg-white ${roboto.variable}`}>
      <body className="min-h-screen bg-gray-50 text-gray-900 antialiased">
        {showSidebar && <Sidebar />}
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </body>
    </html>
  );
}
