import React, { useState, useEffect } from "react";
import { TodoListSection, TodoStatsBar, TodoSearchBar } from "../components";
import { usePersistedTodos } from "../hooks/usePersistedTodos";
import { useTodoStats } from "../hooks/useTodoStats";
import { useThemeContext } from "~/theme/ThemeProvider";
import { useNavigate } from "react-router";

const PAGE_SIZE = 10;

const TodoList: React.FC<{ showCompleted?: boolean }> = ({
  showCompleted = false,
}) => {
  const navigate = useNavigate();
  const { todos, users, loading, error, toggleTodo, deleteTodo } =
    usePersistedTodos();
  const { themeMode } = useThemeContext();
  const [filterText, setFilterText] = useState("");
  const [debouncedFilterText, setDebouncedFilterText] = useState("");
  const [sortBy, setSortBy] = useState<"id" | "title">("id");
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Debounce filter text for better UX
  useEffect(() => {
    const handle = setTimeout(() => {
      setDebouncedFilterText(filterText);
    }, 300);

    return () => clearTimeout(handle);
  }, [filterText]);

  // Reset to first page when filters change
  useEffect(() => {
    setPage(1);
  }, [filterText, selectedUser, showCompleted]);

  // Recalculate total pages whenever data or filters change
  useEffect(() => {
    const filtered = todos.filter((todo) => {
      if (showCompleted && !todo.completed) return false;
      if (
        debouncedFilterText &&
        !todo.title.toLowerCase().includes(debouncedFilterText.toLowerCase())
      ) {
        return false;
      }
      if (selectedUser && todo.userId !== selectedUser) return false;
      return true;
    });

    const total = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    setTotalPages(total);

    if (page > total) {
      setPage(total);
    }
  }, [todos, debouncedFilterText, selectedUser, showCompleted, page]);

  const filteredTodos = todos.filter((todo) => {
    if (showCompleted && !todo.completed) return false;
    if (
      debouncedFilterText &&
      !todo.title.toLowerCase().includes(debouncedFilterText.toLowerCase())
    ) {
      return false;
    }
    if (selectedUser && todo.userId !== selectedUser) return false;
    return true;
  });

  const sortedTodos = [...filteredTodos].sort((a, b) => {
    if (sortBy === "title") {
      return a.title.localeCompare(b.title);
    }
    return a.id - b.id;
  });

  const paginatedTodos = sortedTodos.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  const stats = useTodoStats(todos);

  const isInitialLoading = loading && todos.length === 0;

  const completedCount = stats.completed;
  const totalCount = stats.total;
  const userCount = stats.userCount;
  const textColor = themeMode === "dark" ? "text-slate-400" : "text-slate-900";

  return (
    <div
      className={`min-h-screen ${
        themeMode === "dark"
          ? "bg-slate-900 text-slate-50"
          : "bg-slate-100 text-slate-900"
      }`}
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-4 py-6">
        <button
          type="button"
          onClick={() => navigate("/")}
          className={`cursor-pointer inline-flex items-center gap-2 text-sm ${textColor} underline-offset-2 hover:text-blue-400 hover:underline`}
        >
          <span className="text-lg">←</span>
          <span>Back to Home</span>
        </button>
        {/* Top Bar / Search */}
        <TodoSearchBar
          filterText={filterText}
          onFilterTextChange={setFilterText}
          sortBy={sortBy}
          onSortByChange={setSortBy}
          selectedUser={selectedUser}
          onSelectedUserChange={setSelectedUser}
          users={users}
        />

        {/* Stats Bar */}
        <TodoStatsBar
          completedCount={completedCount}
          totalCount={totalCount}
          userCount={userCount}
        />

        {/* List + Pagination */}
        <TodoListSection
          todos={paginatedTodos}
          users={users}
          isInitialLoading={isInitialLoading}
          error={error}
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
          onToggleTodo={toggleTodo}
          onDeleteTodo={deleteTodo}
        />
      </div>
    </div>
  );
};

export default TodoList;
