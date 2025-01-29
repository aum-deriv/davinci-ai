import { useState } from "react";
import { TextField, IconButton } from "@deriv-com/quill-ui";
import { LabelPairedPaperPlaneTopLgFillIcon } from "@deriv/quill-icons";
import { ImageUploader } from "../ImageUploader/ImageUploader";
import { useSendPrompt } from "../../hooks/useSendPrompt";
import styles from "./PromptField.module.css";

interface PromptFieldProps {
    onMessageSent: (
        userMessage: string,
        aiMessage: string,
        timestamp: string
    ) => void;
}

export const PromptField = ({ onMessageSent }: PromptFieldProps) => {
    const [inputValue, setInputValue] = useState("");
    const { sendPrompt, isLoading } = useSendPrompt();

    const handleSubmit = async () => {
        if (!inputValue.trim() || isLoading) return;

        const userMessage = inputValue.trim();
        setInputValue("");

        const response = await sendPrompt(userMessage);

        if (response) {
            const aiMessage =
                response.outputs[0].outputs[0].results.message.text;
            const timestamp =
                response.outputs[0].outputs[0].results.message.timestamp;
            onMessageSent(userMessage, aiMessage, timestamp);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    return (
        <div className={styles.container}>
            <ImageUploader />
            <div className={styles.inputGroup}>
                <TextField
                    status="neutral"
                    type="text"
                    placeholder="How can I help you?"
                    inputSize="lg"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={isLoading}
                />
                <IconButton
                    color="black"
                    icon={<LabelPairedPaperPlaneTopLgFillIcon />}
                    type="button"
                    size="lg"
                    variant="primary"
                    onClick={handleSubmit}
                    disabled={isLoading}
                />
            </div>
        </div>
    );
};
