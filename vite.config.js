import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [react()],
  server: {
    port: 5173,
    host: "0.0.0.0",
  },
  build: {
    // Modern browsers only — smaller output, no legacy transforms.
    target: "es2020",
    minify: "esbuild",
    cssCodeSplit: true,
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: {
        // Keep long-lived dependencies in their own cacheable chunks so a
        // change to app code doesn't invalidate the (large) React runtime,
        // and route chunks don't each re-bundle these shared libs.
        manualChunks: {
          "react-vendor": ["react", "react-dom", "react-router-dom"],
          icons: ["lucide-react"],
          toast: ["react-hot-toast"],
          http: ["axios"],
        },
      },
    },
  },
  // Strip console/debugger from production builds only (keep them in dev).
  esbuild: command === "build" ? { drop: ["console", "debugger"] } : {},
}));
