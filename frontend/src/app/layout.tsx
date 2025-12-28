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
  title: "Tidal Power Fitness | Elite Personal Training & Group Classes",
  description: "Transform your body and elevate your life with elite personal training and group classes tailored to your goals. Expert coaches, proven results, and a premium fitness community.",
  keywords: ["personal training", "fitness classes", "weight loss", "muscle gain", "HIIT", "yoga", "nutrition coaching"],
  authors: [{ name: "Scott Marquis" }],
  openGraph: {
    title: "Tidal Power Fitness | Elite Personal Training",
    description: "Transform your body and elevate your life with elite personal training and group classes.",
    url: "https://tidalpowerfitness.com",
    siteName: "Tidal Power Fitness",
    images: [
      {
        url: "/logo.jpg",
        width: 800,
        height: 800,
        alt: "Tidal Power Fitness Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tidal Power Fitness | Elite Personal Training",
    description: "Transform your body and elevate your life with elite personal training and group classes.",
    images: ["/logo.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
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
