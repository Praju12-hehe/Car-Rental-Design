import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

export default defineConfig({
  base: "/",

  plugins: [
    react(),
    tailwindcss(),
    runtimeErrorOverlay(),
  ],

  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
      "@assets": path.resolve(import.meta.dirname, "..", "..", "attached_assets"),
    },
    dedupe: ["react", "react-dom"],
  },

  root: path.resolve(import.meta.dirname),

  build: {
    outDir: path.resolve(import.meta.dirname, "../../.vercel/output/static"),
    emptyOutDir: true,
    chunkSizeWarningLimit: 1000,
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("recharts") || id.includes("framer-motion")) {
              return "charts-and-motion";
            }

            return "vendor";
          }
        },
      },
    },
  },

  server: {
    port: 3000,
    host: "0.0.0.0",
    strictPort: false, // 🛠️ Changed from true to false
  },

  preview: {
    port: 3000,
    host: "0.0.0.0",
  },
});