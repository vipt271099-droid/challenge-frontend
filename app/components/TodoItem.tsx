import React from "react";
import type { Todo, User } from "../welcome/types";
import UserBadge from "./UserBadge";
import { useThemeContext } from "~/theme/ThemeProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTrash } from "@fortawesome/free-solid-svg-icons";

interface TodoItemProps {
  todo: Todo;
  user?: User;
  onToggle: () => void;
  onDelete: () => void;
  onUserClick?: () => void;
}

const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  user,
  onToggle,
  onDelete,
  onUserClick,
}) => {
  const isCompleted = todo.completed;
  const { themeMode } = useThemeContext();
  const isDarkMode = themeMode === "dark";
  const baseBg = isDarkMode ? "bg-slate-800" : "bg-slate-200";
  const completedBg = isDarkMode ? "bg-teal-900/40" : "bg-emerald-100";
  const baseBorder = isDarkMode ? "border-slate-700" : "border-slate-300";
  const completedBorder = isDarkMode ? "border-teal-500" : "border-emerald-300";
  const baseText = isDarkMode ? "text-slate-200" : "text-slate-900";
  const completedText = isDarkMode ? "text-teal-100" : "text-emerald-800";

  const hoverBg = isDarkMode
    ? "hover:bg-slate-700/80"
    : "hover:bg-slate-200/80";
  const hoverShadow = isDarkMode
    ? "hover:shadow-[0_4px_12px_rgba(0,0,0,0.25)]"
    : "hover:shadow-[0_4px_12px_rgba(0,0,0,0.25)]";

  const isCompletedBg = isCompleted
    ? `${completedBorder} ${completedBg}`
    : `${baseBorder} ${baseBg} ${hoverBg} ${hoverShadow}`;

  const isCompletedIconColor = isDarkMode
    ? "text-green-400"
    : "text-emerald-800";

  const deleteIconColor = isDarkMode ? "text-slate-400" : "text-slate-500";
  return (
    <article
      className={`group relative cursor-pointer rounded-lg border px-4 py-3 text-sm shadow-sm transition
        ${
          isCompleted
            ? `${completedBorder} ${completedBg}`
            : `${baseBorder} ${baseBg} ${hoverBg} ${hoverShadow}`
        }`}
      onClick={onToggle}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
          className={`mt-1 flex h-5 w-5 items-center justify-center rounded border text-[10px] transition
            ${
              isCompleted
                ? `${completedBorder} ${isCompletedBg} ${isCompletedIconColor}`
                : `${baseBorder} ${baseBg} text-slate-400 ${hoverBg} group-hover:border-blue-400 group-hover:text-blue-300`
            }`}
          aria-pressed={isCompleted}
          aria-label={
            isCompleted ? "Mark todo as incomplete" : "Mark todo as completed"
          }
        >
          {isCompleted && <FontAwesomeIcon icon={faCheck} />}
        </button>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <h3
            className={`text-sm font-medium ${
              isCompleted ? `${completedText} line-through` : `${baseText}`
            }`}
          >
            {todo.title}
          </h3>

          <UserBadge user={user} onClick={onUserClick} />
        </div>

        {/* Delete icon (show on hover) */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className={`cursor-pointer ml-2 hidden ${
            deleteIconColor
          } transition hover:text-red-400 group-hover:inline-flex`}
          aria-label="Delete todo"
        >
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </div>

      <div
        className={`mt-2 flex items-center justify-between text-[11px] ${
          isCompleted ? completedText : baseText
        }`}
      >
        {/* <span className="capitalize">
          {isCompleted ? "Completed" : "Incomplete"}
        </span> */}
      </div>
    </article>
  );
};

export default TodoItem;
