import React, { useCallback } from 'react';

// Lexical.js
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
    $getRoot,
    $getSelection,
    $isRangeSelection,
    TextNode,
    LexicalNode,
    ElementNode,
} from 'lexical';

// FontAwesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTerminal } from '@fortawesome/free-solid-svg-icons';

// Components
import { ButtonSmall } from './Buttons';

const PrintToConsoleButton: React.FC = () => {
    const [editor] = useLexicalComposerContext();

    const printSelection = useCallback(() => {
        editor.getEditorState().read(() => {
            const selection = $getSelection();

            if (selection === null) {
                console.log("No selection");
                return;
            }

            // (1) print details of highlighted selection ONLY
            if (selection !== null && $isRangeSelection(selection) && !selection.isCollapsed()) {
                const anchor = selection.anchor;
                const focus = selection.focus;
                const anchorNode = anchor.getNode();
                const focusNode = focus.getNode();

                if (anchorNode === focusNode && anchorNode instanceof TextNode) {
                    // (1.1) selection within a single TextNode
                    const textContent = anchorNode.getTextContent();
                    const startOffset = anchor.offset;
                    const endOffset = focus.offset;

                    console.log("\nPRINT TO CONSOLE >_\n\n");
                    console.log("Selected Text:", textContent.substring(startOffset, endOffset));
                    console.log("Anchor details:", anchor);
                    console.log("Focus details:", focus);

                    // optionally iterate through child TextNodes for more granular info
                } else {
                    // (1.2) selection spans multiple nodes
                    console.log("\nPRINT TO CONSOLE >_\n\n");
                    console.log("Selection spans multiple nodes.");

                    // you can iterate through selected nodes here if needed
                    selection.getNodes().forEach((node) => {
                        console.log("Node:", node);
                    });
                }

                // (2) print details of entire editor content if nothing is selected
            } else {
                const root = $getRoot();

                // (2.1) recursively traverse and print details of all TextNodes
                const printTextNodeContent = (node: LexicalNode) => {
                    if (node instanceof TextNode) {
                        console.log("Text Node Content:", node.getTextContent());
                    } else if (node instanceof ElementNode) {
                        node.getChildren().forEach(printTextNodeContent);
                    }
                };
                console.log("\nPRINT TO CONSOLE >_\n\n");
                console.log("Entire Editor Content:");
                root.getChildren().forEach(printTextNodeContent);
            }
        });
    }, [editor]);

    return (
        <ButtonSmall tooltip="Print Selection to Console"
            id="print_selection_to_console" content={<FontAwesomeIcon icon={faTerminal} />} color="blue" style="outline"
            onClick={printSelection}
        />
    );
};

export default PrintToConsoleButton;