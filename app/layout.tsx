import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AppStateProvider } from "@/lib/store";

export const metadata: Metadata = {
  title: "EducAll — Багшийн анхаарал чиглүүлэгч",
  description:
    "Хэт олон хүүхэдтэй ангид далд бэрхшээлтэй сурагчдыг шалгалт илрүүлэхээс өмнө олж тогтоодог AI эрт сэрэмжлүүлэх систем.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0c8043",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="mn" className="h-full antialiased">
      <body className="min-h-full">
        <AppStateProvider>{children}</AppStateProvider>
      </body>
    </html>
  );
}
