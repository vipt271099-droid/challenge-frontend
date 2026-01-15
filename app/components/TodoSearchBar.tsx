import React from "react";
import type { User } from "../welcome/types";
import { useThemeContext } from "~/theme/ThemeProvider";

interface TodoSearchBarProps {
  filterText: string;
  onFilterTextChange: (value: string) => void;
  sortBy: "id" | "title";
  onSortByChange: (value: "id" | "title") => void;
  selectedUser: number | null;
  onSelectedUserChange: (value: number | null) => void;
  users: Record<number, User>;
}

const TodoSearchBar: React.FC<TodoSearchBarProps> = ({
  filterText,
  onFilterTextChange,
  sortBy,
  onSortByChange,
  selectedUser,
  onSelectedUserChange,
  users,
}) => {
  const { themeMode } = useThemeContext();
  const bgColor = themeMode === "dark" ? "bg-slate-800" : "bg-slate-200";
  const borderColor =
    themeMode === "dark" ? "border-slate-700" : "border-slate-300";
  const textColor = themeMode === "dark" ? "text-slate-400" : "text-slate-900";
  return (
    <header
      className={`sticky top-0 z-10 rounded-b-xl border-b ${borderColor} ${bgColor} px-4 py-3 backdrop-blur`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-1 items-center gap-2">
          {/* Search */}
          <div className="relative flex-1">
            <span
              className={`pointer-events-none absolute inset-y-0 left-3 flex items-center text-xs ${textColor}`}
            >
              🔍
            </span>
            <input
              type="text"
              placeholder="Search todos..."
              value={filterText}
              onChange={(e) => onFilterTextChange(e.target.value)}
              className={`h-10 w-full rounded-md border ${borderColor} ${bgColor} pl-8 pr-3 text-sm ${textColor} placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/60`}
            />
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value as "id" | "title")}
            className={`h-10 rounded-md border ${borderColor} ${bgColor} px-3 text-sm ${textColor} focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/60`}
          >
            <option value="id">Sort by ID</option>
            <option value="title">Sort by Title</option>
          </select>

          {/* User Filter */}
          <select
            value={selectedUser ?? ""}
            onChange={(e) =>
              onSelectedUserChange(
                e.target.value ? Number(e.target.value) : null
              )
            }
            className={`h-10 min-w-[150px] rounded-md border ${borderColor} ${bgColor} px-3 text-sm ${textColor} focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/60`}
          >
            <option value="">All Users</option>
            {Object.values(users).map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </header>
  );
};

export default TodoSearchBar;
