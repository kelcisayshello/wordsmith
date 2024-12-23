import { ButtonSpacer, ButtonSmall } from "./components/Buttons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faItalic, faUnderline, faStrikethrough, faListOl, faListUl, faLink, faLinkSlash, faIndent, faPlus, faMinus, faCopy, faArrowRotateRight, faTrashCan, faAlignLeft, faAlignJustify, faAlignRight } from '@fortawesome/free-solid-svg-icons';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $patchStyleText } from '@lexical/selection';
import { mergeRegister } from '@lexical/utils';
import { TOGGLE_LINK_COMMAND } from "@lexical/link";
import { INSERT_ORDERED_LIST_COMMAND, INSERT_UNORDERED_LIST_COMMAND } from "@lexical/list"
import FontDropdownSelect from "./components/FontDropdown";
import ColorPickerButton from "./components/ColorPicker"
import { useCallback, useEffect, useRef, useState } from 'react';
import "./css/toolbar.css"
import "./css/textformatting.css"
import {
    $createTextNode,
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
    OUTDENT_CONTENT_COMMAND
} from 'lexical';
import PrintToConsoleButton from "./components/PrintToConsole";
import PasteFromClipBoard from "./components/PasteFromClipboard";
import { CopySelectionToClipboard_Button, CopyAllToClipboard_Button } from "./components/CopyToClipboard";

export const showNotification = (notification: string, setNotification: React.Dispatch<React.SetStateAction<string | null>>) => {
    setNotification(notification);
    setTimeout(() => {
        setNotification(null);
    }, 3000); // 3 seconds
};

export default function Toolbar() {
    const [editor] = useLexicalComposerContext();
    const toolbarRef = useRef(null);
    const [canUndo, setCanUndo] = useState(false);
    const [canRedo, setCanRedo] = useState(false);
    const [isBold, setIsBold] = useState(false);
    const [isItalic, setIsItalic] = useState(false);
    const [isUnderline, setIsUnderline] = useState(false);
    const [isStrikethrough, setIsStrikethrough] = useState(false);
    const [copyMessage, setCopyMessage] = useState<string | null>(null);

    const showCopyMessage = (message: string) => {
        setCopyMessage(message);
        setTimeout(() => {
            setCopyMessage(null);
        }, 3000); // 3 seconds
    };

    const $updateToolbar = useCallback(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
            setIsBold(selection.hasFormat('bold'));
            setIsItalic(selection.hasFormat('italic'));
            setIsUnderline(selection.hasFormat('underline'));
            setIsStrikethrough(selection.hasFormat('strikethrough'));
        }
    }, []);

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

    /* ------------------------ Custom Toolbar Functions ------------------------ */
    const handleClearEditor = useCallback(() => {
        const confirmClear = window.confirm("Want to clear everything? 💥 (Don't worry, UNDO button has your back)");
        if (confirmClear) {
            editor.setEditorState(editor.parseEditorState('{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1}],"direction":null,"format":"","indent":0,"type":"root","version":1}}'));
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
                        return "";
                    }).join(" ");

                    selection.insertNodes([$createTextNode(capitalizedText)]);
                }
            }
        });
    }, [editor]);

    const handleAddRegexHyperlink = useCallback(() => {
        const url = window.prompt('Enter a valid URL:', '');

        if (url) { /* (1) check if URL exists */

            // (2) Regex to check if URL has http(s) OR is a subdomain URL in valid format
            const regexForURL = /^((https?:\/\/)([\da-z\.-]+)\.([a-z]{2,}|xn--[a-z0-9-]+)(\/.*)?|([\da-z\.-]+)\.([a-z]{2,}|xn--[a-z0-9-]+))$/i;

            if (regexForURL.test(url)) {
                editor.dispatchCommand(TOGGLE_LINK_COMMAND, url);
            } else {
                alert('Yikes . . . ! That is not a valid URL.');
                handleAddRegexHyperlink();
            }
        }
    }, [editor]);


    const handleRemoveHyperlink = useCallback(() => {
        editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    }, [editor]);

    const handleIncreaseFontSize = useCallback(() => {
        editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
                $patchStyleText(selection, {
                    'font-size': (currentStyleValue) => {
                        const currentSize = parseInt(currentStyleValue || '16', 10);
                        return `${currentSize + 2}px`;
                    },
                });
            }
        });
    }, [editor]);

    const handleDecreaseFontSize = useCallback(() => {
        editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
                $patchStyleText(selection, {
                    'font-size': (currentStyleValue) => {
                        const currentSize = parseInt(currentStyleValue || '16', 10);
                        return `${Math.max(8, currentSize - 2)}px`; // Min size 8px
                    },
                });
            }
        });
    }, [editor]);

    return (
        <div className="toolbar" id="toolbar" ref={toolbarRef}>
            <ButtonSmall tooltip="Uppercase"
                content={<p>A</p>} color="orange" style="solid"
                onClick={handleUppercase}
            />
            <ButtonSmall tooltip="Lowercase"
                content={<p>a</p>} color="orange" style="solid"
                onClick={handleLowercase}
            />
            <ButtonSmall tooltip="Capitalize"
                content={<p>Aa</p>} color="orange" style="outline"
                onClick={handleCapitalize}
            />

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
            <ButtonSmall tooltip="Add Hyperlink"
                content={<FontAwesomeIcon icon={faLink} />} color="blue" style="outline"
                onClick={handleAddRegexHyperlink}
            />
            <ButtonSmall tooltip="Remove Hyperlink"
                content={<FontAwesomeIcon icon={faLinkSlash} />} color="blue" style="outline"
                onClick={handleRemoveHyperlink}
            />
            <ButtonSmall tooltip="Undo"
                content={<FontAwesomeIcon icon={faArrowRotateRight} flip="horizontal" />} color="orange" style="solid"
                disabled={!canUndo}
                onClick={() => {
                    editor.dispatchCommand(UNDO_COMMAND, undefined);
                }}
            />
            <ButtonSmall tooltip="Redo"
                content={<FontAwesomeIcon icon={faArrowRotateRight} />} color="orange" style="solid"
                disabled={!canRedo}
                onClick={() => {
                    editor.dispatchCommand(REDO_COMMAND, undefined);
                }}
            />

            <ButtonSpacer />

            <ButtonSmall tooltip="Increase Font"
                content={<FontAwesomeIcon icon={faPlus} />} color="blue" style="solid"
                onClick={handleIncreaseFontSize}
            />
            <ButtonSmall tooltip="Decrease Font"
                content={<FontAwesomeIcon icon={faMinus} />} color="blue" style="solid"
                onClick={handleDecreaseFontSize}
            />

            <ColorPickerButton />
            <FontDropdownSelect />
            <CopySelectionToClipboard_Button />
            <CopyAllToClipboard_Button />
            <PasteFromClipBoard />

            {copyMessage && (<div className="clipboard-notification">{copyMessage}</div>)}

            <ButtonSmall tooltip="Clear Editor"
                id="clear editor" content={<FontAwesomeIcon icon={faTrashCan} />} color="red" style="outline"
                onClick={handleClearEditor}
            />

            {/* Line 2 of toolbar buttons */}

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

        </div>
    );
}