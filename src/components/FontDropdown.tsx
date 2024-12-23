import React, { useCallback } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $getRoot,
  $getSelection,
  $isRangeSelection,
  TextNode
} from 'lexical';

const FontDropdown: React.FC = () => {
  const [editor] = useLexicalComposerContext();

  const fontFamilies = [
    { label: 'Arial', value: 'Arial, sans-serif' },
    { label: 'Courier New', value: 'Courier New, monospace' },
    { label: 'Google Sans', value: 'Google Sans, sans-serif' },
    { label: 'Times New Roman', value: 'Times New Roman, serif' },
  ];

  const handleFontChange = useCallback((selectedFont: string) => {
    editor.update(() => {
      const selection = $getSelection();

      // (1) apply font choice to the highlighted text ONLY
      if (selection !== null && $isRangeSelection(selection) && !selection.isCollapsed()) {
        // console.log("HIGHLIGHTED --->")
        // console.log(selection)

        const anchor = selection.anchor;
        const focus = selection.focus;
        const anchorNode = anchor.getNode();
        const focusNode = focus.getNode();

        if (anchorNode === focusNode && anchorNode instanceof TextNode) {

          // (1.1) the selection is within a single TextNode
          const textContent = anchorNode.getTextContent();
          const startOffset = anchor.offset;
          const endOffset = focus.offset;

          // (1.2) split the TextNode into three parts (before, selected, after)
          const beforeText = textContent.substring(0, startOffset);
          const selectedText = textContent.substring(startOffset, endOffset);
          const afterText = textContent.substring(endOffset);

          // (1.3) now we'll create new TextNodes with the appropriate styles
          const beforeNode = new TextNode(beforeText).setMode('segmented');
          const selectedNode = new TextNode(selectedText).setMode('segmented').setStyle(`font-family: ${selectedFont}`);
          const afterNode = new TextNode(afterText).setMode('segmented');

          // (1.4) replace the original TextNode with the new ones
          anchorNode.replace(beforeNode);
          beforeNode.insertAfter(selectedNode);
          selectedNode.insertAfter(afterNode);
        } else { // this means that the selection spans multiple nodes so for now, apply the style to the entire nodes
          selection.getNodes().forEach((node) => {
            if (node instanceof TextNode) {
              node.setStyle(`font-family: ${selectedFont}`);
            }
          });
        }
        // (2) apply font choice to the entire editor if no selection made
      } else {
        const root = $getRoot();
        // console.log("-----> ENTIRE EDITOR")
        // console.log(root)

        // (2.1) recursively apply the font style to all TextNodes and it's children
        const applyFontStyle = (node: any) => {
          if (node instanceof TextNode) {
            node.setStyle(`font-family: ${selectedFont}`);
          } else {
            node.getChildren().forEach(applyFontStyle);
          }
        };
        root.getChildren().forEach(applyFontStyle);
      }
    });
  }, [editor]);

  return (
    <select className="font-dropdown" onChange={(e) => handleFontChange(e.target.value)}>
      {fontFamilies.map((font) => (
        <option key={font.value} value={font.value}>
          {font.label}
        </option>
      ))}
    </select>
  );
};

export default FontDropdown;