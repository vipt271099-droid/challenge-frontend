import { useQuery, useQueryClient } from "react-query";
import axios from "axios";
import type { Todo, User } from "../welcome/types";
import {
  deleteTodoFromDb,
  getTodosFromDb,
  saveTodosToDb,
  upsertTodoInDb,
} from "../utils/todoUtils";

interface UsePersistedTodosResult {
  todos: Todo[];
  users: Record<number, User>;
  loading: boolean;
  error: string | null;
  toggleTodo: (id: number) => void;
  deleteTodo: (id: number) => void;
}

export function usePersistedTodos(): UsePersistedTodosResult {
  const queryClient = useQueryClient();

  // Todos query: hydrate from IndexedDB first, then fall back to remote
  const {
    data: todos = [],
    isLoading: todosLoading,
    error: todosError,
  } = useQuery<Todo[], Error>(
    ["todos"],
    async () => {
      // Try to hydrate from IndexedDB first to keep local state in sync
      const cached = await getTodosFromDb();
      if (cached.length > 0) {
        return cached;
      }

      // Fallback to remote fetch if no cached data
      const response = await axios.get<Todo[]>(
        "https://jsonplaceholder.typicode.com/todos"
      );

      const fetched = response.data ?? [];

      // Persist fetched data for future sessions
      saveTodosToDb(fetched).catch(() => {
        // Ignore IndexedDB errors silently
      });

      return fetched;
    },
    {
      staleTime: 0,
    }
  );

  // Users query
  const { data: users = {}, isLoading: usersLoading } = useQuery<
    Record<number, User>
  >(
    ["users"],
    async () => {
      const response = await axios.get<User[]>(
        "https://jsonplaceholder.typicode.com/users"
      );
      const userMap: Record<number, User> = {};
      (response.data ?? []).forEach((user: User) => {
        userMap[user.id] = user;
      });
      return userMap;
    },
    {
      staleTime: 0,
    }
  );

  const loading = todosLoading || usersLoading;
  const error = todosError ? "Failed to fetch todos" : null;

  const toggleTodo = (id: number) => {
    queryClient.setQueryData<Todo[]>(["todos"], (prev = []) => {
      const updated = prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      );

      const changed = updated.find((t) => t.id === id);
      if (changed) {
        upsertTodoInDb(changed).catch(() => {
          // Ignore IndexedDB errors
        });
      }

      return updated;
    });
  };

  const deleteTodo = (id: number) => {
    queryClient.setQueryData<Todo[]>(["todos"], (prev = []) =>
      prev.filter((todo) => todo.id !== id)
    );
    deleteTodoFromDb(id).catch(() => {
      // Ignore IndexedDB errors
    });
  };

  return {
    todos,
    users,
    loading,
    error,
    toggleTodo,
    deleteTodo,
  };
}
