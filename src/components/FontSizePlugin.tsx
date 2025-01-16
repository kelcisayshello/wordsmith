/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as React from 'react';
import {
    $getSelection,
    LexicalEditor,
  } from 'lexical';
import {$patchStyleText} from '@lexical/selection';

const MAX_ALLOWED_FONT_SIZE = 72;
const MIN_ALLOWED_FONT_SIZE = 8;
const DEFAULT_FONT_SIZE = 15;

// eslint-disable-next-line no-shadow
export enum UpdateFontSizeType {
    increment = 1,
    decrement,
  }

export const updateFontSize = (
    editor: LexicalEditor,
    updateType: UpdateFontSizeType,
    inputValue: string,
) => {
    if (inputValue !== '') {
        const nextFontSize = calculateNextFontSize(Number(inputValue), updateType);
        updateFontSizeInSelection(editor, String(nextFontSize) + 'px', null);
    } else {
        updateFontSizeInSelection(editor, null, updateType);
    }
};

/**
 * Patches the selection with the updated font size.
 */
export const updateFontSizeInSelection = (
    editor: LexicalEditor,
    newFontSize: string | null,
    updateType: UpdateFontSizeType | null,
  ) => {
    const getNextFontSize = (prevFontSize: string | null): string => {
      if (!prevFontSize) {
        prevFontSize = `${DEFAULT_FONT_SIZE}px`;
      }
      prevFontSize = prevFontSize.slice(0, -2);
      const nextFontSize = calculateNextFontSize(
        Number(prevFontSize),
        updateType,
      );
      return `${nextFontSize}px`;
    };
  
    editor.update(() => {
      if (editor.isEditable()) {
        const selection = $getSelection();
        if (selection !== null) {
          $patchStyleText(selection, {
            'font-size': newFontSize || getNextFontSize,
          });
        }
      }
    });
  };

/**
 * Calculates the new font size based on the update type.
 * @param currentFontSize - The current font size
 * @param updateType - The type of change, either increment or decrement
 * @returns the next font size
 */
export const calculateNextFontSize = (
    currentFontSize: number,
    updateType: UpdateFontSizeType | null,
) => {
    if (!updateType) {
        return currentFontSize;
    }

    let updatedFontSize: number = currentFontSize;
    switch (updateType) {
        case UpdateFontSizeType.decrement:
            switch (true) {
                case currentFontSize > MAX_ALLOWED_FONT_SIZE:
                    updatedFontSize = MAX_ALLOWED_FONT_SIZE;
                    break;
                case currentFontSize >= 48:
                    updatedFontSize -= 12;
                    break;
                case currentFontSize >= 24:
                    updatedFontSize -= 4;
                    break;
                case currentFontSize >= 14:
                    updatedFontSize -= 2;
                    break;
                case currentFontSize >= 9:
                    updatedFontSize -= 1;
                    break;
                default:
                    updatedFontSize = MIN_ALLOWED_FONT_SIZE;
                    break;
            }
            break;

        case UpdateFontSizeType.increment:
            switch (true) {
                case currentFontSize < MIN_ALLOWED_FONT_SIZE:
                    updatedFontSize = MIN_ALLOWED_FONT_SIZE;
                    break;
                case currentFontSize < 12:
                    updatedFontSize += 1;
                    break;
                case currentFontSize < 20:
                    updatedFontSize += 2;
                    break;
                case currentFontSize < 36:
                    updatedFontSize += 4;
                    break;
                case currentFontSize <= 60:
                    updatedFontSize += 12;
                    break;
                default:
                    updatedFontSize = MAX_ALLOWED_FONT_SIZE;
                    break;
            }
            break;

        default:
            break;
    }
    return updatedFontSize;
};

export function parseAllowedFontSize(input: string): string {
    const match = input.match(/^(\d+(?:\.\d+)?)px$/);
    if (match) {
        const n = Number(match[1]);
        if (n >= MIN_ALLOWED_FONT_SIZE && n <= MAX_ALLOWED_FONT_SIZE) {
            return input;
        }
    }
    return '';
}

export default function FontSize({
    selectionFontSize,
    disabled,
    editor,
}: {
    selectionFontSize: string;
    disabled?: boolean;
    editor: LexicalEditor;
}) {
    const [inputValue, setInputValue] = React.useState<string>(selectionFontSize);
    const [inputChangeFlag, setInputChangeFlag] = React.useState<boolean>(false);

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        const inputValueNumber = Number(inputValue);

        if (e.key === 'Tab') {
            return;
        }
        if (['e', 'E', '+', '-'].includes(e.key) || isNaN(inputValueNumber)) {
            e.preventDefault();
            setInputValue('');
            return;
        }
        setInputChangeFlag(true);
        if (e.key === 'Enter' || e.key === 'Escape') {
            e.preventDefault();

            updateFontSizeByInputValue(inputValueNumber);
        }
    };

    const handleInputBlur = () => {
        if (inputValue !== '' && inputChangeFlag) {
            const inputValueNumber = Number(inputValue);
            updateFontSizeByInputValue(inputValueNumber);
        }
    };

    const updateFontSizeByInputValue = (inputValueNumber: number) => {
        let updatedFontSize = inputValueNumber;
        if (inputValueNumber > MAX_ALLOWED_FONT_SIZE) {
            updatedFontSize = MAX_ALLOWED_FONT_SIZE;
        } else if (inputValueNumber < MIN_ALLOWED_FONT_SIZE) {
            updatedFontSize = MIN_ALLOWED_FONT_SIZE;
        }

        setInputValue(String(updatedFontSize));
        updateFontSizeInSelection(editor, String(updatedFontSize) + 'px', null);
        setInputChangeFlag(false);
    };

    React.useEffect(() => {
        setInputValue(selectionFontSize);
    }, [selectionFontSize]);

    return (
        <>
            <input
                type="number"
                title="Font size"
                value={inputValue}
                disabled={disabled}
                className="toolbar-item font-size-input"
                min={MIN_ALLOWED_FONT_SIZE}
                max={MAX_ALLOWED_FONT_SIZE}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                onBlur={handleInputBlur}
            />
        </>
    );
}
