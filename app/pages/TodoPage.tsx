import React from "react";
import TodoList from "../welcome/welcome";

// Route-level page component for the main todo experience.
// This keeps the route files thin and matches the proposed /pages structure.
export default function TodoPage() {
  return <TodoList />;
}
