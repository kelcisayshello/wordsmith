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

      if (selection !== null) {
        // Apply font to the selected nodes (if any)
        const nodes = selection.getNodes();

        if (nodes.length === 0) {
          // If nothing is selected, get all root children
          const root = $getRoot();
          nodes.push(...root.getChildren());
        }

        nodes.forEach((node) => {
          if (node instanceof TextNode) {
            node.setStyle(`font-family: ${selectedFont}`);
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