import fs from "node:fs";
import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";

const pagesBase = "/tabaco-atlas/";

function redirectRootToPagesBase(): Plugin {
  const redirectRoot = (
    req: { url?: string },
    res: { statusCode: number; setHeader: (name: string, value: string) => void; end: () => void },
    next: () => void,
  ) => {
    const url = req.url ?? "/";
    if (url === "/" || url === "") {
      res.statusCode = 302;
      res.setHeader("Location", pagesBase);
      res.end();
      return;
    }
    next();
  };

  return {
    name: "redirect-root-to-pages-base",
    configureServer(server) {
      server.middlewares.use(redirectRoot);
    },
    configurePreviewServer(server) {
      server.middlewares.use(redirectRoot);
    },
    closeBundle() {
      const index = path.resolve(__dirname, "dist/index.html");
      const notFound = path.resolve(__dirname, "dist/404.html");
      if (fs.existsSync(index)) {
        fs.copyFileSync(index, notFound);
      }
    },
  };
}

export default defineConfig({
  base: pagesBase,
  plugins: [react(), tailwindcss(), redirectRootToPagesBase()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: "0.0.0.0",
    port: 5173,
  },
  preview: {
    host: "0.0.0.0",
    port: 4173,
  },
});
