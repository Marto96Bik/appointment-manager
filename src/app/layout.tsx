"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import "./globals.css";
import Sidebar from "./components/sidebar";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full bg-white">
      <body className="min-h-screen bg-gray-50 text-gray-900 antialiased">
        <Sidebar /> {/* ahora está dentro del body */}
        <div className="h-16" /> {/* espacio fijo para el botón */}
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </body>
    </html>
  );
}
