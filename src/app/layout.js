"use client";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import MainLayout from "@/components/layouts/Main";
import Analytics from "@/utils/Analytics";
import Providers from "@/utils/provider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const dynamic = "force-dynamic";
export default function RootLayout({ children }) {
  return (
    <html lang="en" className="light">
      <head>
        <meta name="referrer" content="no-referrer" />
        <link
          rel="icon"
          type="image/png"
          href="https://newsay.sgp1.digitaloceanspaces.com/flashie/flashie-ic-kieT.png"
        ></link>
      </head>
      <body className={inter.className}>
        <Suspense>
          <Analytics />
        </Suspense>
        <Providers>
          <MainLayout>{children}</MainLayout>
        </Providers>
      </body>
    </html>
  );
}
