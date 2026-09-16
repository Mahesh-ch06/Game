import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { Home, Gamepad2, Layers, Sparkles } from "lucide-react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { BrandLogo } from "../components/BrandLogo";
import { GlobalFooter } from "../components/GlobalFooter";
import { CookieBanner } from "../components/CookieBanner";
import { LogoProvider } from "../context/LogoContext";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4 text-white">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-white">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-white">Page not found</h2>
        <p className="mt-2 text-sm text-gray-400">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-primary-dark shadow-md shadow-primary/25"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4 text-white">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-white">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-gray-400">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-primary-dark cursor-pointer shadow-md shadow-primary/25"
          >
            Try again
          </button>
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/10"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover",
      },
      { name: "theme-color", content: "#0b0d14" },
      { name: "mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
      { name: "apple-mobile-web-app-title", content: "Secret Word Room" },
      { name: "application-name", content: "Secret Word Room" },
      { name: "author", content: "Secret Word Room" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "google-adsense-account", content: "ca-pub-1433423291561077" },
    ],
    scripts: [
      {
        src: "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1433423291561077",
        async: true,
        crossOrigin: "anonymous",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,800&family=DM+Sans:wght@400;500;700&display=swap",
      },
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
      { rel: "icon", href: "/favicon.png", type: "image/png" },
      { rel: "apple-touch-icon", href: "/favicon.png" },
      { rel: "manifest", href: "/manifest.json" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
        <meta name="google-adsense-account" content="ca-pub-1433423291561077" />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1433423291561077"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isInRoom = pathname.startsWith("/room/");

  return (
    <QueryClientProvider client={queryClient}>
      <LogoProvider>
        <div className="flex flex-col min-h-screen bg-transparent text-white selection:bg-primary selection:text-white">
          {/* Navigation Bar */}
          <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-xl transition-all duration-300">
            <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 sm:h-20 items-center justify-between">
                <div className="flex items-center gap-3 sm:gap-12">
                  <Link to="/" className="group flex items-center">
                    <BrandLogo size="md" />
                  </Link>
                  <div className="hidden lg:block">
                    <div className="flex items-center space-x-1">
                      <Link
                        to="/games"
                        className="rounded-lg px-3 py-2 text-sm font-semibold text-gray-400 hover:bg-white/5 hover:text-white transition-all duration-300"
                        activeProps={{ className: "text-white bg-white/5" }}
                      >
                        Games
                      </Link>
                      <a
                        href="/#categories"
                        className="rounded-lg px-3 py-2 text-sm font-semibold text-gray-400 hover:bg-white/5 hover:text-white transition-all duration-300"
                      >
                        Categories
                      </a>
                      <a
                        href="/#how-it-works"
                        className="rounded-lg px-3 py-2 text-sm font-semibold text-gray-400 hover:bg-white/5 hover:text-white transition-all duration-300"
                      >
                        How It Works
                      </a>
                      <a
                        href="/#guides"
                        className="rounded-lg px-3 py-2 text-sm font-semibold text-gray-400 hover:bg-white/5 hover:text-white transition-all duration-300"
                      >
                        Guides
                      </a>
                      <a
                        href="/#faq"
                        className="rounded-lg px-3 py-2 text-sm font-semibold text-gray-400 hover:bg-white/5 hover:text-white transition-all duration-300"
                      >
                        FAQ
                      </a>
                      <Link
                        to="/about"
                        className="rounded-lg px-3 py-2 text-sm font-semibold text-gray-400 hover:bg-white/5 hover:text-white transition-all duration-300"
                        activeProps={{ className: "text-white bg-white/5" }}
                      >
                        About
                      </Link>
                      <Link
                        to="/contact"
                        className="rounded-lg px-3 py-2 text-sm font-semibold text-gray-400 hover:bg-white/5 hover:text-white transition-all duration-300"
                        activeProps={{ className: "text-white bg-white/5" }}
                      >
                        Contact
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {!isInRoom && (
                    <Link
                      to="/games"
                      className="inline-flex h-9 sm:h-10 items-center justify-center rounded-full bg-white px-4 sm:px-6 text-xs sm:text-sm font-bold text-black transition-transform duration-300 hover:scale-105 hover:bg-gray-200 shrink-0"
                    >
                      PLAY NOW
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </nav>

          {/* Nested route content */}
          <main className={`flex-1 w-full relative pt-16 sm:pt-20 ${!isInRoom ? "pb-24 sm:pb-0" : ""}`}>
            <Outlet />
          </main>

          {/* Global Footer on non-room pages */}
          {!isInRoom && <GlobalFooter />}

          {/* Cookie & AdSense Consent Banner */}
          <CookieBanner />

          {/* Native-Feel Mobile App Bottom Navigation Dock */}
          {!isInRoom && (
            <nav className="fixed bottom-0 left-0 right-0 z-50 sm:hidden border-t border-white/15 bg-black/90 backdrop-blur-2xl px-4 py-2 pb-safe shadow-[0_-4px_24px_rgba(0,0,0,0.7)]">
              <div className="flex items-center justify-around max-w-md mx-auto">
                <Link
                  to="/"
                  className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-colors ${
                    pathname === "/" ? "text-primary" : "text-gray-400 hover:text-white"
                  }`}
                >
                  <Home className="w-5 h-5" />
                  <span className="text-[10px] font-bold tracking-wider">Home</span>
                </Link>

                <Link
                  to="/games"
                  className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-colors ${
                    pathname.startsWith("/games") ? "text-primary" : "text-gray-400 hover:text-white"
                  }`}
                >
                  <Gamepad2 className="w-5 h-5" />
                  <span className="text-[10px] font-bold tracking-wider">Games</span>
                </Link>

                <a
                  href="/#categories"
                  className="flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-gray-400 hover:text-white transition-colors"
                >
                  <Layers className="w-5 h-5" />
                  <span className="text-[10px] font-bold tracking-wider">Themes</span>
                </a>

                <Link
                  to="/games"
                  className="flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-primary hover:text-white transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold shadow-[0_0_12px_var(--color-primary-glow)]">
                    <Sparkles className="w-4 h-4 fill-current" />
                  </div>
                  <span className="text-[10px] font-black tracking-wider text-primary">Play</span>
                </Link>
              </div>
            </nav>
          )}
        </div>
      </LogoProvider>
    </QueryClientProvider>
  );
}
