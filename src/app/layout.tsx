"use client";

import "./globals.css";
import { Roboto } from "next/font/google";
import Sidebar from "./components/sidebar";
import Header from "./components/header";
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
      <body className="min-h-screen bg-gray-50 text-gray-900 antialiased flex">
        {showSidebar && <Sidebar />}

        <div className="flex-1 flex flex-col">
          {showSidebar && <Header />}

          <main className="flex-1 overflow-auto">{children}</main>
        </div>
      </body>
    </html>
  );
}
