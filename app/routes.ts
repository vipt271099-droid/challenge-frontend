import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  // Welcome page at "/"
  index("routes/welcome.tsx"),

  // Todo list page at "/todos"
  route("todos", "routes/todo.tsx"),

  // User detail page at "/users/:id"
  route("users/:id", "routes/user.$id.tsx"),

  // Catch-all 404 route -> similar to path: "*" in createBrowserRouter
  route("*", "routes/not-found.tsx"),
] satisfies RouteConfig;
