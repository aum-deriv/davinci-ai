import { IconButton } from "@deriv-com/quill-ui";
import { useUploadFile } from "../../hooks/useUploadFile";
import { LabelPairedImageLgRegularIcon } from "@deriv/quill-icons";
import { useRef } from "react";
import styles from "./ImageUploader.module.css";
import { useChatContext } from "../../contexts/ChatContext";

export const ImageUploader = () => {
    const { isUploading, error, handleImageSelect } = useUploadFile();
    const { setPreviewUrl } = useChatContext();

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
            handleImageSelect(event);
        }
    };

    return (
        <div className={styles.container}>
            <IconButton
                color="black"
                disabled={isUploading}
                icon={<LabelPairedImageLgRegularIcon />}
                onClick={handleButtonClick}
                size="lg"
                type="button"
                variant="primary"
            />
            <input
                ref={fileInputRef}
                className={styles.fileInput}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                disabled={isUploading}
            />

            {error && <div className={styles.error}>{error}</div>}
        </div>
    );
};
