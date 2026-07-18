import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter as Router } from "react-router-dom";
import { Toaster } from "react-hot-toast";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router>
      <App />
      <Toaster />
    </Router>
  </React.StrictMode>
);

// Fade out the page-load splash (index.html) once React has painted. A short
// minimum keeps it from flashing on fast loads; the CSS transition + removal
// then hand the screen to the app.
(function hideSplash() {
  const splash = document.getElementById("csa-splash");
  if (!splash) return;
  const MIN_MS = 550; // minimum visible time since navigation start
  const reveal = () => {
    // performance.now() is ms since navigation start.
    const wait = Math.max(0, MIN_MS - performance.now());
    setTimeout(() => {
      splash.classList.add("csa-splash--hide");
      setTimeout(() => splash.remove(), 600);
    }, wait);
  };
  // Wait for the first paint (two RAFs) so the app is on screen behind it.
  requestAnimationFrame(() => requestAnimationFrame(reveal));
})();
