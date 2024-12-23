import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $isRangeSelection, $getSelection } from 'lexical';
import { $patchStyleText } from '@lexical/selection';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { ButtonSmall } from './Buttons';
import { useCallback } from 'react';

export const IncreaseFontSize_Button = () => {
  const [editor] = useLexicalComposerContext();

  const handleIncreaseFontSize = useCallback(() => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $patchStyleText(selection, {
          'font-size': (currentStyleValue) => {
            const currentSize = currentStyleValue ? parseInt(currentStyleValue, 10) : 16;
            const maxSize = 48; // ensures maximum font size stays at this defined value
            const newSize = Math.min(maxSize, currentSize + 2);
            return `${newSize}px`;
          },
        });
      }
    });
  }, [editor]);

  return (
    <>
      <ButtonSmall tooltip="Increase Font"
        content={<FontAwesomeIcon icon={faPlus} />} color="blue" style="solid"
        onClick={handleIncreaseFontSize}
      />
    </>

  );
};

export const DecreaseFontSize_Button = () => {
  const [editor] = useLexicalComposerContext();

  const handleDecreaseFontSize = useCallback(() => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $patchStyleText(selection, {
          'font-size': (currentStyleValue) => {
            const currentSize = currentStyleValue ? parseInt(currentStyleValue, 10) : 12;
            const minSize = 10; // ensures minimum font size stays at this defined value
            const newSize = Math.max(minSize, currentSize - 2);
            return `${newSize}px`;
          },
        });
      }
    });
  }, [editor]);

  return (
    <>
      <ButtonSmall tooltip="Decrease Font"
        content={<FontAwesomeIcon icon={ faMinus } />} color="blue" style="solid"
        onClick={handleDecreaseFontSize}
      />
    </>

  );
};