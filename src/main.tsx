import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { AIServiceProvider } from "./contexts/AIServiceContext";
import { AuthProvider } from "./contexts/AuthContext";

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <AIServiceProvider>
      <App />
    </AIServiceProvider>
  </AuthProvider>
);
