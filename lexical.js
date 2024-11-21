const editor = new LexicalEditor();
editor.getRoot().setChildren([LexicalText.create("Start typing here")]);

LexicalEditor.render(editor, document.getElementById("editor"));
