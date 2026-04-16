import type { Metadata } from "next";
import "./globals.css"; 

export const metadata: Metadata = {
  title: "Nezuko | HR Portal",
  description: "Secure HR Management System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children; 
}