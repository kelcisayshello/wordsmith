import { ButtonSpacer, ButtonDropdown, ButtonSmall } from "./Buttons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faItalic, faUnderline, faStrikethrough, faCode, faListOl, faListUl, faLink, faLinkSlash, faIndent, faPlus, faMinus, faBrush, faCopy, faArrowRotateRight, faTrashCan, faAlignLeft, faAlignJustify, faAlignRight } from '@fortawesome/free-solid-svg-icons';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { mergeRegister } from '@lexical/utils';
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
} from 'lexical';
import { useCallback, useEffect, useRef, useState } from 'react';

const LowPriority = 1;

import "../css/toolbar.css"
import "../css/textformatting.css"

export default function Toolbar() {
    const [editor] = useLexicalComposerContext();
    const toolbarRef = useRef(null);
    const [canUndo, setCanUndo] = useState(false);
    const [canRedo, setCanRedo] = useState(false);
    const [isBold, setIsBold] = useState(false);
    const [isItalic, setIsItalic] = useState(false);
    const [isUnderline, setIsUnderline] = useState(false);
    const [isStrikethrough, setIsStrikethrough] = useState(false);

    const $updateToolbar = useCallback(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
            // Update text format
            setIsBold(selection.hasFormat('bold'));
            setIsItalic(selection.hasFormat('italic'));
            setIsUnderline(selection.hasFormat('underline'));
            setIsStrikethrough(selection.hasFormat('strikethrough'));
        }
    }, []);

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

    return (
        <div className="toolbar" id="toolbar" ref={toolbarRef}>
            <ButtonSmall tooltip="Uppercase" id="uppercase" content={<p>A</p>} color="orange" style="solid" />
            <ButtonSmall tooltip="Lowercase" id="lowercase" content={<p>a</p>} color="orange" style="solid" />
            <ButtonSmall tooltip="Capitalize" id="lowercase" content={<p>Aa</p>} color="orange" style="outline" />

            <ButtonSpacer />

            <ButtonSmall tooltip="Bold" id="bold" content={<p><b>B</b></p>} color="orange" style="outline" classString={(isBold ? 'active' : '')} onClick={() => {
                editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
            }} />
            <ButtonSmall tooltip="Italics" id="italics" content={<FontAwesomeIcon icon={faItalic} />} color="orange" style="solid" classString={(isItalic ? 'active' : '')} onClick={() => {
                editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
            }} />
            <ButtonSmall tooltip="Underline" id="underline" content={<FontAwesomeIcon icon={faUnderline} />} color="orange" style="outline" classString={(isUnderline ? 'active' : '')} onClick={() => {
                editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
            }} />
            <ButtonSmall classString={(isStrikethrough ? 'active' : '')} tooltip="Strikethrough" id="strikethrough" content={<FontAwesomeIcon icon={faStrikethrough} />} color="orange" style="outline" onClick={() => {
                editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough');
            }} />
            <ButtonSmall tooltip="Ordered List" id="ordered_list" content={<FontAwesomeIcon icon={faListOl} />} color="orange" style="solid" />
            <ButtonSmall tooltip="Unordered List" id="unordered_list" content={<FontAwesomeIcon icon={faListUl} />} color="orange" style="solid" />
            <ButtonSmall tooltip="Add Hyperlink" id="add_hyperlink" content={<FontAwesomeIcon icon={faLink} />} color="blue" style="outline" />
            <ButtonSmall tooltip="Remove Hyperlink" id="remove_hyperlink" content={<FontAwesomeIcon icon={faLinkSlash} />} color="blue" style="outline" />
            <ButtonSmall tooltip="Indent" id="indent" content={<FontAwesomeIcon icon={faIndent} />} color="orange" style="solid" />
            <ButtonSmall tooltip="Unindent" id="unindent" content={<FontAwesomeIcon icon={faIndent} flip="horizontal" />} color="orange" style="solid" />

            <ButtonSpacer />

            <ButtonSmall tooltip="Increase Font" id="increase_font" content={<FontAwesomeIcon icon={faPlus} />} color="blue" style="solid" />
            <ButtonSmall tooltip="Decrease Font" id="decrease_font" content={<FontAwesomeIcon icon={faMinus} />} color="blue" style="solid" />
            <ButtonSmall tooltip="Change Font Color" id="change_font_color" content={<FontAwesomeIcon icon={faBrush} />} color="orange" style="outline" />

            <ButtonSmall tooltip="Code Block" id="code_block" content={<FontAwesomeIcon icon={faCode} />} color="orange" style="solid" />
            <ButtonSmall tooltip="Copy" id="copy" content={<FontAwesomeIcon icon={faCopy} />} color="blue" style="outline" />
            <ButtonSmall tooltip="Undo" id="undo" content={<FontAwesomeIcon icon={faArrowRotateRight} flip="horizontal" />} color="orange" style="outline" disabled={!canUndo} onClick={() => {
                editor.dispatchCommand(UNDO_COMMAND, undefined);
            }} />
            <ButtonSmall tooltip="Redo" id="redo" content={<FontAwesomeIcon icon={faArrowRotateRight} />} color="orange" style="outline" disabled={!canRedo} onClick={() => {
                editor.dispatchCommand(REDO_COMMAND, undefined);
            }} />
            <ButtonSmall tooltip="Clear Editor" id="clear editor" content={<FontAwesomeIcon icon={faTrashCan} />} color="blue" style="outline" />
            <ButtonSmall tooltip="Left Align" id="left_align" content={<FontAwesomeIcon icon={faAlignLeft} flip="vertical" />} color="blue" style="solid" onClick={() => {
                editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left');
            }} />
            <ButtonSmall tooltip="Center Align" id="center_align" content={<FontAwesomeIcon icon={faAlignJustify} />} color="blue" style="solid" onClick={() => {
                editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center');
            }} />
            <ButtonSmall tooltip="Right Align" id="right_align" content={<FontAwesomeIcon icon={faAlignRight} flip="vertical" />} color="blue" style="solid" onClick={() => {
                editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right');
            }} />

            <ButtonSpacer />

        </div>
    );
}