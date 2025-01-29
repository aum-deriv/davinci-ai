import { useEffect, useRef } from "react";
import { MessageCard } from "./MessageCard/MessageCard";
import styles from "./ChatMessages.module.css";

export interface Message {
    text: string;
    timestamp: string;
    sender: "user" | "ai";
}

interface ChatMessagesProps {
    messages?: Message[];
}

export const ChatMessages = ({ messages = [] }: ChatMessagesProps) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    return (
        <div className={styles.container}>
            {messages.map((message, index) => (
                <MessageCard
                    key={`${message.sender}-${index}`}
                    text={message.text}
                    timestamp={message.timestamp}
                    sender={message.sender}
                />
            ))}
            <div ref={messagesEndRef} />
        </div>
    );
};
