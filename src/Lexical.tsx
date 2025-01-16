// Lexical.js
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import LexicalClickableLinkPlugin from '@lexical/react/LexicalClickableLinkPlugin';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { LinkNode, AutoLinkNode } from '@lexical/link';
import { ListItemNode, ListNode } from '@lexical/list';
import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table';
import { HashtagNode } from '@lexical/hashtag';
import {
    ParagraphNode,
    TextNode
} from 'lexical';

// Components
import WordsmithTheme from './plugins/WordsmithTheme';
import { TabIndentationPlugin } from "./plugins/LexicalTabIndentation"
import { ExtendedTextNode } from "./plugins/ExtendedTextNode";
import { CustomParagraphNode } from './plugins/CustomParagraphNode';
import Toolbar from "./Toolbar";
import { ToolbarContext } from './plugins/ToolbarContext';

const placeholder = 'Please enter some text here . . .';

const editorConfig = {
    namespace: 'Wordsmith',
    nodes: [
        CustomParagraphNode,
        {
            replace: ParagraphNode,
            with: (node: any) => {
                return new CustomParagraphNode();
            }
        },
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
                <ToolbarContext>
                    <Toolbar />
                </ToolbarContext>
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
                    <LinkPlugin />
                    <LexicalClickableLinkPlugin />
                    <TabIndentationPlugin />
                </div>
            </div>
        </LexicalComposer>
    );
}