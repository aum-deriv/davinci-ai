import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    // Load env file based on mode
    const env = loadEnv(mode, process.cwd(), "");

    // Validate required environment variables
    const requiredEnvVars = ["LANGFLOW_URL", "AUTH_TOKEN", "FLOW_ID"];
    for (const envVar of requiredEnvVars) {
        if (!env[envVar]) {
            throw new Error(`${envVar} environment variable is required`);
        }
    }

    return {
        plugins: [react()],
        define: {
            "import.meta.env.LANGFLOW_URL": JSON.stringify(env.LANGFLOW_URL),
            "import.meta.env.AUTH_TOKEN": JSON.stringify(env.AUTH_TOKEN),
            "import.meta.env.FLOW_ID": JSON.stringify(env.FLOW_ID),
        },
    };
});
