import { ParagraphNode, $createParagraphNode } from "lexical";

export class CustomParagraphNode extends ParagraphNode {
  static getType() {
    return "custom-paragraph";
  }

  static clone(node: CustomParagraphNode) {
    return new CustomParagraphNode(node.__key);
  }

  static importJSON(serializedNode: any) {
    const node = $createParagraphNode();
    node.setFormat(serializedNode.format);
    node.setIndent(serializedNode.indent);
    node.setDirection(serializedNode.direction);
    return node;
  }

  exportJSON() { // expected error on this line, you can ignore
    return {
      type: "custom-paragraph",
      format: this.getFormat(),
      indent: this.getIndent(),
      direction: this.getDirection(),
      children: [],
      version: 1,
    };
  }

  createDOM(config: any) {
    const dom = super.createDOM(config);
    dom.style.marginTop = "0";
    dom.style.marginBottom = "0";
    return dom;
  }
}