"use client";

import { Inter } from "next/font/google";
// import useStyles from "../hooks/useStyles";
// import webStyles from "../data/webstyles.json";
import "../styles/main.scss";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // useStyles(webStyles);

  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
