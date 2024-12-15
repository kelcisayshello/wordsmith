import { ButtonSpacer, ButtonSmall } from "./components/Buttons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faItalic, faUnderline, faStrikethrough, faCode, faListOl, faListUl, faLink, faLinkSlash, faIndent, faPlus, faMinus, faBrush, faCopy, faArrowRotateRight, faTrashCan, faAlignLeft, faAlignJustify, faAlignRight, faTerminal } from '@fortawesome/free-solid-svg-icons';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $patchStyleText } from '@lexical/selection';
import { TOGGLE_LINK_COMMAND, $isLinkNode } from '@lexical/link'
import { mergeRegister } from '@lexical/utils';
import {
    $getRoot,
    $createParagraphNode,
    $createTextNode,
    $isTextNode,
    $getSelection,
    $isRangeSelection,
    CAN_REDO_COMMAND,
    CAN_UNDO_COMMAND,
    FORMAT_ELEMENT_COMMAND,
    FORMAT_TEXT_COMMAND,
    REDO_COMMAND,
    SELECTION_CHANGE_COMMAND,
    UNDO_COMMAND
} from 'lexical';
import { useCallback, useEffect, useRef, useState } from 'react';

const LowPriority = 1;

import "./css/toolbar.css"
import "./css/textformatting.css"

