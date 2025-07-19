import { createRoot } from "react-dom/client";

import App from "./App.jsx";
import { AuthProvider } from "./providers/index.js";

createRoot(document.getElementById("root")!).render(
    <AuthProvider>
      <App />
    </AuthProvider>
);
