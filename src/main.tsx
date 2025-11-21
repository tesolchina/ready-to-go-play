import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { AIServiceProvider } from "./contexts/AIServiceContext";

createRoot(document.getElementById("root")!).render(
  <AIServiceProvider>
    <App />
  </AIServiceProvider>
);
