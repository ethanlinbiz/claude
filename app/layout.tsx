import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Prism - VibeCoingSolution",
  description: "從混沌到清晰，從靈感到上線。Prism 陪您，將模糊想法變成直覺流暢的數位體驗。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
