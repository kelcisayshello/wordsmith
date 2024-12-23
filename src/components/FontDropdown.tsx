import React, { useCallback } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { 
  $getRoot,
  $getSelection, 
  TextNode, 
} from 'lexical';

interface FontDropdownProps {
  fontFamilies: { label: string; value: string }[];
}

const FontDropdown: React.FC<FontDropdownProps> = ({ fontFamilies }) => {
  const [editor] = useLexicalComposerContext();

  const handleFontChange = useCallback((selectedFont: string) => {
  editor.update(() => {
    const selection = $getSelection();

    if (selection) {
      // Apply font to the selected nodes (if any)
      selection.getNodes().forEach((node) => {
        if (node instanceof TextNode) {
          node.setStyle(`font-family: ${selectedFont}`);
        }
      });
    } else {
      // If no selection, apply font to the entire editor content
      const root = $getRoot(); 
      root.getChildren().forEach(child => {
        if (child instanceof TextNode) {
          child.setStyle(`font-family: ${selectedFont}`);
        }
      });
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