import { useChatContext } from "../../contexts/ChatContext";
import { CodeOutput } from "./components/CodeOutput/CodeOutput";
import CodePreview from "./components/CodePreview/CodePreview";
import styles from "./CodePanel.module.css";

export const CodePanel = () => {
    const { htmlCode, cssCode } = useChatContext();

    if (!htmlCode && !cssCode) {
        return (
            <div className={styles.container}>
                <img src="/davinci-logo.png" className={styles.image}></img>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <CodeOutput />
            <CodePreview />
        </div>
    );
};
