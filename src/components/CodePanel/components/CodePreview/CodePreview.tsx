import { CodeSection } from "./components/CodeSection/CodeSection";
import { useChatContext } from "../../../../contexts/ChatContext";
import styles from "./CodePreview.module.css";
import { Text } from "@deriv-com/quill-ui";

const CodePreview = () => {
    const { htmlCode, cssCode } = useChatContext();

    return (
        <div className={styles.codeSection}>
            <div className={styles.previewSection}>
                <Text size="lg" bold>
                    HTML
                </Text>
                <CodeSection code={htmlCode} language="html" />
            </div>
            <div className={styles.previewSection}>
                <Text size="lg" bold>
                    CSS
                </Text>
                <CodeSection code={cssCode} language="css" />
            </div>
        </div>
    );
};

export default CodePreview;
