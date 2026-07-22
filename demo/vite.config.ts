import path from "node:path";
import { fileURLToPath } from "node:url";

import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const demoDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(demoDir, "..");

/**
 * Demo estática para GitHub Pages.
 * basePath = nome do repositório (project pages).
 */
export default defineConfig({
  root: demoDir,
  base: "/generative-ui-copilot/",
  plugins: [
    react(),
    tailwindcss(),
    {
      name: "spa-github-pages-fallback",
      closeBundle() {
        // Pages serve 404.html em rotas profundas — copiamos o index.
        // Implementado via writeBundle hook abaixo com fs.
      },
      async writeBundle(outputOptions) {
        const fs = await import("node:fs/promises");
        const outDir = outputOptions.dir ?? path.resolve(demoDir, "dist");
        const indexPath = path.join(outDir, "index.html");
        const notFoundPath = path.join(outDir, "404.html");
        try {
          await fs.copyFile(indexPath, notFoundPath);
        } catch {
          // ignore if index missing
        }
      },
    },
  ],
  resolve: {
    alias: {
      "@": path.resolve(repoRoot, "src"),
    },
  },
  build: {
    outDir: path.resolve(demoDir, "dist"),
    emptyOutDir: true,
  },
  server: {
    port: 5173,
  },
});
