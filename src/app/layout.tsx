"use client";

import "./globals.css";
import { Roboto } from "next/font/google";
import Sidebar from "./components/sidebar";
import { usePathname } from "next/navigation";
import NotificationBell from "./components/notificationBell";

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
        {showSidebar && <NotificationBell />}
        {children}
      </body>
    </html>
  );
}
