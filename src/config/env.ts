export const config = {
    langflowUrl: import.meta.env.LANGFLOW_URL,
    authToken: import.meta.env.AUTH_TOKEN,
    flowId: import.meta.env.FLOW_ID,
} as const;

// Validate environment variables
if (!config.langflowUrl) throw new Error("LANGFLOW_URL is required");
if (!config.authToken) throw new Error("AUTH_TOKEN is required");
if (!config.flowId) throw new Error("FLOW_ID is required");
