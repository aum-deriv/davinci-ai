import { useState } from "react";
import {
    TextField,
    IconButton,
    SectionMessage,
    Text,
} from "@deriv-com/quill-ui";
import { LabelPairedPaperPlaneTopLgFillIcon } from "@deriv/quill-icons";
import { ImageUploader } from "../ImageUploader/ImageUploader";
import { useSendPrompt } from "../../hooks/useSendPrompt";
import { useChatContext } from "../../contexts/ChatContext";
import { extractCodeFromMessage } from "../../utils/codeExtractor";
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
    const { setHtmlCode, setCssCode, previewUrl, setPreviewUrl } =
        useChatContext();

    const handleSubmit = async () => {
        if (!inputValue.trim() || isLoading) return;

        const userMessage = inputValue.trim();
        setInputValue("");
        setPreviewUrl("");

        const response = await sendPrompt(userMessage);

        if (response) {
            const messageText =
                response.outputs[0].outputs[0].results.message.text;
            const timestamp =
                response.outputs[0].outputs[0].results.message.timestamp;

            // Extract code and plain text from the message
            const { htmlCode, cssCode, plainText } =
                extractCodeFromMessage(messageText);

            // Store code in context
            setHtmlCode(htmlCode);
            setCssCode(cssCode);

            // Send only the plain text as the message
            onMessageSent(userMessage, plainText, timestamp);
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
            <>
                {isLoading ? (
                    <SectionMessage
                        className={styles.loader}
                        icon={<Text size="lg">✦</Text>}
                        message="Generating code..."
                        size="md"
                        status={undefined}
                        title=""
                    />
                ) : (
                    <div className={styles.inputGroup}>
                        <ImageUploader />
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
                            disabled={isLoading || !previewUrl}
                        />
                    </div>
                )}
            </>
        </div>
    );
};
