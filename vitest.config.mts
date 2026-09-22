import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  // Generated collections are external inputs. Tests supply vi.mock factories,
  // including jsdom's Vite resolver, without depending on a prior site build.
  plugins: [
    {
      name: "test-content-collections",
      resolveId(id) {
        if (id === "content-collections") return id;
      },
    },
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts", "content-collections.test.ts"],
  },
});
