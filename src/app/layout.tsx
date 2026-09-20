import type { Metadata, Viewport } from "next";
import "katex/dist/katex.min.css";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteSidebar } from "@/components/layout/site-sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { absoluteUrl, siteConfig } from "@/lib/site/config";
import { fontVariables } from "./fonts";
import "./globals.css";

const siteBasePath = process.env.PAGES_BASE_PATH ?? "";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  authors: [siteConfig.author],
  creator: siteConfig.author.name,
  publisher: siteConfig.author.name,
  verification: {
    google: "3EPEAbFz57dHFeqI5F187uKWHTQQyvKJ1GdbC5OBwdc",
  },
  referrer: "origin-when-cross-origin",
  formatDetection: {
    address: false,
    email: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
    types: {
      "application/rss+xml": absoluteUrl("/rss.xml"),
    },
  },
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: "/",
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
  },
  twitter: {
    card: "summary",
    title: siteConfig.name,
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export const viewport: Viewport = {
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8efe7" },
    { media: "(prefers-color-scheme: dark)", color: "#2d2a2e" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang={siteConfig.language}
      className={`${fontVariables} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          disableTransitionOnChange
          enableColorScheme
          enableSystem
        >
          <div className="site-shell">
            <SiteSidebar basePath={siteBasePath} />
            <div className="site-content">
              {children}
              <SiteFooter basePath={siteBasePath} />
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
