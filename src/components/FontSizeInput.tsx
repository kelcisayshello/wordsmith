import React, { useState, useCallback } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getSelection, $isRangeSelection } from 'lexical';
import { $patchStyleText } from '@lexical/selection';
import { MIN_ALLOWED_FONT_SIZE, MAX_ALLOWED_FONT_SIZE } from '../plugins/ToolbarContext';

export default function FontSizeInput({ selectionFontSize }: { selectionFontSize: string }) {
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
                    const fontSizePt = parseFloat(pendingFontSize);
                    if (!isNaN(fontSizePt) && fontSizePt >= MIN_ALLOWED_FONT_SIZE && fontSizePt <= MAX_ALLOWED_FONT_SIZE) {
                        const fontSizePx = fontSizePt * 1.33333; // Direct conversion
                        $patchStyleText(selection, { 'font-size': `${fontSizePx}px` });
                    }
                }
            });
            setPendingFontSize(null);
        }
    }, [editor, pendingFontSize]);

    return (
        <input
            type="number"
            title="Font size"
            value={inputValue}
            className="font-size-input"
            id="font_size_display"
            min={MIN_ALLOWED_FONT_SIZE}
            max={MAX_ALLOWED_FONT_SIZE}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
        />
    );
};