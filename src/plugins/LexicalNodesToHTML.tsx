import { $isElementNode, $isTextNode } from 'lexical';
import { $isListNode, ListNode } from "@lexical/list"
import { $isLinkNode, LinkNode } from "@lexical/link"
import { HeadingNode, $isHeadingNode } from '@lexical/rich-text';

function convertLexicalNodesToHTML(nodes: LexicalNode[]): string { // Correct type here
    let html = '';

    for (const node of nodes) {
        if ($isTextNode(node)) {
            let textContent = node.getTextContent();
            let formattedText = textContent;

            if (node.hasFormat('bold')) {
                formattedText = `<strong>${formattedText}</strong>`;
            }
            if (node.hasFormat('italic')) {
                formattedText = `<em>${formattedText}</em>`;
            }
            if (node.hasFormat('underline')) {
                formattedText = `<u>${formattedText}</u>`;
            }
            if (node.hasFormat('strikethrough')) {
                formattedText = `<strike>${formattedText}</strike>`;
            }

            html += formattedText;
        } else if ($isLinkNode(node)) {
            const linkNode = node as LinkNode;
            html += `<a href="${linkNode.getURL()}">${convertLexicalNodesToHTML(linkNode.getChildren())}</a>`;
        } else if ($isListNode(node)) {
            const listNode = node as ListNode;
            const listType = listNode.getListType();
            html += `<${listType === 'bullet' ? 'ul' : 'ol'}>${convertLexicalNodesToHTML(listNode.getChildren())}</${listType === 'bullet' ? 'ul' : 'ol'}>`;
        } else if ($isHeadingNode(node)) {
            const headingNode = node as HeadingNode;
            html += `<h${headingNode.getTag()}>${convertLexicalNodesToHTML(headingNode.getChildren())}</h${headingNode.getTag()}>`;
        } else if ($isElementNode(node)) {
            html += `<div>${convertLexicalNodesToHTML(node.getChildren())}</div>`;
        }
    }
    return html;
}


export default convertLexicalNodesToHTML;