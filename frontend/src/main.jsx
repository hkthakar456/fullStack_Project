import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";

import App from "./App.jsx";
import "./index.css";

import { queryClient } from "./api/queryClient.js";
import AuthInitializer from "./features/auth/AuthInitializer.jsx";
import { setupInterceptors } from "./api/setupInterceptors.js";

import "./styles/global.css";

setupInterceptors();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthInitializer>
        <App />
      </AuthInitializer>
    </QueryClientProvider>
  </StrictMode>
);