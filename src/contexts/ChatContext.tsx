import { createContext, useContext, useState, ReactNode } from "react";

interface ChatContextType {
    filePath: string | null;
    setFilePath: (path: string | null) => void;
    previewUrl: string | null;
    setPreviewUrl: (url: string | null) => void;
    htmlCode: string | null;
    setHtmlCode: (code: string | null) => void;
    cssCode: string | null;
    setCssCode: (code: string | null) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
    const [filePath, setFilePath] = useState<string | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [htmlCode, setHtmlCode] = useState<string | null>(null);
    const [cssCode, setCssCode] = useState<string | null>(null);

    return (
        <ChatContext.Provider
            value={{
                filePath,
                setFilePath,
                previewUrl,
                setPreviewUrl,
                htmlCode,
                setHtmlCode,
                cssCode,
                setCssCode,
            }}
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
