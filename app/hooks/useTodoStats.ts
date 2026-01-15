import { useMemo } from "react";
import type { Todo } from "~/welcome/types";

interface TodoStats {
  completed: number;
  userCount: number;
  total: number;
}

export function useTodoStats(todos: Todo[]) {
  return useMemo(() => {
    const completed = todos.filter((t) => t.completed).length;
    const userCount = new Set(todos.map((t) => t.userId)).size;
    return { completed, userCount, total: todos.length };
  }, [todos]);
}
