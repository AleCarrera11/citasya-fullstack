import type { Metadata } from "next";
import { Poppins, Roboto_Condensed } from "next/font/google";
import "./globals.css";
import { Header } from "../components/Header";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "700"], 
  variable: '--font-poppins',
});

const roboto_condensed = Roboto_Condensed({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: '--font-roboto-condensed',
});

export const metadata: Metadata = {
  title: "CitasYa Admin",
  description: "Panel de administración para el bot de citas.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${poppins.variable} ${roboto_condensed.variable}`}>
      <body>
        <Header />
        <div>
          {children}
        </div>
      </body>
    </html>
  );
}
