import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

// Strictly Font 1: Inter (Black 900 for bold headers/numbers, plus weights for structure)
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  display: "swap",
});

// Strictly Font 2: Apple Garamond equivalent (Light Italic 300 for narrative/quotes)
const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-garamond",
  subsets: ["latin"],
  weight: ["300", "400"],
  style: ["italic"],
  display: "swap",
});

// Hero Display Font: BN Riley
const bnRiley = localFont({
  src: "../../public/fonts/BNRiley.otf",
  variable: "--font-riley",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Soham Roychoudhury — Software & Web Development | Digital Operations",
  description:
    "Interactive developer portfolio of Soham Roychoudhury — Computer Science & Engineering (AI/ML) at NSEC Kolkata. Frontend development, cross-border digital operations, and intelligent systems.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${cormorantGaramond.variable} ${bnRiley.variable}`}
      suppressHydrationWarning
    >
      <body
        className="bg-[#FAFAF9] text-[#0F172A] font-sans antialiased selection:bg-[#10B981]/20 selection:text-[#059669] min-h-screen overflow-x-hidden"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
