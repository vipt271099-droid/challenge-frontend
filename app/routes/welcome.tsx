import React from "react";
import { Link } from "react-router";
import type { Route } from "./+types/welcome";
import { useThemeContext } from "~/theme/ThemeProvider";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Welcome • Todo Demo" },
    {
      name: "description",
      content: "Welcome page for the Todo demo application.",
    },
  ];
}

export default function WelcomeRoute() {
  const { themeMode } = useThemeContext();
  const bgColor = themeMode === "dark" ? "bg-slate-800" : "bg-slate-200";
  const borderColor =
    themeMode === "dark" ? "border-slate-700" : "border-slate-300";
  const textColor = themeMode === "dark" ? "text-slate-400" : "text-slate-900";
  const bgCardColor = themeMode === "dark" ? "bg-slate-900" : "bg-slate-100";

  return (
    <main
      className={`flex min-h-screen items-center justify-center ${bgColor} px-4 ${textColor}`}
    >
      <div
        className={`w-full max-w-xl rounded-2xl border ${borderColor} ${bgCardColor} px-8 py-10 shadow-xl`}
      >
        <p
          className={`text-xs font-semibold uppercase tracking-[0.25em] ${textColor}`}
        >
          Todo Demo
        </p>
        <h1 className={`mt-4 text-2xl font-semibold ${textColor}`}>
          Welcome to your Todo dashboard
        </h1>
        <p className={`mt-3 text-sm ${textColor}`}>
          Explore a production-style todo list with filters, stats, user
          details, and persisted state. Click below to open the todo list.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/todos"
            className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-xs font-medium text-white shadow hover:bg-blue-500"
          >
            <span>Go to Todo List</span>
            <span className="text-sm">→</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
