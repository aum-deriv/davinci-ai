import { useEffect, useRef } from "react";
import { useChatContext } from "../../../../contexts/ChatContext";
import { Text } from "@deriv-com/quill-ui";
import styles from "./CodeOutput.module.css";

export const CodeOutput = () => {
    const { htmlCode, cssCode } = useChatContext();
    const iframeRef = useRef<HTMLIFrameElement>(null);

    useEffect(() => {
        if (iframeRef.current) {
            const doc = iframeRef.current.contentDocument;
            if (!doc) return;

            doc.open();
            doc.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <style>
                        body {
                            margin: 0;
                            font-family: system-ui, -apple-system, sans-serif;
                            min-height: 100vh;
                        }
                        ${cssCode || ""}
                    </style>
                </head>
                <body>
                    ${
                        htmlCode ||
                        "<div style='padding: 20px; color: #666;'>No code to preview</div>"
                    }
                </body>
                </html>
            `);
            doc.close();
        }
    }, [htmlCode, cssCode]);

    return (
        <div className={styles.container}>
            <Text size="lg" bold>
                Output
            </Text>
            <div className={styles.outputWrapper}>
                <iframe
                    ref={iframeRef}
                    className={styles.frame}
                    title="Code Output"
                    sandbox="allow-same-origin"
                />
            </div>
        </div>
    );
};
