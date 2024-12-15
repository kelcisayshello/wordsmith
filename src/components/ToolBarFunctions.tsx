

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getSelection, $isRangeSelection, $getRoot } from 'lexical';
import { useCallback, useState } from 'react';

export function CopyButtons() {
    const [editor] = useLexicalComposerContext();
    const [copyMessage, setCopyMessage] = useState<string | null>(null);

    const showCopyMessage = (message: string) => {
        setCopyMessage(message);
        setTimeout(() => {
            setCopyMessage(null);
        }, 3000); // 3 seconds
    };

    const copySelection = useCallback(() => {
        editor.getEditorState().read(() => {
            const selection = $getSelection();

            if ($isRangeSelection(selection)) {
                const selectedText = selection.getTextContent();
                navigator.clipboard.writeText(selectedText).then(() => {
                    showCopyMessage('Selection successfully copied to clipboard!');
                }).catch((error) => {
                    console.error('Failed to copy selection: ', error);
                    showCopyMessage('Failed to copy selection.'); // Inform user of failure
                });
            } else {
                showCopyMessage('No selection to copy.');
            }
        });
    }, [editor]);

    const copyAll = useCallback(() => {
        editor.getEditorState().read(() => {
            const rootNode = $getRoot();
            let textContent = '';

            rootNode.getChildren().forEach(child => {
                if (typeof child.getTextContent === 'function') {
                    textContent += child.getTextContent() + '\n';
                }
            });

            navigator.clipboard.writeText(textContent).then(() => {
                showCopyMessage('Editor successfully copied to clipboard!');
            }).catch((error) => {
                console.error('Failed to copy all content: ', error);
                showCopyMessage('Failed to copy editor content.');
            });
        });
    }, [editor]);
};