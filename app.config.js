import { defineConfig } from "@tanstack/start/config";

export default defineConfig({
  server: {
    routeRules: {
      "/api/**": { proxy: "http://localhost:3001/api/**" },
    },
  },
});
