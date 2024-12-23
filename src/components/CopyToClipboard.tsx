import React, { useCallback, useState } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ButtonSmall } from './Buttons';
import { faCopy } from '@fortawesome/free-solid-svg-icons';
import { faFileLines } from "@fortawesome/free-regular-svg-icons";
import {
    $getRoot,
    $getSelection,
    $isRangeSelection
} from 'lexical';
import { showNotification } from '../Toolbar';

export const CopySelectionToClipboard_Button: React.FC = () => {
    const [editor] = useLexicalComposerContext();
    const [notification, setNotification] = useState<string | null>(null);

    const copySelection = useCallback(() => {
        editor.getEditorState().read(() => {
            const selection = $getSelection();

            if ($isRangeSelection(selection)) {
                const selectedText = selection.getTextContent();
                navigator.clipboard.writeText(selectedText).then(() => {
                    showNotification('Editor selection has successfully been copied to clipboard ✅', setNotification);
                }).catch((error) => {
                    console.error('Failed to copy selection: ', error);
                    showNotification('Failed to copy editor selection ❌', setNotification);
                });
            } else {
                showNotification('No selection to copy.', setNotification);
            }
        });
    }, [editor, setNotification]);

    return (
        <>
            {notification && (
                <div className="notification-modal">{notification}</div>
            )}
            <ButtonSmall tooltip="Copy Selection to Clipboard"
                content={<FontAwesomeIcon icon={faFileLines} />} color="blue" style="outline"
                onClick={copySelection}
            />
        </>
    );
};

export const CopyAllToClipboard_Button: React.FC = () => {
    const [editor] = useLexicalComposerContext();
    const [notification, setNotification] = useState<string | null>(null);

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
                showNotification('Entire editor has successfully been copied to clipboard ✅', setNotification);
            }).catch((error) => {
                console.error('Failed to copy all editor contents: ', error);
                showNotification('Failed to copy all editor contents ❌', setNotification);
            });
        });
    }, [editor, setNotification]);

    return (
        <>
            {notification && (
                <div className="notification-modal">{notification}</div>
            )}
            <ButtonSmall tooltip="Copy All to Clipboard"
                content={<FontAwesomeIcon icon={faCopy} />} color="blue" style="outline"
                onClick={copyAll}
            />
        </>
    );
};