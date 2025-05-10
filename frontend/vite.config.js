import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load environment variables based on the current mode (development/production)
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react(), tailwindcss()],
    define: {
      // Expose environment variables to the client-side code
      "process.env": {
        VITE_API_KEY: JSON.stringify(env.VITE_API_KEY),
        VITE_BASE_URL: JSON.stringify(env.VITE_BASE_URL),
        // Add other environment variables here
      },
    },
  };
});
