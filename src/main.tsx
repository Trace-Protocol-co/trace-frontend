import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router"; // Ensure this matches your react-router version
import { router } from "./app/routes.tsx";
import "./styles/index.css";

createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />
);
