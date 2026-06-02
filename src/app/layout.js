import { Outfit, Cinzel, Cormorant_Garamond } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata = {
  title: "Sharma Events | Wedding Decoration, Tent Setup, DJ & Catering in Jharkhand",
  description: "Sharma Events (sharmaevents.co.in) is the premier event planning company in Ramgarh, Chhattarpur, Palamau, and Jharkhand. We provide Wedding Decoration, Tent & Canopy Setup, Catering Services, DJ & Sound Setup, and Event Lighting.",
  keywords: "Sharma Events, sharmaevents.co.in, Wedding Decoration Palamau, Tent Setup Chhattarpur, Catering Services Palamau, DJ and Sound Jharkhand, Event Lighting Ramgarh, Event Management Jharkhand",
  authors: [{ name: "Sharma Events" }],
};

export const viewport = {
  width: "device-width",
  initialScale: 1.0,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${outfit.variable} ${cinzel.variable} ${cormorant.variable} font-sans min-h-screen bg-cyber-dark text-gray-100 antialiased flex flex-col`}
      >
        {children}
      </body>
    </html>
  );
}
