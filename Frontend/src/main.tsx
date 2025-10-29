import "./index.css";
import "./App.css";
import "./i18n"; 

import { createRoot } from "react-dom/client";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(<App />);
