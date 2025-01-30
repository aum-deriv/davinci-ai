import { useState } from "react";
import styles from "./CodeSection.module.css";
import { Text } from "@deriv-com/quill-ui";

interface CodeSectionProps {
    code: string | null;
    language: "html" | "css";
}

export const CodeSection = ({ code, language }: CodeSectionProps) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        if (!code) return;

        try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy code:", err);
        }
    };

    if (!code) {
        return (
            <Text>No {language.toUpperCase()} code in the latest response</Text>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <span className={styles.language}>
                    {language.toUpperCase()}
                </span>
                <button
                    className={styles.copyButton}
                    onClick={handleCopy}
                    type="button"
                >
                    {copied ? "Copied!" : "Copy"}
                </button>
            </div>
            <pre className={styles.codeBlock}>
                <code className={styles[language]}>{code}</code>
            </pre>
        </div>
    );
};
