import { useCallback, useEffect, useRef, useState } from 'react';

// Lexical.js
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { mergeRegister } from '@lexical/utils';
import { INSERT_ORDERED_LIST_COMMAND, INSERT_UNORDERED_LIST_COMMAND } from "@lexical/list"
import { $getSelectionStyleValueForProperty } from "@lexical/selection"
import {
    $getSelection,
    $isRangeSelection,
    CAN_REDO_COMMAND,
    CAN_UNDO_COMMAND,
    FORMAT_ELEMENT_COMMAND,
    FORMAT_TEXT_COMMAND,
    REDO_COMMAND,
    SELECTION_CHANGE_COMMAND,
    UNDO_COMMAND,
    INDENT_CONTENT_COMMAND,
    OUTDENT_CONTENT_COMMAND,
} from 'lexical';

import { useToolbarState, DEFAULT_FONT_SIZE } from './plugins/ToolbarContext';

// Components
import { ButtonSpacer, ButtonSmall } from "./components/Buttons";
import FontDropdown_Select from "./components/FontDropdown";
import { Capitalize_Button, Lowercase_Button, UpperCase_Button } from './components/TextCase';
import ColorPicker_Button from "./components/ColorPicker"
import { IncreaseFontSize_Button, DecreaseFontSize_Button } from "./components/ChangeFontSize";
import PrintToConsoleButton from "./components/PrintToConsole";
import PasteFromClipBoard_Button from "./components/PasteFromClipboard";
import { RegexAddHyperlink, RemoveHyperlink } from './components/Hyperlink';
import { CopySelectionToClipboard_Button, CopyAllToClipboard_Button } from "./components/CopyToClipboard";
import FontSizeInput from "./components/FontSizeInput";
import { showNotification } from "./components/Notification"

// FontAwesome React
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faItalic, faUnderline, faStrikethrough, faListOl, faListUl, faIndent, faArrowRotateRight, faTrashCan, faAlignLeft, faAlignJustify, faAlignRight } from '@fortawesome/free-solid-svg-icons';

// CSS Style Sheets
import "./css/toolbar.css"
import "./css/textformatting.css"

// export const showNotification = (notification: string, setNotification: React.Dispatch<React.SetStateAction<string | null>>) => {
//     setNotification(notification);
//     setTimeout(() => {
//         setNotification(null);
//     }, 3000); // 3 seconds
// };

