import { useState, useCallback } from 'react';

// Lexical.js
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBrush } from '@fortawesome/free-solid-svg-icons';
import {
    $getRoot,
    $getSelection,
    $isRangeSelection,
    TextNode,
    LexicalNode,
    ElementNode
} from 'lexical';

// Components
import { ButtonSmall } from './Buttons';

const ColorPicker_Button = () => {
    const [editor] = useLexicalComposerContext();
    const [showPicker, setShowPicker] = useState(false);
    const [currentColor, setCurrentColor] = useState(''); // sets initial color to black

    const handleColorChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setCurrentColor(e.target.value);
    }, []);

    const handleClick = useCallback(() => {
        editor.update(() => {
            const selection = $getSelection();

            // (1) apply color to the highlighted text ONLY
            if (selection !== null && $isRangeSelection(selection) && !selection.isCollapsed()) {
                const anchor = selection.anchor;
                const focus = selection.focus;
                const anchorNode = anchor.getNode();
                const focusNode = focus.getNode();

                if (anchorNode === focusNode && anchorNode instanceof TextNode) {
                    // (1.1) selection is within a single TextNode
                    const textContent = anchorNode.getTextContent();
                    const startOffset = anchor.offset;
                    const endOffset = focus.offset;

                    // (1.2) split the TextNode into three parts
                    const beforeText = textContent.substring(0, startOffset);
                    const selectedText = textContent.substring(startOffset, endOffset);
                    const afterText = textContent.substring(endOffset);

                    // (1.3) create new TextNodes with the appropriate styles
                    const beforeNode = new TextNode(beforeText).setMode('segmented');
                    const selectedNode = new TextNode(selectedText).setMode('segmented').setStyle(`color: ${currentColor}`);
                    const afterNode = new TextNode(afterText).setMode('segmented');

                    // (1.4) replace the original TextNode
                    anchorNode.replace(beforeNode);
                    beforeNode.insertAfter(selectedNode);
                    selectedNode.insertAfter(afterNode);
                } else {
                    // (1.5) in the case that the selection spans multiple nodes but for now, apply the style to the entire nodes
                    selection.getNodes().forEach((node) => {
                        if (node instanceof TextNode) {
                            node.setStyle(`color: ${currentColor}`);
                        }
                    });
                }

                // (2) Apply color to the entire editor if nothing is selected
            } else {
                const root = $getRoot();

                // (2.1) Recursively apply the color style to all TextNodes
                const applyColorStyle = (node: LexicalNode) => {
                    if (node instanceof TextNode) {
                        node.setStyle(`color: ${currentColor}`);
                    } else if (node instanceof ElementNode) {
                        node.getChildren().forEach(applyColorStyle);
                    }
                };
                root.getChildren().forEach(applyColorStyle);
            }
        });
    }, [editor, currentColor]);

    return (
        <>
            <ButtonSmall tooltip="Change Font Color" color="vibrant-blue" style="outline"
                onClick={() => setShowPicker(!showPicker)}
                content={<FontAwesomeIcon icon={faBrush} color={currentColor}/>}
            />

            {showPicker && (
                <div className="color-picker-modal">
                    <input type="color" value={currentColor} onChange={handleColorChange} />
                    <input
                        className="hex-color-field"
                        type="text"
                        value={currentColor}
                        onChange={handleColorChange}
                        placeholder="#000000"
                    />
                    <button className="apply-button" onClick={handleClick}>Apply</button>
                </div>
            )}
        </>
    );
};

export default ColorPicker_Button;