import { ThemeProvider } from "@deriv-com/quill-ui";
import { ChatPanel } from "./components/ChatPanel/ChatPanel";
import { ChatProvider } from "./contexts/ChatContext";
import styles from "./App.module.css";

const App = () => {
    return (
        <div className={styles.app}>
            <ThemeProvider theme="light">
                <ChatProvider>
                    <ChatPanel />
                </ChatProvider>
            </ThemeProvider>
        </div>
    );
};

export default App;
