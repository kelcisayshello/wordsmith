import { useCallback } from 'react';

// Lexical.js
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $isRangeSelection, $getSelection, $createTextNode } from 'lexical';
import { $patchStyleText } from "@lexical/selection"

// FontAwesome
import { ButtonSmall } from './Buttons';

export const UpperCase_Button = () => {
    const [editor] = useLexicalComposerContext();

    const handleUppercase = () => {
        editor.update(() => {
            const selection = $getSelection()
            if ($isRangeSelection(selection)) {
                $patchStyleText(selection, { "text-transform": "uppercase" })
            }
        })
    }

    return (
        <>
            <ButtonSmall tooltip="Uppercase"
                content={<p>A</p>} color="orange" style="solid"
                onClick={handleUppercase}
            />
        </>

    );
};

export const Lowercase_Button = () => {
    const [editor] = useLexicalComposerContext();

    const handleLowercase = () => {
        editor.update(() => {
            const selection = $getSelection()
            if ($isRangeSelection(selection)) {
                $patchStyleText(selection, { "text-transform": "lowercase" })
            }
        })
    }

    return (
        <>
            <ButtonSmall tooltip="Lowercase"
                content={<p>a</p>} color="orange" style="solid"
                onClick={handleLowercase}
            />
        </>

    );
};

export const Capitalize_Button = () => {
    const [editor] = useLexicalComposerContext();

    const handleCapitalize = useCallback(() => {
        editor.update(() => {
            const selection = $getSelection();

            if ($isRangeSelection(selection)) {
                const selectedText = selection.getTextContent();

                if (selectedText) {
                    const capitalizedText = selectedText.split(/\s+/).map(word => {
                        if (word.length > 0) {
                            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
                        }
                        return "";
                    }).join(" ");

                    selection.insertNodes([$createTextNode(capitalizedText)]);
                }
            }
        });
    }, [editor]);

    return (
        <>
            <ButtonSmall tooltip="Capitalize"
                content={<p>Aa</p>} color="orange" style="outline"
                onClick={handleCapitalize}
            />
        </>

    );
};