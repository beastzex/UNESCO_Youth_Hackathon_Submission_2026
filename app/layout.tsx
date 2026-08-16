import type { Metadata } from "next";
import "./globals.css";
import { Manrope, Cormorant_Garamond } from "next/font/google";
import { LanguageProvider } from "@/context/LanguageContext";
import { RoleProvider } from "@/context/RoleContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { VoisNavbar } from "@/components/VoisNavbar";
import { VoisFooter } from "@/components/VoisFooter";
import { DomiChat } from "@/components/DomiChat";

// Primary heading / large display font
const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

// Accent cursive / editorial serif font
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "V0ICE — The MIL Immune System | UNESCO Youth Hackathon 2026",
  description:
    "A citizen misinformation-surveillance & public health counter-epidemic platform. Report, verify, and counter strains of deceptive content.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${manrope.variable} ${cormorant.variable}`}>
      <body className="bg-black text-white dark:bg-black dark:text-white antialiased min-h-screen flex flex-col justify-between selection:bg-white selection:text-black dark:selection:bg-white dark:selection:text-black transition-colors duration-300">
        <ThemeProvider>
          <LanguageProvider>
            <RoleProvider>
              <VoisNavbar />
              <main className="flex-grow">{children}</main>
              <DomiChat />
              <VoisFooter />
            </RoleProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
