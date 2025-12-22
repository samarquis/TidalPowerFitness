import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { DemoModeProvider } from "@/contexts/DemoModeContext";
import ErrorBoundary from "@/components/ErrorBoundary";
import Navigation from "@/components/Navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tidal Power Fitness - Transform Your Body, Elevate Your Life",
  description: "Premium personal training and fitness coaching in your area. Expert trainers, personalized programs, real results.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-black text-white logo-watermark`}>
        <ErrorBoundary>
          <AuthProvider>
            <CartProvider>
              <DemoModeProvider>
                <Navigation />
                <main className="pt-16">
                  {children}
                </main>
              </DemoModeProvider>
            </CartProvider>
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
