/**
 * Represents a chat message in the Langflow API response
 */
export interface ChatMessage {
    /** ISO timestamp of when the message was sent */
    timestamp: string;
    /** Identifier for who sent the message */
    sender: "Machine" | "Human";
    /** Display name of the sender */
    sender_name: string;
    /** Unique session identifier */
    session_id: string;
    /** The message content */
    text: string;
    /** Array of file paths or references */
    files: string[];
    /** Error indicator */
    error: string | "False";
    /** Edit status indicator */
    edit: string | "False";
    /** Message properties and metadata */
    properties: {
        /** Text color styling */
        text_color: string;
        /** Background color styling */
        background_color: string;
        /** Edit status */
        edited: string | "False";
        /** Source model information */
        source: {
            /** Model identifier */
            id: string;
            /** Display name of the model */
            display_name: string;
            /** Source model name */
            source: string;
        };
        /** Icon identifier */
        icon: string;
        /** Markdown rendering permission */
        allow_markdown: string | "False";
        /** Positive feedback indicator */
        positive_feedback: string | null;
        /** Current state of the message */
        state: "complete" | string;
        /** Target information */
        targets: unknown[];
    };
    /** Message category */
    category: "message";
    /** Additional content blocks */
    content_blocks: unknown[];
    /** Unique message identifier */
    id: string;
    /** Flow identifier */
    flow_id: string;
}

/**
 * Represents a message result in the output
 */
export interface MessageResult {
    /** The chat message */
    message: ChatMessage;
    /** Result type */
    type: "message";
}

/**
 * Represents the structure of output results
 */
export interface OutputResult {
    /** Input parameters */
    inputs: Record<string, unknown>;
    /** Array of output results */
    outputs: {
        /** Results containing message and related data */
        results: {
            /** The message information */
            message: ChatMessage;
            /** Additional artifacts */
            artifacts: Record<string, unknown>;
            /** Output messages */
            outputs: Record<string, MessageResult>;
            /** Log entries */
            logs: Record<string, unknown[]>;
            /** Array of chat messages */
            messages: ChatMessage[];
            /** Time delta information */
            timedelta: number | null;
            /** Duration information */
            duration: number | null;
            /** Display name of the component */
            component_display_name: string;
            /** Component identifier */
            component_id: string;
            /** Frozen result usage indicator */
            used_frozen_result: boolean;
        };
    }[];
}

/**
 * Represents the complete run API response
 */
export interface RunResponse {
    /** Session identifier */
    session_id: string;
    /** Array of output results */
    outputs: OutputResult[];
}
