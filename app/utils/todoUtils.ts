import type { Todo } from "../welcome/types";

const DB_NAME = "todoApp";
const DB_VERSION = 1;
const TODO_STORE = "todos";
const TODO_USER_INDEX = "userId";

function isBrowserEnvironment() {
  return typeof window !== "undefined" && "indexedDB" in window;
}

function openDb(): Promise<IDBDatabase | null> {
  if (!isBrowserEnvironment()) return Promise.resolve(null);

  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      reject(request.error);
    };

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(TODO_STORE)) {
        const store = db.createObjectStore(TODO_STORE, { keyPath: "id" });
        store.createIndex(TODO_USER_INDEX, "userId", { unique: false });
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };
  });
}

function txDone(tx: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onabort = () => reject(tx.error);
    tx.onerror = () => reject(tx.error);
  });
}

export async function saveTodosToDb(todos: Todo[]): Promise<void> {
  const db = await openDb();
  if (!db) return;

  const tx = db.transaction(TODO_STORE, "readwrite");
  const store = tx.objectStore(TODO_STORE);

  todos.forEach((todo) => {
    store.put(todo);
  });

  await txDone(tx);
  db.close();
}

export async function upsertTodoInDb(todo: Todo): Promise<void> {
  const db = await openDb();
  if (!db) return;

  const tx = db.transaction(TODO_STORE, "readwrite");
  const store = tx.objectStore(TODO_STORE);

  store.put(todo);

  await txDone(tx);
  db.close();
}

export async function deleteTodoFromDb(id: number): Promise<void> {
  const db = await openDb();
  if (!db) return;

  const tx = db.transaction(TODO_STORE, "readwrite");
  const store = tx.objectStore(TODO_STORE);

  store.delete(id);

  await txDone(tx);
  db.close();
}

export async function getTodosFromDb(): Promise<Todo[]> {
  const db = await openDb();
  if (!db) return [];

  const tx = db.transaction(TODO_STORE, "readonly");
  const store = tx.objectStore(TODO_STORE);
  const request = store.getAll();

  const todos = await new Promise<Todo[]>((resolve, reject) => {
    request.onsuccess = () => resolve(request.result ?? []);
    request.onerror = () => reject(request.error);
  });

  db.close();
  return todos;
}

export async function getTodosByUserFromDb(userId: number): Promise<Todo[]> {
  const db = await openDb();
  if (!db) return [];

  const tx = db.transaction(TODO_STORE, "readonly");
  const store = tx.objectStore(TODO_STORE);

  let request: IDBRequest<Todo[]>;

  if (store.indexNames.contains(TODO_USER_INDEX)) {
    const index = store.index(TODO_USER_INDEX);
    request = index.getAll(IDBKeyRange.only(userId));
  } else {
    // Fallback if index is missing for any reason
    request = store.getAll() as IDBRequest<Todo[]>;
  }

  const todos = await new Promise<Todo[]>((resolve, reject) => {
    request.onsuccess = () => {
      const result = request.result ?? [];
      if (!store.indexNames.contains(TODO_USER_INDEX) && result.length) {
        resolve(result.filter((t) => t.userId === userId));
      } else {
        resolve(result);
      }
    };
    request.onerror = () => reject(request.error);
  });

  db.close();
  return todos;
}
