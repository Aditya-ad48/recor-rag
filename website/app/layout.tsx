import type { Metadata } from "next";
import { Ubuntu_Mono } from "next/font/google";
import { ReactNode } from "react";
import "./globals.css";

const ubuntuMono = Ubuntu_Mono({
    subsets: ["latin"],
    weight: "400",
    variable: "--font-ubuntu-mono",
});

export const metadata: Metadata = {
    title: "ObserveAI",
    description: "user agent conversation overview chatbot.",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
    return (
        <html lang="en">
            <body className={`${ubuntuMono.className}`}>{children}</body>
        </html>
    );
}
