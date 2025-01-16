import React, { useState, useCallback, useEffect } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getSelection, $isRangeSelection } from 'lexical';
import { $patchStyleText } from '@lexical/selection';
import { MIN_ALLOWED_FONT_SIZE, MAX_ALLOWED_FONT_SIZE } from '../plugins/ToolbarContext';

export default function FontSizeInput({ selectionFontSize }: { selectionFontSize: string }) {
  const [editor] = useLexicalComposerContext();
  const [inputValue, setInputValue] = useState(selectionFontSize);
  const [inputChangeFlag, setInputChangeFlag] = useState(false);

  useEffect(() => {
    setInputValue(selectionFontSize);
  }, [selectionFontSize]);

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(event.target.value);
      setInputChangeFlag(true);
    },
    [],
  );

  const updateFontSizeByInputValue = useCallback(
    (inputValueNumber: number) => {
      let font_PT = inputValueNumber;
      if (inputValueNumber > MAX_ALLOWED_FONT_SIZE) {
        font_PT = MAX_ALLOWED_FONT_SIZE;
      } else if (inputValueNumber < MIN_ALLOWED_FONT_SIZE) {
        font_PT = MIN_ALLOWED_FONT_SIZE;
      }

      // Convert from pt (input) to px (internal)
      const font_PX = font_PT * 1.33333;
      console.log(font_PX)
      console.log(font_PT)

      setInputValue(String(font_PT)); // Update the input value with pt

      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $patchStyleText(selection, {
            'font-size': `${font_PT}pt`, // Apply pt to editor
          });
        }
      });
    },
    [editor],
  );
  
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      const inputValueNumber = Number(inputValue);

      if (event.key === 'Tab') {
        return;
      }

      if (['e', 'E', '+', '-'].includes(event.key) || isNaN(inputValueNumber)) {
        event.preventDefault();
        setInputValue(''); // Clear the input if invalid characters are entered
        return;
      }

      if (event.key === 'Enter') {
        event.preventDefault();
        updateFontSizeByInputValue(inputValueNumber);
      }
    },
    [inputValue, updateFontSizeByInputValue],
  );

  const handleBlur = useCallback(() => {
    if (inputChangeFlag) {
      const inputValueNumber = Number(inputValue);
      if (!isNaN(inputValueNumber)) {
        updateFontSizeByInputValue(inputValueNumber);
      } else {
        // If input is invalid, revert to selectionFontSize in pt
        setInputValue(selectionFontSize);
      }
    }
    setInputChangeFlag(false);
  }, [inputChangeFlag, inputValue, updateFontSizeByInputValue, selectionFontSize]);

  return (
    <input
      type="number"
      title="Font size"
      value={inputValue}
      className="font-size-input"
      id="font_size_display"
      min={MIN_ALLOWED_FONT_SIZE}
      max={MAX_ALLOWED_FONT_SIZE}
      onChange={handleInputChange}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
    />
  );
}