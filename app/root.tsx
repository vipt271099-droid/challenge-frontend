import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
import "./app.css";
import ThemeProvider from "./theme/ThemeProvider";
import { useThemeContext } from "./theme/ThemeProvider";
import QueryClientProvider from "./QueryClientProvider";
import { SunIcon, MoonIcon } from "./svg";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

function AppShell() {
  const { themeMode, toggleTheme } = useThemeContext();
  const isDarkMode = themeMode === "dark";
  const bgColor = isDarkMode ? "bg-slate-900" : "bg-slate-100";
  const textColor = isDarkMode ? "text-slate-50" : "text-slate-900";

  return (
    <div className={`min-h-screen ${bgColor} ${textColor}`}>
      {/* Global header with theme toggle, visible on every page */}
      <header className="sticky top-0 z-30 border-b border-slate-700/40 bg-slate-900/80 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            Todo Demo
          </span>
          <button
            type="button"
            onClick={toggleTheme}
            className="cursor-pointer inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-500 bg-slate-800 text-slate-100 text-sm shadow-sm transition hover:border-blue-500 hover:text-blue-400"
            aria-label="Toggle theme"
          >
            {isDarkMode ? <SunIcon /> : <MoonIcon />}
          </button>
        </div>
      </header>
      <Outlet />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider>
      <ThemeProvider>
        <AppShell />
      </ThemeProvider>
      <ToastContainer />
    </QueryClientProvider>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>

      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