export default function Toolbar() {
    const [editor] = useLexicalComposerContext();
    const toolbarRef = useRef(null);
    const [canUndo, setCanUndo] = useState(false);
    const [canRedo, setCanRedo] = useState(false);
    const [isBold, setIsBold] = useState(false);
    const [isItalic, setIsItalic] = useState(false);
    const [isUnderline, setIsUnderline] = useState(false);
    const [isStrikethrough, setIsStrikethrough] = useState(false);
    const [isLink, setIsLink] = useState(false);

    const $updateToolbar = useCallback(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
            setIsBold(selection.hasFormat('bold'));
            setIsItalic(selection.hasFormat('italic'));
            setIsUnderline(selection.hasFormat('underline'));
            setIsStrikethrough(selection.hasFormat('strikethrough'));
            setIsLink(selection.isCollapsed() ? false : selection.getNodes().some($isLinkNode));
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

    /* ------------------------ Custom Toolbar Functions ------------------------ */
    const printSelection = useCallback(() => {
        editor.getEditorState().read(() => {
            const selection = $getSelection();

            if (selection === null) {
                console.log("No selection");
                return;
            }

            if ($isRangeSelection(selection)) {
                console.log("----- $isRangeSelection -----");
                console.log("selection.anchor \t", selection.anchor.getNode());
                console.log("selection.anchor.offset \t", selection.anchor.offset);
                console.log("selection.focus.getNode() \t", selection.focus.getNode());
                console.log("selection.focus.offset \t", selection.focus.offset);
                console.log("selection.getTextContent() \t", selection.getTextContent());
                const nodes = selection.getNodes()
                console.log("Nodes", nodes)
                nodes.forEach(node => {
                    if ($isTextNode(node)) {
                        console.log("Text Node Content", node.getTextContent())
                    }
                })
            } else {
                console.log("Other Selection Type:", selection); // Log other selection types
            }
        });
    }, [editor]);

    const handleClearEditor = useCallback(() => { // Use useCallback
        const confirmClear = window.confirm("Just confirming: you'd like to clear the editor? No worries, you can always undo if needed. 🙂"); // Show confirmation dialog
        if (confirmClear) {
            editor.update(() => {
                const root = $getRoot();
                root.clear();
                const paragraphNode = $createParagraphNode();
                paragraphNode.append($createTextNode(''));
                root.append(paragraphNode);
            });
        }
    }, [editor]);

    const handleUppercase = () => {
        editor.update(() => {
            const selection = $getSelection()
            if ($isRangeSelection(selection)) {
                $patchStyleText(selection, { "text-transform": "uppercase" })
            }
        })
    }

    const handleLowercase = () => {
        editor.update(() => {
            const selection = $getSelection()
            if ($isRangeSelection(selection)) {
                $patchStyleText(selection, { "text-transform": "lowercase" })
            }
        })
    }

    const handleCapitalize = useCallback(() => {
        editor.update(() => {
            const selection = $getSelection();

            if ($isRangeSelection(selection)) {
                const selectedText = selection.getTextContent();

                if (selectedText) {
                    const capitalizedText = selectedText.split(/\s+/).map(word => {
                        if (word.length > 0) {
                            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
                        }
                        return ""; // Handle empty words (e.g., multiple spaces)
                    }).join(" ");

                    selection.insertNodes([$createTextNode(capitalizedText)]);
                }
            }
        });
    }, [editor]);

    return (
        <div className="toolbar" id="toolbar" ref={toolbarRef}>
            <ButtonSmall tooltip="Uppercase" id="uppercase" content={<p>A</p>} color="orange" style="solid" onClick={handleUppercase} />
            <ButtonSmall tooltip="Lowercase" id="lowercase" content={<p>a</p>} color="orange" style="solid" onClick={handleLowercase} />
            <ButtonSmall tooltip="Capitalize" id="lowercase" content={<p>Aa</p>} color="orange" style="outline" onClick={handleCapitalize} />

            <ButtonSpacer />

            <ButtonSmall tooltip="Bold" id="bold" content={<b>B</b>} color="orange" style="outline" classString={(isBold ? ' active' : '')} onClick={() => {
                editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
            }} />
            <ButtonSmall tooltip="Italics" id="italics" content={<FontAwesomeIcon icon={faItalic} />} color="orange" style="solid" classString={(isItalic ? ' active' : '')} onClick={() => {
                editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
            }} />
            <ButtonSmall tooltip="Underline" id="underline" content={<FontAwesomeIcon icon={faUnderline} />} color="orange" style="outline" classString={(isUnderline ? ' active' : '')} onClick={() => {
                editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
            }} />
            <ButtonSmall classString={(isStrikethrough ? ' active' : '')} tooltip="Strikethrough" id="strikethrough" content={<FontAwesomeIcon icon={faStrikethrough} />} color="orange" style="outline" onClick={() => {
                editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough');
            }} />
            <ButtonSmall classString=" grayscale" tooltip="Ordered List" id="ordered_list" content={<FontAwesomeIcon icon={faListOl} />} color="orange" style="solid" />
            <ButtonSmall classString=" grayscale" tooltip="Unordered List" id="unordered_list" content={<FontAwesomeIcon icon={faListUl} />} color="orange" style="solid" />
            <ButtonSmall
                tooltip="Add Hyperlink" id="add_hyperlink"
                content={<FontAwesomeIcon icon={faLink} />}
                onClick={() => {
                    const url = window.prompt('Enter valid URL:', '');
                    if (url) {
                        editor.dispatchCommand(TOGGLE_LINK_COMMAND, url);
                    }
                }}
                classString={(isLink ? ' active' : '')}
            />
            <ButtonSmall
                tooltip="Remove Hyperink" id="remove_hyperlink"
                content={<FontAwesomeIcon icon={faLinkSlash} />}
                onClick={() => {
                    editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
                }}
                disabled={!isLink}
            />
            <ButtonSmall classString=" grayscale" tooltip="Indent" id="indent" content={<FontAwesomeIcon icon={faIndent} />} color="orange" style="solid" />
            <ButtonSmall classString=" grayscale" tooltip="Unindent" id="unindent" content={<FontAwesomeIcon icon={faIndent} flip="horizontal" />} color="orange" style="solid" />

            <ButtonSpacer />

            <ButtonSmall classString=" grayscale" tooltip="Increase Font" id="increase_font" content={<FontAwesomeIcon icon={faPlus} />} color="blue" style="solid" />
            <ButtonSmall classString=" grayscale" tooltip="Decrease Font" id="decrease_font" content={<FontAwesomeIcon icon={faMinus} />} color="blue" style="solid" />
            <ButtonSmall classString=" grayscale" tooltip="Change Font Color" id="change_font_color" content={<FontAwesomeIcon icon={faBrush} />} color="orange" style="outline" />

            <ButtonSmall classString=" grayscale" tooltip="Code Block" id="code_block" content={<FontAwesomeIcon icon={faCode} />} color="orange" style="solid" />
            <ButtonSmall tooltip="Copy" id="copy" content={<FontAwesomeIcon icon={faCopy} />} color="blue" style="outline" />
            <ButtonSmall tooltip="Undo" id="undo" content={<FontAwesomeIcon icon={faArrowRotateRight} flip="horizontal" />} color="orange" style="outline" disabled={!canUndo} onClick={() => {
                editor.dispatchCommand(UNDO_COMMAND, undefined);
            }} />
            <ButtonSmall tooltip="Redo" id="redo" content={<FontAwesomeIcon icon={faArrowRotateRight} />} color="orange" style="outline" disabled={!canRedo} onClick={() => {
                editor.dispatchCommand(REDO_COMMAND, undefined);
            }} />
            <ButtonSmall tooltip="Clear Editor" id="clear editor" content={<FontAwesomeIcon icon={faTrashCan} />} color="red" style="outline" onClick={handleClearEditor} />
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

            <ButtonSmall tooltip="Print to Console" id="print_to_console" content={<FontAwesomeIcon icon={faTerminal} />} color="blue" style="outline" onClick={printSelection} />

        </div>
    );
}