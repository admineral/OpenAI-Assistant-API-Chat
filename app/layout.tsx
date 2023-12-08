import "./globals.css";
import { Inter } from "next/font/google";
import { ReactNode } from "react";
import Toaster from "./toaster";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next"; // Import SpeedInsights

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Agent42",
  description: "OpenAI Assistant",
  metadataBase: 'https://mydomain.com'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Toaster />
        <SpeedInsights /> {/* Add SpeedInsights */}
      </body>
      <Analytics />
    </html>
  );
}