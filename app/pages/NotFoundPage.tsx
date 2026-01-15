import React from "react";
import { Link } from "react-router";
import { useThemeContext } from "~/theme/ThemeProvider";

const NotFoundPage: React.FC = () => {
  const { themeMode } = useThemeContext();
  const bgColor = themeMode === "dark" ? "bg-slate-800" : "bg-slate-200";
  const borderColor =
    themeMode === "dark" ? "border-slate-700" : "border-slate-300";
  const textColor = themeMode === "dark" ? "text-slate-400" : "text-slate-900";
  return (
    <div
      className={`flex min-h-screen items-center justify-center ${bgColor} px-4 ${textColor}`}
    >
      <div
        className={`w-full max-w-md rounded-2xl border ${borderColor} ${bgColor} px-6 py-8 text-center shadow-xl`}
      >
        <p
          className={`text-xs font-semibold uppercase tracking-[0.25em] ${textColor}`}
        >
          Error 404
        </p>
        <h1 className={`mt-3 text-xl font-semibold ${textColor}`}>
          Page not found
        </h1>
        <p className={`mt-2 text-sm ${textColor}`}>
          The page you are looking for doesn&apos;t exist or has been moved.
        </p>

        <div className="mt-6 flex justify-center">
          <Link
            to="/"
            className={`inline-flex items-center gap-2 rounded-md border ${borderColor} ${bgColor} px-4 py-2 text-xs font-medium ${textColor} hover:border-blue-500 hover:text-blue-400`}
          >
            <span className="text-sm">←</span>
            <span>Back to Todos</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
