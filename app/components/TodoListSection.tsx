import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import type { Todo, User } from "../welcome/types";
import TodoItem from "./TodoItem";
import DeleteTodoModal from "./DeleteTodoModal";
import { useThemeContext } from "~/theme/ThemeProvider";
import { toast } from "react-toastify";
import NotifySuccess from "~/common/NotifySuccess";

interface TodoListSectionProps {
  todos: Todo[];
  users: Record<number, User>;
  isInitialLoading: boolean;
  error: string | null;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onToggleTodo: (id: number) => void;
  onDeleteTodo: (id: number) => void;
}

const TodoListSection: React.FC<TodoListSectionProps> = ({
  todos,
  users,
  isInitialLoading,
  error,
  page,
  totalPages,
  onPageChange,
  onToggleTodo,
  onDeleteTodo,
}) => {
  const { themeMode } = useThemeContext();
  const isDarkMode = themeMode === "dark";
  const bgColor = isDarkMode ? "bg-slate-800" : "bg-slate-200";
  const borderColor = isDarkMode ? "border-slate-700" : "border-slate-300";
  const textColor = isDarkMode ? "text-slate-400" : "text-slate-900";
  const disabledColor = isDarkMode
    ? "disabled:border-slate-800 disabled:text-slate-600"
    : "disabled:border-slate-200 disabled:text-slate-400";
  const navigate = useNavigate();
  const [todoToDelete, setTodoToDelete] = useState<Todo | null>(null);

  const openDeleteConfirm = (todo: Todo) => {
    setTodoToDelete(todo);
  };

  const closeDeleteConfirm = () => {
    setTodoToDelete(null);
  };

  const handleConfirmDelete = () => {
    if (todoToDelete) {
      onDeleteTodo(todoToDelete.id);
      setTodoToDelete(null);
      NotifySuccess("Todo deleted successfully");
    }
  };

  const bgColorSkeleton = isDarkMode ? "bg-slate-800" : "bg-slate-200";
  const borderColorSkeleton = isDarkMode
    ? "border-slate-700"
    : "border-slate-300";
  const textColorSkeleton = isDarkMode ? "text-slate-400" : "text-slate-900";

  return (
    <main className="flex flex-1 flex-col gap-4 px-4">
      {/* Error banner */}
      {error && (
        <div className="rounded-md border border-red-500/40 bg-red-950/40 px-4 py-2 text-sm text-red-200">
          Error: {error}
        </div>
      )}

      {/* Todo list */}
      <div className="max-h-[520px] space-y-2 overflow-y-auto pr-1">
        {isInitialLoading ? (
          // Skeleton loading state
          Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="animate-pulse rounded-lg border border-slate-700 bg-slate-800 px-4 py-3"
            >
              <div className="mb-2 flex items-center gap-3">
                <div className="h-5 w-5 rounded border border-slate-600 bg-slate-700" />
                <div className="h-4 flex-1 rounded bg-slate-700" />
              </div>
              <div className="flex items-center justify-between">
                <div className="h-3 w-32 rounded bg-slate-700" />
                <div className="h-3 w-20 rounded bg-slate-700" />
              </div>
            </div>
          ))
        ) : todos.length === 0 ? (
          // Empty state
          <div
            className={`flex flex-col items-center justify-center rounded-xl border border-dashed ${borderColorSkeleton} ${bgColorSkeleton} px-6 py-10 text-center text-sm ${textColorSkeleton}`}
          >
            <div className="mb-3 text-3xl">📭</div>
            <p className="font-medium">No todos found</p>
            <p className="mt-1 text-xs text-slate-500">
              Try adjusting filters or search.
            </p>
          </div>
        ) : (
          todos.map((todo) => {
            const user = users[todo.userId];

            return (
              <TodoItem
                key={todo.id}
                todo={todo}
                user={user}
                onToggle={() => onToggleTodo(todo.id)}
                onDelete={() => openDeleteConfirm(todo)}
                onUserClick={() => {
                  if (user?.id) {
                    navigate(`/users/${user.id}`);
                  }
                }}
              />
            );
          })
        )}
      </div>

      {/* Delete confirmation modal */}
      {todoToDelete && (
        <DeleteTodoModal
          todoTitle={todoToDelete.title}
          onCancel={closeDeleteConfirm}
          onConfirm={handleConfirmDelete}
        />
      )}

      {/* Pagination */}
      <div
        className={`flex items-center justify-center gap-4 border-t ${borderColor} pt-3 text-xs ${textColor}`}
      >
        <button
          type="button"
          disabled={page === 1}
          onClick={() => onPageChange(Math.max(page - 1, 1))}
          className={`cursor-pointer inline-flex items-center gap-1 rounded-md border ${borderColor} ${bgColor} px-3 py-1.5 text-xs font-medium transition hover:border-blue-500 hover:text-blue-400 disabled:cursor-not-allowed ${disabledColor}`}
        >
          ← Previous
        </button>

        <span className="text-[11px] text-slate-400">
          Page <span className={`font-semibold ${textColor}`}>{page}</span> of{" "}
          <span className={`font-semibold ${textColor}`}>{totalPages}</span>
        </span>

        <button
          type="button"
          disabled={page === totalPages}
          onClick={() => onPageChange(Math.min(page + 1, totalPages))}
          className={`cursor-pointer inline-flex items-center gap-1 rounded-md border ${borderColor} ${bgColor} px-3 py-1.5 text-xs font-medium transition hover:border-blue-500 hover:text-blue-400 disabled:cursor-not-allowed ${disabledColor}`}
        >
          Next →
        </button>
      </div>
    </main>
  );
};

export default TodoListSection;
