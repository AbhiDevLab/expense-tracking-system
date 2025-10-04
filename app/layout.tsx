import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import { Link } from "@nextui-org/link";
import clsx from "clsx";

import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";
import { Navbar } from "@/components/navbar";

import { Providers } from "./providers";
import { AuthProvider } from "@/contexts/AuthContext";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: [
      { url: "/favicon-dark.svg", media: "(prefers-color-scheme: dark)" },
      { url: "/favicon-light.svg", media: "(prefers-color-scheme: light)" },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <head />
      <body
        className={clsx(
          "min-h-screen flex flex-col bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
          <AuthProvider>
            {/* Full-screen starfield background */}
            <div className="fixed inset-0 z-0 bg-gradient-to-br from-background via-background to-blue-100 dark:from-gray-900 dark:via-black dark:to-gray-800">
              <div className="starfield-layer star-1"></div>
              <div className="starfield-layer star-2"></div>
              <div className="starfield-layer star-3"></div>
              <div className="starfield-layer star-4"></div>
            </div>
            
            {/* Content wrapper with higher z-index */}
            <div className="relative z-10 flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-grow flex flex-col">
                <div className="container mx-auto max-w-7xl pt-16 px-6 flex-grow flex flex-col">
                  {children}
                </div>
              </main>
              
              {/* Footer with minimal height */}
              <footer className="w-full flex items-center justify-center min-h-[32px] bg-background/80 backdrop-blur-sm border-t border-border">
                <Link
                  isExternal
                  className="flex items-center gap-1 text-current text-sm py-1"
                  href="https://github.com/AbhiDevLab"
                  title="AbhiDevLab"
                >
                  <span className="text-foreground/60">Powered by</span>
                  <p className="text-primary">AbhiDevLab</p>
                </Link>
              </footer>
            </div>
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}