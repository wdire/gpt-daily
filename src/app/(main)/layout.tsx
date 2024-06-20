import type {Metadata} from "next";
import {Barlow_Condensed} from "next/font/google";
import "../globals.scss";

const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "GPT Daily",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={barlowCondensed.className}>{children}</body>
    </html>
  );
}
