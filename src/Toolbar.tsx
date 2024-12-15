import { ButtonSpacer, ButtonSmall } from "./components/Buttons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faItalic, faUnderline, faStrikethrough, faListOl, faListUl, faLink, faLinkSlash, faIndent, faPlus, faMinus, faBrush, faCopy, faArrowRotateRight, faTrashCan, faAlignLeft, faAlignJustify, faAlignRight, faTerminal } from '@fortawesome/free-solid-svg-icons';
import { faClipboard, faFileLines } from "@fortawesome/free-regular-svg-icons";
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $patchStyleText } from '@lexical/selection';
import { mergeRegister } from '@lexical/utils';
import { TOGGLE_LINK_COMMAND, $isLinkNode } from "@lexical/link"
import { useCallback, useEffect, useRef, useState } from 'react';
import "./css/toolbar.css"
import "./css/textformatting.css"
import {
    $getRoot,
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
    UNDO_COMMAND,
} from 'lexical';

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
            setIsLink(selection.isCollapsed() ? false : selection.getNodes().some($isLinkNode));
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
                console.log("Other Selection Type:", selection);
            }
        });
    }, [editor]);

    const handleClearEditor = useCallback(() => {
        const confirmClear = window.confirm("Just confirming that you'd like to clear the editor? No worries, you can always undo if needed. 🙂");
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

    const handleAddHyperlink = () => {
        const url = window.prompt('Enter valid URL:', '');

        if (url) {
            editor.dispatchCommand(TOGGLE_LINK_COMMAND, url);
        }
    };

    const handleRemoveHyperlink = () => {
        editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    };

    const copySelection = useCallback(() => {
        editor.getEditorState().read(() => {
            const selection = $getSelection();

            if ($isRangeSelection(selection)) {
                const selectedText = selection.getTextContent();
                navigator.clipboard.writeText(selectedText).then(() => {
                    showCopyMessage('Editor selection has successfully been copied to clipboard ✅');
                }).catch((error) => {
                    console.error('Failed to copy selection: ', error);
                    showCopyMessage('Failed to copy editor selection ❌');
                });
            } else {
                showCopyMessage('No selection to copy.');
            }
        });
    }, [editor]);


    const copyAll = useCallback(() => {
        editor.getEditorState().read(() => {
            const rootNode = $getRoot();
            let textContent = '';

            rootNode.getChildren().forEach(child => {
                if (typeof child.getTextContent === 'function') {
                    textContent += child.getTextContent() + '\n';
                }
            });

            navigator.clipboard.writeText(textContent).then(() => {
                showCopyMessage('Entire editor has successfully been copied to clipboard ✅');
            }).catch((error) => {
                console.error('Failed to copy all editor contents: ', error);
                showCopyMessage('Failed to copy all editor contents ❌');
            });
        });
    }, [editor]);

    const handlePaste = useCallback(async () => {
        try {
            const clipboardText = await navigator.clipboard.readText();

            editor.update(() => {
                editor.getEditorState().read(() => {
                    const selection = $getSelection();

                    if ($isRangeSelection(selection)) {
                        selection.insertNodes([$createTextNode(clipboardText)]);
                    } else {
                        const root = $getRoot();
                        if (root.getFirstChild() === null) {
                            const paragraph = $createTextNode("")
                            root.append(paragraph)
                        }
                        root.append($createTextNode(clipboardText));
                    }
                });
            });
        } catch (error) {
            console.error('Failed to read clipboard: ', error);
            // Handle the error (e.g., display an error message)
        }
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
                id="uppercase" content={<p>A</p>} color="orange" style="solid"
                onClick={handleUppercase}
            />
            <ButtonSmall tooltip="Lowercase"
                id="lowercase" content={<p>a</p>} color="orange" style="solid"
                onClick={handleLowercase}
            />
            <ButtonSmall tooltip="Capitalize"
                id="lowercase" content={<p>Aa</p>} color="orange" style="outline"
                onClick={handleCapitalize}
            />

            <ButtonSpacer />

            <ButtonSmall tooltip="Bold"
                id="bold" content={<b>B</b>} color="orange" style="outline" classString={(isBold ? ' active' : '')}
                onClick={() => {
                    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
                }}
            />
            <ButtonSmall tooltip="Italics"
                id="italics" content={<FontAwesomeIcon icon={faItalic} />} color="orange" style="solid" classString={(isItalic ? ' active' : '')} onClick={() => {
                    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
                }}
            />
            <ButtonSmall tooltip="Underline"
                id="underline" content={<FontAwesomeIcon icon={faUnderline} />} color="orange" style="outline" classString={(isUnderline ? ' active' : '')}
                onClick={() => {
                    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
                }}
            />
            <ButtonSmall tooltip="Strikethrough"
                id="strikethrough" content={<FontAwesomeIcon icon={faStrikethrough} />} classString={(isStrikethrough ? ' active' : '')} color="orange" style="outline"
                onClick={() => {
                    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough');
                }}
            />
            <ButtonSmall tooltip="Ordered List"
                id="ordered_list" classString=" grayscale" content={<FontAwesomeIcon icon={faListOl} />} color="orange" style="solid"
            />
            <ButtonSmall tooltip="Unordered List"
                classString=" grayscale" id="unordered_list" content={<FontAwesomeIcon icon={faListUl} />} color="orange" style="solid"
            />
            <ButtonSmall tooltip="Add Hyperlink"
                id="add_hyperlink" content={<FontAwesomeIcon icon={faLink} />} color="blue" style="outline"
                onClick={handleAddHyperlink}
                classString={(isLink ? ' active' : '')}
            />
            <ButtonSmall tooltip="Remove Hyperink"
                id="remove_hyperlink" content={<FontAwesomeIcon icon={faLinkSlash} />} disabled={!isLink} color="blue" style="outline"
                onClick={handleRemoveHyperlink}
            />
            <ButtonSmall tooltip="Undo"
                id="undo" content={<FontAwesomeIcon icon={faArrowRotateRight} flip="horizontal" />} color="orange" style="solid"
                disabled={!canUndo}
                onClick={() => {
                    editor.dispatchCommand(UNDO_COMMAND, undefined);
                }}
            />
            <ButtonSmall tooltip="Redo"
                id="redo" content={<FontAwesomeIcon icon={faArrowRotateRight} />} color="orange" style="solid"
                disabled={!canRedo}
                onClick={() => {
                    editor.dispatchCommand(REDO_COMMAND, undefined);
                }}
            />

            <ButtonSpacer />

            <ButtonSmall tooltip="Increase Font"
                id="increase_font" content={<FontAwesomeIcon icon={faPlus} />} color="blue" style="solid"
                onClick={handleIncreaseFontSize}
            />
            <ButtonSmall tooltip="Decrease Font"
                id="decrease_font" content={<FontAwesomeIcon icon={faMinus} />} color="blue" style="solid"
                onClick={handleDecreaseFontSize}
            />
            <ButtonSmall tooltip="Change Font Color"
                classString=" grayscale" id="change_font_color" content={<FontAwesomeIcon icon={faBrush} />} color="orange" style="outline"
            />
            <ButtonSmall tooltip="Select Font"
                classString=" grayscale" id="select_font" content={<p>?</p>} color="orange" style="solid"
            />
            <ButtonSmall tooltip="Copy Selection to Clipboard"
                id="copy" content={<FontAwesomeIcon icon={faFileLines} />} color="blue" style="outline"
                onClick={copySelection}
            />
            <ButtonSmall tooltip="Copy All to Clipboard"
                id="copy" content={<FontAwesomeIcon icon={faCopy} />} color="blue" style="outline"
                onClick={copyAll}
            />
            <ButtonSmall tooltip="Paste from Clipboard"
                id="paste" classString=" grayscale" content={<FontAwesomeIcon icon={faClipboard} />} color="blue" style="solid"
                onClick={handlePaste}
            />

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
                classString=" grayscale" id="indent" content={<FontAwesomeIcon icon={faIndent} />} color="orange" style="solid"
            />
            <ButtonSmall tooltip="Unindent"
                classString=" grayscale" id="unindent" content={<FontAwesomeIcon icon={faIndent} flip="horizontal" />} color="orange" style="solid"
            />
            <ButtonSmall tooltip="Print to Console"
                id="print_to_console" content={<FontAwesomeIcon icon={faTerminal} />} color="blue" style="outline"
                onClick={printSelection}
            />

        </div>
    );
}