import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getRoot, $isRangeSelection, $createTextNode, $getSelection, $createParagraphNode } from 'lexical';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboard } from '@fortawesome/free-solid-svg-icons';
import { ButtonSmall } from './Buttons';
import { showNotification } from '../Toolbar';
import { useCallback, useState } from 'react';

const PasteFromClipBoard = () => {
  const [editor] = useLexicalComposerContext();
  const [notification, setNotification] = useState<string | null>(null);

  const handlePasteFromClipboard = useCallback(async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();

      editor.update(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          selection.insertNodes([$createTextNode(clipboardText)]);
          showNotification('Content has successfully been pasted to the editor ✅', setNotification);
          
        } else {
          const root = $getRoot();
          const paragraph = $createParagraphNode();
          paragraph.append($createTextNode(clipboardText));
          root.append(paragraph);
        }
      });
    } catch (error) {
      console.error('Failed to read clipboard: ', error);
      showNotification('Failed to read clipboard ❌', setNotification);
    }
  }, [editor, setNotification]);

  return (
    <>
      {notification && (
        <div className="notification-modal">{notification}</div>
      )}
      <ButtonSmall tooltip="Paste from Clipboard"
        content={<FontAwesomeIcon icon={faClipboard} />} color="blue" style="solid"
        onClick={handlePasteFromClipboard}
      />
    </>

  );
};

export default PasteFromClipBoard;