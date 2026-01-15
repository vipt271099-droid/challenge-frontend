import React from "react";
import { useThemeContext } from "~/theme/ThemeProvider";

interface TodoStatsBarProps {
  completedCount: number;
  totalCount: number;
  userCount: number;
}

interface StatsCardProps {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}

const StatsCard: React.FC<StatsCardProps> = ({ icon, label, children }) => {
  const { themeMode } = useThemeContext();
  const isDarkMode = themeMode === "dark";
  const bgColor = isDarkMode ? "bg-slate-800" : "bg-slate-200";
  const borderColor = isDarkMode ? "border-slate-700" : "border-slate-300";
  const textColor = isDarkMode ? "text-slate-400" : "text-slate-900";
  return (
    <div
      className={`flex items-center gap-2 rounded-lg border px-4 py-3 text-sm ${borderColor} ${bgColor}`}
    >
      {icon}
      <div>
        <p className={`text-xs uppercase tracking-wide ${textColor}`}>
          {label}
        </p>
        <p className="text-sm font-medium">{children}</p>
      </div>
    </div>
  );
};

const TodoStatsBar: React.FC<TodoStatsBarProps> = ({
  completedCount,
  totalCount,
  userCount,
}) => {
  return (
    <section className="px-4">
      <div className="flex flex-wrap gap-3">
        <StatsCard
          icon={<span className="text-green-400">✔</span>}
          label="Completed"
        >
          <>
            {completedCount}{" "}
            <span className="text-slate-400">/ {totalCount}</span>
          </>
        </StatsCard>

        <StatsCard
          icon={<span className="text-blue-400">📋</span>}
          label="Total"
        >
          {totalCount}
        </StatsCard>

        <StatsCard
          icon={<span className="text-slate-300">👤</span>}
          label="Users"
        >
          {userCount}
        </StatsCard>
      </div>
    </section>
  );
};

export default TodoStatsBar;
