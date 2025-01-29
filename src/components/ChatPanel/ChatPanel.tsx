import { useState } from "react";
import { PromptField } from "../PromptField/PromptField";
import { Preview } from "../Preview/Preview";
import { ChatMessages, Message } from "./components/ChatMessages/ChatMessages";
import styles from "./ChatPanel.module.css";

export const ChatPanel = () => {
    const [messages, setMessages] = useState<Message[]>([]);

    const handleMessageSent = (
        userMessage: string,
        aiMessage: string,
        timestamp: string
    ) => {
        setMessages((prev) => [
            ...prev,
            { text: userMessage, timestamp, sender: "user" },
            { text: aiMessage, timestamp, sender: "ai" },
        ]);
    };

    return (
        <div className={styles.container}>
            <ChatMessages messages={messages} />
            <div className={styles.inputArea}>
                <Preview />
                <PromptField onMessageSent={handleMessageSent} />
            </div>
        </div>
    );
};
