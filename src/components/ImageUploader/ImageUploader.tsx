import { IconButton } from "@deriv-com/quill-ui";
import { useUploadFile } from "../../hooks/useUploadFile";
import { LabelPairedImageMdRegularIcon } from "@deriv/quill-icons";

export const ImageUploader = () => {
    const {
        selectedImage,
        previewUrl,
        isUploading,
        error,
        handleImageSelect,
        handleUpload,
    } = useUploadFile();

    return (
        <div>
            <IconButton
                color="black"
                disabled={!selectedImage || isUploading}
                icon={<LabelPairedImageMdRegularIcon />}
                onClick={handleUpload}
                size="md"
                type="button"
                variant="primary"
            ></IconButton>
            <input
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                disabled={isUploading}
            />

            {previewUrl && (
                <img
                    src={previewUrl}
                    alt="Selected image preview"
                    style={{
                        maxWidth: "300px",
                        display: "block",
                        margin: "20px 0",
                    }}
                />
            )}

            {error && <div style={{ color: "red" }}>{error}</div>}
        </div>
    );
};
