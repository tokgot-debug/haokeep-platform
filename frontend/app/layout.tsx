import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Vanbransa CleanPulse — Global Operations OS",
  description: "Autonomous Housekeeping & Turnover Operations Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="/css/main.css" />
        <link rel="stylesheet" href="/css/mobile.css" />
        <link rel="stylesheet" href="/css/components.css" />
        <script src="https://unpkg.com/lucide@latest"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/qrious/4.0.2/qrious.min.js"></script>
      </head>
      <body class="theme-dark">{children}</body>
    </html>
  );
}
