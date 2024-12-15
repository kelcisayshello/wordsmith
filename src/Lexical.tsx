import "./css/lexical.css";
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import {
    ParagraphNode,
    TextNode,
} from 'lexical';
import WordsmithTheme from './components/WordsmithTheme';
import Toolbar from "./Toolbar";
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { ListItemNode, ListNode } from '@lexical/list';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table';
import { LinkNode, AutoLinkNode } from '@lexical/link';
import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { HashtagNode } from '@lexical/hashtag';
import { ExtendedTextNode } from "./plugins/ExtendedTextNode";

const placeholder = 'Please enter some text here . . .';

const editorConfig = {
    namespace: 'Wordsmith',
    nodes: [
        ParagraphNode,
        TextNode,
        ExtendedTextNode,
        {
            replace: TextNode,
            with: (node: TextNode) => new ExtendedTextNode(node.__text),
            withKlass: ExtendedTextNode,
        },
        ListNode,
        ListItemNode,
        QuoteNode,
        TableCellNode,
        TableNode,
        TableRowNode,
        HeadingNode,
        LinkNode,
        AutoLinkNode,
        CodeHighlightNode,
        CodeNode,
        HashtagNode
    ],
    onError(error: Error) {
        throw error;
    },
    theme: WordsmithTheme
};

export default function Lexical() {
    return (
        <LexicalComposer initialConfig={editorConfig}>
            <div className="lexical-container">
                <Toolbar />
                <div className="rich-text-plugin">
                    <RichTextPlugin
                        contentEditable={
                            <ContentEditable
                                className="content-editable"
                                aria-placeholder={placeholder}
                                placeholder={
                                    <div className="placeholder-text">{placeholder}</div>
                                }
                            />
                        }
                        ErrorBoundary={LexicalErrorBoundary}
                    />
                    <HistoryPlugin />
                    <AutoFocusPlugin />
                    <ListPlugin />
                </div>
            </div>
        </LexicalComposer>
    );
}