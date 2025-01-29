import { useState } from "react";
import { useChatContext } from "../contexts/ChatContext";
import { config } from "../config/env";
import { RunResponse } from "../types/langflow";

interface UseSendPromptReturn {
    isLoading: boolean;
    error: string | null;
    sendPrompt: (prompt: string) => Promise<RunResponse | undefined>;
}

export const useSendPrompt = (): UseSendPromptReturn => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { filePath } = useChatContext();

    const sendPrompt = async (prompt: string) => {
        if (!filePath) {
            setError("No file uploaded");
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(
                `${config.langflowUrl}/api/v1/run/${config.flowId}?stream=false`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${config.authToken}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        output_type: "chat",
                        input_type: "chat",
                        tweaks: {
                            "ChatInput-xRW5X": {
                                files: filePath,
                                input_value: prompt,
                            },
                        },
                    }),
                }
            );

            if (!response.ok) {
                throw new Error("Failed to send prompt");
            }

            const data: RunResponse = await response.json();
            console.log("Prompt response:", data);
            return data;
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    return { isLoading, error, sendPrompt };
};
