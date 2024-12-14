import React from "react"

import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { HeadingNode } from "@lexical/rich-text"
import { CodeHighlightNode, CodeNode } from "@lexical/code"
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin"
import { ContentEditable } from "@lexical/react/LexicalContentEditable"
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary"

import "./css/Lexical.css"
import { placeholder } from "@babel/types"


interface LexicalProps { }

const initialConfig = {
  namespace: "Wordsmith",
  theme: {
    placeholder: 'placeholder-text'
  },
  onError: () => { },
  nodes: [HeadingNode, CodeHighlightNode, CodeNode]
}

export const Lexical: React.FC<LexicalProps> = React.memo(
  function Lexical({ }) {
    return (
      <LexicalComposer initialConfig={initialConfig}>
        <div className="rich-text-plugin">
          <RichTextPlugin
            contentEditable={<ContentEditable className="content-editable" />}
            ErrorBoundary={LexicalErrorBoundary}
            placeholder={<div className="placeholder-text">Please enter the text you would like to format. This could be anything from a simple sentence to a small document with multiple paragraphs . . .</div>}
          />
        </div>
      </LexicalComposer>
    )
  }
);