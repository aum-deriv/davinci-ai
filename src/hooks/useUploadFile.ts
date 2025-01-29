import { useState } from "react";

interface UseUploadFileReturn {
    selectedImage: File | null;
    previewUrl: string | null;
    isUploading: boolean;
    error: string | null;
    handleImageSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleUpload: () => Promise<void>;
}

export const useUploadFile = (): UseUploadFileReturn => {
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedImage(file);
            setError(null);

            const url = URL.createObjectURL(file);
            setPreviewUrl(url);

            return () => URL.revokeObjectURL(url);
        }
    };

    const handleUpload = async () => {
        if (!selectedImage) {
            setError("Please select an image first");
            return;
        }

        setIsUploading(true);
        setError(null);

        const formData = new FormData();
        formData.append("file", selectedImage);

        try {
            const response = await fetch(
                `http://127.0.0.1:3000/api/v1/files/upload/d95729dc-9dae-4446-b764-0fe7e2600c5a`,
                {
                    method: "POST",
                    body: formData,
                    credentials: "include",
                    mode: "cors",
                    headers: {
                        Authorization:
                            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhNTMzMTUwYS1mM2FmLTQ1MDAtOTFmZS04NGEyYzAyMzI2MzIiLCJ0eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzY5NjA3NjcwfQ.vZuhYMpjPM7CoXdm3-rmi3YSgNYprMpzF0j2Jl7dSS0",
                        Accept: "application/json",
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Upload failed");
            }

            const data = await response.json();
            console.log("Upload successful:", data);

            setSelectedImage(null);
            setPreviewUrl(null);

            const fileInput = document.querySelector(
                'input[type="file"]'
            ) as HTMLInputElement;
            if (fileInput) {
                fileInput.value = "";
            }
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

    return {
        selectedImage,
        previewUrl,
        isUploading,
        error,
        handleImageSelect,
        handleUpload,
    };
};
