import React, { useCallback } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ButtonSmall } from './Buttons';
import { faTerminal } from '@fortawesome/free-solid-svg-icons';
import {
    $isTextNode,
    $getSelection,
    $isRangeSelection
} from 'lexical';

const PrintToConsoleButton: React.FC = () => {
    const [editor] = useLexicalComposerContext();

    const printSelection = useCallback(() => {
        editor.getEditorState().read(() => {
            const selection = $getSelection();

            if (selection === null) {
                console.log("No selection");
                return;
            }
            
            if ($isRangeSelection(selection)) {
                console.log("\nPRINT TO CONSOLE >_\n\n");
                console.log("selection.anchor \t", selection.anchor.getNode());
                console.log("selection.anchor.offset \t", selection.anchor.offset);
                console.log("selection.focus.getNode() \t", selection.focus.getNode());
                console.log("selection.focus.offset \t", selection.focus.offset);
                console.log("selection.getTextContent() \t", selection.getTextContent());
                const nodes = selection.getNodes()
                console.log("Nodes", nodes)
                nodes.forEach(node => {
                    if ($isTextNode(node)) {
                        console.log("Text Node Content", node.getTextContent())
                    }
                })
            } else {
                console.log("Other Selection Type:", selection);
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