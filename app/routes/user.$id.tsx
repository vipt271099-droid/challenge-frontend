import React from "react";
import { Link, useNavigate, useParams } from "react-router";
import { useUserWithTodos } from "../hooks/useUserWithTodos";
import { useThemeContext } from "~/theme/ThemeProvider";

type RouteParams = {
  id: string;
};

export default function UserDetail() {
  const { themeMode } = useThemeContext();
  const isDarkMode = themeMode === "dark";
  const { id } = useParams<RouteParams>();
  const navigate = useNavigate();
  const { user, todos: userTodos, loading, error } = useUserWithTodos(id);

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  const initials =
    user?.name
      ?.split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase() ?? "";

  const totalTodos = userTodos.length;
  const completedTodos = userTodos.filter((todo) => todo.completed).length;
  const pendingTodos = totalTodos - completedTodos;
  const bgColor = isDarkMode ? "bg-slate-800" : "bg-slate-200";
  const borderColor = isDarkMode ? "border-slate-700" : "border-slate-300";
  const textColor = isDarkMode ? "text-slate-400" : "text-slate-900";

  const bgColorSkeleton = isDarkMode ? "bg-slate-800" : "bg-slate-200";
  const borderColorSkeleton = isDarkMode
    ? "border-slate-700"
    : "border-slate-300";

  const bgColorCard = isDarkMode ? "bg-slate-900" : "bg-slate-100";
  const borderColorCard = isDarkMode ? "border-slate-700" : "border-slate-300";

  return (
    <div className={`min-h-screen ${bgColor} ${textColor}`}>
      <main className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-8">
        {/* Header / Back */}
        <header className="flex items-center justify-between">
          <button
            type="button"
            onClick={handleBack}
            className={`cursor-pointer inline-flex items-center gap-2 text-sm ${textColor} underline-offset-2 hover:text-blue-400 hover:underline`}
          >
            <span className="text-lg">←</span>
            <span>Back to Todos</span>
          </button>
        </header>

        {/* Loading state */}
        {loading && (
          <section
            className={`mt-2 rounded-2xl border ${borderColorSkeleton} ${bgColorSkeleton} px-6 py-6`}
          >
            <div className="flex items-center gap-4">
              <div
                className={`h-16 w-16 rounded-full ${bgColorSkeleton} animate-pulse`}
              />
              <div className="flex-1 space-y-2">
                <div
                  className={`h-4 w-40 rounded ${bgColorSkeleton} animate-pulse`}
                />
                <div
                  className={`h-3 w-24 rounded ${bgColorSkeleton} animate-pulse`}
                />
                <div
                  className={`h-3 w-16 rounded ${bgColorSkeleton} animate-pulse`}
                />
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <div
                className={`h-4 w-56 rounded ${bgColorSkeleton} animate-pulse`}
              />
              <div
                className={`h-4 w-44 rounded ${bgColorSkeleton} animate-pulse`}
              />
              <div
                className={`h-4 w-40 rounded ${bgColorSkeleton} animate-pulse`}
              />
            </div>
          </section>
        )}

        {/* Error state */}
        {!loading && error && (
          <section className="mt-2 space-y-4 rounded-2xl border border-red-500/40 bg-red-900/40 px-6 py-6 text-sm text-red-100">
            <p className="text-base font-medium">User not found</p>
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center gap-1 rounded-md border border-red-500/60 px-3 py-1.5 text-xs font-medium text-red-100 hover:border-red-400 hover:text-red-50"
            >
              ← Back to Todos
            </button>
          </section>
        )}

        {/* User content */}
        {!loading && !error && user && (
          <>
            {/* User Card */}
            <section
              className={`mt-2 rounded-2xl border ${borderColorCard} ${bgColorCard} px-6 py-6`}
            >
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <div
                  className={`flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-lg font-semibold ${textColor}`}
                >
                  {initials}
                </div>

                <div className="min-w-0">
                  <h1 className={`truncate text-xl font-semibold ${textColor}`}>
                    {user.name}
                  </h1>
                  <p className={`mt-1 text-sm ${textColor}`}>
                    @{user.username}
                  </p>
                  <span
                    className={`mt-2 inline-flex items-center rounded-full border ${borderColor} ${bgColor} px-3 py-0.5 text-xs ${textColor}`}
                  >
                    ID: {user.id}
                  </span>
                </div>
              </div>
            </section>

            {/* Todos Summary */}
            <section
              className={`rounded-2xl border ${borderColorCard} ${bgColorCard} px-6 py-5 text-sm`}
            >
              <h2
                className={`text-xs font-semibold uppercase tracking-wide ${textColor}`}
              >
                Todos Summary
              </h2>

              {totalTodos === 0 ? (
                <p className={`mt-3 text-xs ${textColor}`}>
                  This user has no todos.
                </p>
              ) : (
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className={`${textColor}`}>📋 Total</span>
                    <span className={`font-medium ${textColor}`}>
                      {totalTodos}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`${textColor}`}>⏳ Pending</span>
                    <span className={`font-medium ${textColor}`}>
                      {pendingTodos}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`${textColor}`}>✅ Completed</span>
                    <span className={`font-medium ${textColor}`}>
                      {completedTodos}
                    </span>
                  </div>
                </div>
              )}
            </section>

            {/* User information */}
            <section
              className={`space-y-3 rounded-2xl border ${borderColorCard} ${bgColorCard} px-6 py-6 text-sm`}
            >
              <h2
                className={`mb-2 text-xs font-semibold uppercase tracking-wide ${textColor}`}
              >
                Contact
              </h2>

              <div className="flex items-center gap-3">
                <span className="text-base">📧</span>
                <div>
                  <p className={`text-xs uppercase tracking-wide ${textColor}`}>
                    Email
                  </p>
                  <a
                    href={`mailto:${user.email}`}
                    className="text-sm text-blue-400 hover:underline"
                  >
                    {user.email}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-base">📞</span>
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500">
                    Phone
                  </p>
                  <a
                    href={`tel:${user.phone}`}
                    className="text-sm text-blue-400 hover:underline"
                  >
                    {user.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-base">🌐</span>
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500">
                    Website
                  </p>
                  <a
                    href={`https://${user.website}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-blue-400 hover:underline"
                  >
                    {user.website}
                  </a>
                </div>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
