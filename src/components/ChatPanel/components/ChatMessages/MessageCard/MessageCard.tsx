import styles from "./MessageCard.module.css";

export interface MessageCardProps {
    text: string;
    timestamp: string;
    sender: "user" | "ai";
}

export const MessageCard = ({ text, timestamp, sender }: MessageCardProps) => {
    return (
        <div className={`${styles.container} ${styles[sender]}`}>
            <div className={styles.message}>{text}</div>
            <div className={styles.timestamp}>
                {new Date(timestamp).toLocaleTimeString()}
            </div>
        </div>
    );
};
