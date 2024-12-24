import { ParagraphNode } from "lexical";

export class CustomParagraphNode extends ParagraphNode {
  static getType() {
    return "custom-paragraph";
  }

  static clone(node: CustomParagraphNode) {
    return new CustomParagraphNode(node.__key);
  }

  createDOM(config: any) {
    const dom = super.createDOM(config);
    dom.style.marginTop = "0";      // Remove top margin
    dom.style.marginBottom = "0";   // Remove bottom margin
    return dom;
  }
}