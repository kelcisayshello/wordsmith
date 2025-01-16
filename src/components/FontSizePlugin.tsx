import React, { useState, useCallback } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getSelection, $isRangeSelection } from 'lexical';
import { $patchStyleText } from '@lexical/selection';

const MAX_ALLOWED_FONT_SIZE = 72;
const MIN_ALLOWED_FONT_SIZE = 8;

function FontSize({ selectionFontSize }: { selectionFontSize: string }) {
    const [editor] = useLexicalComposerContext();
    const [inputValue, setInputValue] = useState(selectionFontSize);
    const [pendingFontSize, setPendingFontSize] = useState<string | null>(null); // Store the pending change

    const handleInputChange = useCallback((event: any) => {
        setInputValue(event.target.value);
        setPendingFontSize(event.target.value); // Update pending font size
    }, []);

    const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault(); // Prevent form submission if inside a form
            applyFontSize();
        }
    }, [editor, pendingFontSize]);

    const handleBlur = useCallback(() => {
        applyFontSize();
    }, [editor, pendingFontSize]);

    const applyFontSize = useCallback(() => {
        if (pendingFontSize !== null) {
            editor.update(() => {
                const selection = $getSelection();
                if ($isRangeSelection(selection)) {
                    const parsedFontSize = parseInt(pendingFontSize);
                    if (!isNaN(parsedFontSize) && parsedFontSize >= MIN_ALLOWED_FONT_SIZE && parsedFontSize <= MAX_ALLOWED_FONT_SIZE) {
                        $patchStyleText(selection, { 'font-size': parsedFontSize + 'px' });
                    }
                }
            });
            setPendingFontSize(null); // Clear pending font size
        }
    }, [editor, pendingFontSize]);

    return (
        <input
            type="number"
            title="Font size"
            value={inputValue}
            className="font-size-input"
            id = "font_size_display"
            min={MIN_ALLOWED_FONT_SIZE}
            max={MAX_ALLOWED_FONT_SIZE}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
        />
    );
}

export default FontSize;