import { useQuery, useQueryClient } from "react-query";
import axios from "axios";
import { getTodosByUserFromDb, saveTodosToDb } from "../utils/todoUtils";

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
}

export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

interface UseUserWithTodosResult {
  user: User | null;
  todos: Todo[];
  loading: boolean;
  error: string | null;
}

export function useUserWithTodos(
  userIdParam: string | undefined
): UseUserWithTodosResult {
  // Validate and parse user ID once
  const numericId =
    userIdParam && !Number.isNaN(Number(userIdParam))
      ? Number(userIdParam)
      : null;

  // If the param is missing or invalid, surface a consistent error shape
  const baseError =
    userIdParam === undefined || numericId === null ? "User not found" : null;

  const queryClient = useQueryClient();

  const {
    data: user,
    isLoading: userLoading,
    error: userError,
  } = useQuery<User, Error>(
    ["user", numericId],
    async () => {
      const response = await axios.get<User>(
        `https://jsonplaceholder.typicode.com/users/${numericId}`
      );
      const data = response.data;
      if (!data || !data.id) {
        throw new Error("User not found");
      }
      return data;
    },
    {
      enabled: numericId !== null,
    }
  );

  const { data: userTodos = [], isLoading: todosLoading } = useQuery<Todo[]>(
    ["userTodos", numericId],
    async () => {
      if (numericId === null) return [];

      // 1) Reuse todos from queryClient
      const allTodos = queryClient.getQueryData<Todo[]>(["todos"]);
      if (allTodos && allTodos.length > 0) {
        const filtered = allTodos.filter((t) => t.userId === numericId);
        if (filtered.length > 0) {
          return filtered;
        }
      }

      // 2) Fallback: try to get from IndexedDB by user
      const cachedTodos = await getTodosByUserFromDb(numericId);
      if (cachedTodos.length > 0) {
        return cachedTodos;
      }

      // 3) Finally, call API by userId
      const todosResponse = await axios.get<Todo[]>(
        "https://jsonplaceholder.typicode.com/todos",
        {
          params: { userId: numericId },
        }
      );
      const fetchedTodos = todosResponse.data ?? [];

      saveTodosToDb(fetchedTodos).catch(() => {
        // Ignore IndexedDB errors
      });

      return fetchedTodos;
    },
    {
      enabled: numericId !== null,
    }
  );

  const loading = !!numericId && (userLoading || todosLoading);
  const error: string | null =
    baseError ?? (userError ? "User not found" : null);

  return { user: user ?? null, todos: userTodos, loading, error };
}
