import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MeetLove - Understand & Connect",
  description: "AI-driven relational coach app leveraging MBTI and psychology.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
