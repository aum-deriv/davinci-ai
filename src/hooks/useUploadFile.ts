import { useState } from "react";
import { useChatContext } from "../contexts/ChatContext";
import { config } from "../config/env";

interface UseUploadFileReturn {
    selectedImage: File | null;
    previewUrl: string | null;
    isUploading: boolean;
    error: string | null;
    handleImageSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleUpload: () => Promise<void>;
    clearSelection: () => void;
}

export const useUploadFile = (): UseUploadFileReturn => {
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { setFilePath } = useChatContext();

    const handleUploadWithFormData = async (formData: FormData) => {
        setIsUploading(true);
        setError(null);

        try {
            const response = await fetch(
                `${config.langflowUrl}/api/v1/files/upload/${config.flowId}`,
                {
                    method: "POST",
                    body: formData,
                    credentials: "include",
                    mode: "cors",
                    headers: {
                        Authorization: `Bearer ${config.authToken}`,
                        Accept: "application/json",
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Upload failed");
            }

            const data = await response.json();
            console.log("Upload successful:", data);
            setFilePath(data.file_path);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "An error occurred during upload"
            );
        } finally {
            setIsUploading(false);
        }
    };

    const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedImage(file);
            setError(null);

            // Upload the file directly
            const formData = new FormData();
            formData.append("file", file);
            handleUploadWithFormData(formData);
        }
    };

    // Keep handleUpload for backward compatibility
    const handleUpload = async () => {
        if (!selectedImage) {
            setError("Please select an image first");
            return;
        }

        const formData = new FormData();
        formData.append("file", selectedImage);
        await handleUploadWithFormData(formData);
    };

    const clearSelection = () => {
        setSelectedImage(null);
        setPreviewUrl(null);
        const fileInput = document.querySelector(
            'input[type="file"]'
        ) as HTMLInputElement;
        if (fileInput) {
            fileInput.value = "";
        }
    };

    return {
        selectedImage,
        previewUrl,
        isUploading,
        error,
        handleImageSelect,
        handleUpload,
        clearSelection,
    };
};
