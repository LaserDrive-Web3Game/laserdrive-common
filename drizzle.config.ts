import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/schema/*",
  out: "./src/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.POSTGRES_URI || "",
  },
  verbose: true,
  strict: true,
});
