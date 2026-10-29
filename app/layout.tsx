import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner"; 
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nexus Store — Hardware & Tech Premium",
  description: "Tienda online de tecnología y componentes de alto rendimiento",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-zinc-950 text-zinc-100">
        <Toaster 
          position="bottom-right" 
          theme="dark" 
          richColors={false}
          toastOptions={{
            style: {
              background: 'rgba(9, 9, 11, 0.85)', 
              backdropFilter: 'blur(16px)',         
              border: '1px solid rgba(52, 211, 153, 0.2)', 
              color: '#f4f4f5',                    
              borderRadius: '1.25rem',             
              padding: '1rem',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(52, 211, 153, 0.1)', 
            },
            className: 'border border-emerald-500/20 shadow-2xl',
            }}
            />
        {children}
      </body>
    </html>
  );
}