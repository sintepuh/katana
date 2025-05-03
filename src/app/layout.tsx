import type { Metadata } from "next";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import QueryProviders from "@/components/query-provider";
import { Toaster } from "@/components/ui/sonner";

import "./globals.css";
import "@radix-ui/themes/styles.css";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { StoreProvider } from "./store/StoreProvider";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: "Katana",
  description: "Project manager Katana",
};

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <StoreProvider>
      <html lang="en">
        <body className={cn("antialiased min-h-screen", inter.className)} suppressHydrationWarning>
          <QueryProviders>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
              {children}
              <Toaster />
              <ReactQueryDevtools />
            </ThemeProvider>
          </QueryProviders>
        </body>
      </html>
    </StoreProvider>
  );
}
