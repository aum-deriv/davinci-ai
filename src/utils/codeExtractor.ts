export interface ExtractedCode {
    htmlCode: string | null;
    cssCode: string | null;
    plainText: string;
}

export const extractCodeFromMessage = (message: string): ExtractedCode => {
    const htmlMatch = message.match(/```html\n([\s\S]*?)```/);
    const cssMatch = message.match(/```css\n([\s\S]*?)```/);

    // Remove code blocks from message
    const plainText = message
        .replace(/```html\n[\s\S]*?```/g, "")
        .replace(/```css\n[\s\S]*?```/g, "")
        .trim();

    return {
        htmlCode: htmlMatch ? htmlMatch[1].trim() : null,
        cssCode: cssMatch ? cssMatch[1].trim() : null,
        plainText,
    };
};
