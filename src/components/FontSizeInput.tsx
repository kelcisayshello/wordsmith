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
      let updatedFontSize = inputValueNumber;
      if (inputValueNumber > MAX_ALLOWED_FONT_SIZE) {
        updatedFontSize = MAX_ALLOWED_FONT_SIZE;
      } else if (inputValueNumber < MIN_ALLOWED_FONT_SIZE) {
        updatedFontSize = MIN_ALLOWED_FONT_SIZE;
      }

      setInputValue(String(updatedFontSize)); // Update the input value
      
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $patchStyleText(selection, {
            'font-size': `${updatedFontSize}px`,
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
    // Only update if the input has been changed
    if (inputChangeFlag) {
        const inputValueNumber = Number(inputValue);
        if (!isNaN(inputValueNumber)){
            updateFontSizeByInputValue(inputValueNumber);
        } else {
            setInputValue(selectionFontSize)
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