export default function Toolbar(){
    const [editor] = useLexicalComposerContext();
    const toolbarRef = useRef(null);
    const [canUndo, setCanUndo] = useState(false);
    const [canRedo, setCanRedo] = useState(false);
    const [isBold, setIsBold] = useState(false);
    const [isItalic, setIsItalic] = useState(false);
    const [isUnderline, setIsUnderline] = useState(false);
    const [isStrikethrough, setIsStrikethrough] = useState(false);
    const { toolbarState, updateToolbarState } = useToolbarState();

    const $updateToolbar = useCallback(() => {

        let default_size = String(DEFAULT_FONT_SIZE) + "pt"
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
            setIsBold(selection.hasFormat('bold'));
            setIsItalic(selection.hasFormat('italic'));
            setIsUnderline(selection.hasFormat('underline'));
            setIsStrikethrough(selection.hasFormat('strikethrough'));
            updateToolbarState(
                'fontSize',
                $getSelectionStyleValueForProperty(selection, 'font-size', default_size),
              );
        }
    }, [updateToolbarState]);

    const LowPriority = 1;

    useEffect(() => {
        return mergeRegister(
            editor.registerUpdateListener(({ editorState }) => {
                editorState.read(() => {
                    $updateToolbar();
                });
            }),
            editor.registerCommand(
                SELECTION_CHANGE_COMMAND,
                (_payload, _newEditor) => {
                    $updateToolbar();
                    return false;
                },
                LowPriority,
            ),
            editor.registerCommand(
                CAN_UNDO_COMMAND,
                (payload) => {
                    setCanUndo(payload);
                    return false;
                },
                LowPriority,
            ),
            editor.registerCommand(
                CAN_REDO_COMMAND,
                (payload) => {
                    setCanRedo(payload);
                    return false;
                },
                LowPriority,
            ),
        );
    }, [editor, $updateToolbar]);

    const handleClearEditor = useCallback(() => {
        const confirmClear = window.confirm("Want to clear everything? 💥 (Don't worry, UNDO button has your back)");
        if (confirmClear) {
            editor.setEditorState(editor.parseEditorState('{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1}],"direction":null,"format":"","indent":0,"type":"root","version":1}}'));
        }
    }, [editor]);

    return (
        <div className="toolbar" id="toolbar" ref={toolbarRef}>
            <UpperCase_Button />
            <Lowercase_Button />
            <Capitalize_Button />

            <ButtonSpacer />

            <ButtonSmall tooltip="Bold"
                content={<b>B</b>} color="orange" style="outline" classString={(isBold ? ' active' : '')}
                onClick={() => {
                    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
                }}
            />
            <ButtonSmall tooltip="Italics"
                content={<FontAwesomeIcon icon={faItalic} />} color="orange" style="solid" classString={(isItalic ? ' active' : '')} onClick={() => {
                    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
                }}
            />
            <ButtonSmall tooltip="Underline"
                content={<FontAwesomeIcon icon={faUnderline} />} color="orange" style="outline" classString={(isUnderline ? ' active' : '')}
                onClick={() => {
                    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
                }}
            />
            <ButtonSmall tooltip="Strikethrough"
                content={<FontAwesomeIcon icon={faStrikethrough} />} classString={(isStrikethrough ? ' active' : '')} color="orange" style="outline"
                onClick={() => {
                    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough');
                }}
            />
            <ButtonSmall tooltip="Ordered List"
                content={<FontAwesomeIcon icon={faListOl} />} color="orange" style="solid"
                onClick={() => {
                    editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
                }}
            />
            <ButtonSmall tooltip="Unordered List"
                content={<FontAwesomeIcon icon={faListUl} />} color="orange" style="solid"
                onClick={() => {
                    editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
                }}
            />
            <RegexAddHyperlink />
            <RemoveHyperlink />
            <IncreaseFontSize_Button />
            <DecreaseFontSize_Button />

            <ButtonSpacer />

            <ColorPicker_Button />
            <ButtonSmall tooltip="Font Size Display" classString=" font-size-display"
                content={
                    <FontSizeInput
                        selectionFontSize={toolbarState.fontSizeInputValue.replace(/\D/g, '')}
                    />
                } color="red" style="outline"
            />
            <FontDropdown_Select />
            <CopySelectionToClipboard_Button />
            <CopyAllToClipboard_Button />
            <PasteFromClipBoard_Button />

            <ButtonSmall tooltip="Clear Editor"
                id="clear-editor" content={<FontAwesomeIcon icon={faTrashCan} />} color="red" style="outline"
                onClick={handleClearEditor}
            />

            <ButtonSmall tooltip="Left Align"
                id="left_align" content={<FontAwesomeIcon icon={faAlignLeft} flip="vertical" />} color="blue" style="solid"
                onClick={() => {
                    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left');
                }}
            />
            <ButtonSmall tooltip="Center Align"
                id="center_align" content={<FontAwesomeIcon icon={faAlignJustify} />} color="blue" style="solid"
                onClick={() => {
                    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center');
                }}
            />
            <ButtonSmall tooltip="Right Align"
                id="right_align" content={<FontAwesomeIcon icon={faAlignRight} flip="vertical" />} color="blue" style="solid"
                onClick={() => {
                    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right');
                }}
            />

            <ButtonSpacer />

            <ButtonSmall tooltip="Indent"
                id="indent" content={<FontAwesomeIcon icon={faIndent} />} color="orange" style="solid"
                onClick={() => {
                    editor.dispatchCommand(INDENT_CONTENT_COMMAND, undefined);
                }}
            />
            <ButtonSmall tooltip="Unindent"
                id="unindent" content={<FontAwesomeIcon icon={faIndent} flip="horizontal" />} color="orange" style="solid"
                onClick={() => {
                    editor.dispatchCommand(OUTDENT_CONTENT_COMMAND, undefined);
                }}
            />
            <PrintToConsoleButton />
            <ButtonSmall tooltip="Undo"
                content={<FontAwesomeIcon icon={faArrowRotateRight} flip="horizontal" />} color="green" style="solid"
                disabled={!canUndo}
                onClick={() => {
                    editor.dispatchCommand(UNDO_COMMAND, undefined);
                }}
            />
            <ButtonSmall tooltip="Redo"
                content={<FontAwesomeIcon icon={faArrowRotateRight} />} color="green" style="solid"
                disabled={!canRedo}
                onClick={() => {
                    editor.dispatchCommand(REDO_COMMAND, undefined);
                }}
            />

        </div>
    );
}