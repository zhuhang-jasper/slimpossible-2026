import React from "react";
import ReactDOM from "react-dom/client";

import i18n from "./i18n/index.js";
import { initAnalytics } from "./utils/analytics.js";
import App from "./App.jsx";

import "./index.css";

initAnalytics();

// Reflect the active language on <html lang> for a11y / correct hyphenation.
document.documentElement.lang = i18n.resolvedLanguage || "en";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
