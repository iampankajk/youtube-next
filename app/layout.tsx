import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Youtube Next App",
  description: "A YouTube clone built with Next.js",
  generator: "Next.js",
};

/**
 *
 * @param root0
 * @param root0.children
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
