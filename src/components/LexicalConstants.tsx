import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBold,
    faItalic,
    faUnderline,
    faStrikethrough,
    faSuperscript,
    faSubscript,
    faHighlighter, // If you have a highlighter icon in Font Awesome
    faCode,
    faAlignLeft,
    faAlignCenter,
    faAlignRight,
    faAlignJustify,
    faUndo,
    faRedo,
} from '@fortawesome/free-solid-svg-icons'; // Or appropriate icon pack

export enum RichTextAction {
    Bold = "bold",
    Italics = "italics",
    Underline = "underline",
    Strikethrough = "strikethrough",
    Superscript = "superscript",
    Subscript = "subscript",
    Highlight = "highlight",
    Code = "code",
    LeftAlign = "leftAlign",
    CenterAlign = "centerAlign",
    RightAlign = "rightAlign",
    JustifyAlign = "justifyAlign",
    Divider = "divider",
    Undo = "undo",
    Redo = "redo",
}

export const RICH_TEXT_OPTIONS = [
    { id: RichTextAction.Bold, icon: <FontAwesomeIcon icon={faBold} />, label: "Bold" },
    { id: RichTextAction.Italics, icon: <FontAwesomeIcon icon={faItalic} />, label: "Italics" },
    { id: RichTextAction.Underline, icon: <FontAwesomeIcon icon={faUnderline} />, label: "Underline" },
    { id: RichTextAction.Divider },
    {
        id: RichTextAction.Highlight,
        icon: <FontAwesomeIcon icon={faHighlighter} />,
        label: "Highlight",
    },
    {
        id: RichTextAction.Strikethrough,
        icon: <FontAwesomeIcon icon={faStrikethrough} />,
        label: "Strikethrough",
    },
    {
        id: RichTextAction.Superscript,
        icon: <FontAwesomeIcon icon={faSuperscript} />,
        label: "Superscript",
    },
    {
        id: RichTextAction.Subscript,
        icon: <FontAwesomeIcon icon={faSubscript} />,
        label: "Subscript",
    },
    {
        id: RichTextAction.Code,
        icon: <FontAwesomeIcon icon={faCode} />,
        label: "Code",
    },
    { id: RichTextAction.Divider },
    {
        id: RichTextAction.LeftAlign,
        icon: <FontAwesomeIcon icon={faAlignLeft} />,
        label: "Align Left",
    },
    {
        id: RichTextAction.CenterAlign,
        icon: <FontAwesomeIcon icon={faAlignCenter} />,
        label: "Align Center",
    },
    {
        id: RichTextAction.RightAlign,
        icon: <FontAwesomeIcon icon={faAlignRight} />,
        label: "Align Right",
    },
    {
        id: RichTextAction.JustifyAlign,
        icon: <FontAwesomeIcon icon={faAlignJustify} />,
        label: "Align Justify",
    },
    { id: RichTextAction.Divider },
    {
        id: RichTextAction.Undo,
        icon: <FontAwesomeIcon icon={faUndo} />,
        label: "Undo",
    },
    {
        id: RichTextAction.Redo,
        icon: <FontAwesomeIcon icon={faRedo} />,
        label: "Redo",
    },
];

export const LOW_PRIORIRTY = 1;
export const HEADINGS = ["h1", "h2", "h3", "h4", "h5", "h6"];