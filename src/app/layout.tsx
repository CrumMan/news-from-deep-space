import type { Metadata } from "next";
import "./global.css";
import ChatBot from "./components/chatBot";
import Navbar from "./ui/nav";
import Footer from "./ui/footer";

export const metadata: Metadata = {
  title: "News From Deep Space",
  description: "Explore space articles and photos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main style={{ minHeight: "calc(100vh - 200px)" }}>{children}</main>
        <ChatBot />
        <Footer />
      </body>
    </html>
  );
}
