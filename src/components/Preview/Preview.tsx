import { LegacyCloseCircle1pxRedIcon } from "@deriv/quill-icons";
import { useChatContext } from "../../contexts/ChatContext";
import styles from "./Preview.module.css";

export const Preview = () => {
    const { previewUrl, setPreviewUrl } = useChatContext();

    const handleClear = () => {
        setPreviewUrl(null);
    };

    if (!previewUrl) return null;

    return (
        <div className={styles.container}>
            <div className={styles.previewContainer}>
                <img
                    src={previewUrl}
                    alt="Selected image preview"
                    className={styles.previewImage}
                />
                <button
                    className={styles.closeButton}
                    onClick={handleClear}
                    type="button"
                >
                    <LegacyCloseCircle1pxRedIcon fill="#ffffff" iconSize="xs" />
                </button>
            </div>
        </div>
    );
};
