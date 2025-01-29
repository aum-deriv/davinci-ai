import { createContext, useContext, useState, ReactNode } from "react";

interface ChatContextType {
    filePath: string | null;
    setFilePath: (path: string | null) => void;
    previewUrl: string | null;
    setPreviewUrl: (url: string | null) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
    const [filePath, setFilePath] = useState<string | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    return (
        <ChatContext.Provider
            value={{ filePath, setFilePath, previewUrl, setPreviewUrl }}
        >
            {children}
        </ChatContext.Provider>
    );
};

export const useChatContext = () => {
    const context = useContext(ChatContext);
    if (context === undefined) {
        throw new Error("useChatContext must be used within a ChatProvider");
    }
    return context;
};
