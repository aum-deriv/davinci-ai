import { ThemeProvider } from "@deriv-com/quill-ui";
import { ChatPanel } from "./components/ChatPanel/ChatPanel";
import { CodePanel } from "./components/CodePanel/CodePanel";
import { ChatProvider } from "./contexts/ChatContext";
import styles from "./App.module.css";

export const App = () => {
    return (
        <ThemeProvider theme="light">
            <ChatProvider>
                <div className={styles.container}>
                    <ChatPanel />
                    <CodePanel />
                </div>
            </ChatProvider>
        </ThemeProvider>
    );
};

export default App;
