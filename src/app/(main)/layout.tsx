import type {Metadata} from "next";
import {Barlow_Condensed} from "next/font/google";
import "../globals.scss";
import Link from "next/link";
import Header from "@/components/header";

const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: {
    template: "%s - GPT Daily",
    default: "GPT Daily",
  },
  description: "",
  icons: [
    {
      url: "apple-touch-icon",
      sizes: "180x180",
      href: "/favicon/apple-icon-180x180.png",
    },
    {
      url: "icon",
      sizes: "192x192",
      href: "/favicon/android-icon-192x192.png",
    },
    {
      url: "icon",
      sizes: "32x32",
      href: "/favicon/favicon-32x32.png",
    },
    {
      url: "icon",
      sizes: "96x96",
      href: "/favicon/favicon-96x96.png",
    },
    {
      url: "icon",
      sizes: "16x16",
      href: "/favicon/favicon-16x16.png",
    },
  ],
  manifest: "/favicon/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={barlowCondensed.className}>
        <Header />
        {children}
      </body>
    </html>
  );
}
