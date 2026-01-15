import React from "react";
import { useThemeContext } from "~/theme/ThemeProvider";

interface DeleteTodoModalProps {
  todoTitle: string;
  onCancel: () => void;
  onConfirm: () => void;
}

const DeleteTodoModal: React.FC<DeleteTodoModalProps> = ({
  todoTitle,
  onCancel,
  onConfirm,
}) => {
  const { themeMode } = useThemeContext();
  const bgColor = themeMode === "dark" ? "bg-slate-800" : "bg-slate-200";
  const borderColor =
    themeMode === "dark" ? "border-slate-700" : "border-slate-300";
  const textColor = themeMode === "dark" ? "text-slate-400" : "text-slate-900";
  return (
    <div
      className={`fixed inset-0 z-20 flex items-center justify-center bg-slate-950/60 px-4`}
    >
      <div
        className={`w-full max-w-sm rounded-xl border ${borderColor} ${bgColor} px-5 py-4 text-sm shadow-xl`}
        role="dialog"
        aria-modal="true"
      >
        <h2 className={`text-sm font-semibold ${textColor}`}>Delete todo?</h2>
        <p className={`mt-2 text-xs ${textColor}`}>
          Are you sure you want to delete this todo?
        </p>
        <p className={`mt-2 line-clamp-2 text-xs ${textColor} font-bold`}>
          ({todoTitle})
        </p>

        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className={`inline-flex items-center rounded-md border ${borderColor} ${bgColor} px-3 py-1.5 text-xs font-medium ${textColor} hover:border-slate-500`}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="inline-flex items-center rounded-md border border-red-600 bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-500"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteTodoModal;
