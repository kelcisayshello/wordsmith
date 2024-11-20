/* -------------------------- VARIABLE DEFINITIONS -------------------------- */
let createHyperlinkButton = document.getElementById("createlink");
let removeHyperlinkButton = document.getElementById("removelink");
let fontList = ["Google Sans", "Arial", "Times New Roman", "Monaco"];
let undoButton = document.getElementById("undo");
let redoButton = document.getElementById("redo");
let clearButton = document.getElementById("trash");
let copyButton = document.getElementById("copy");

let editor = document.getElementById("editor");

let fontName = document.getElementById("fontselector");
let noParametersButtons = document.querySelectorAll(".no-parameter-button");
let parametersButtons = document.querySelectorAll(".parameter-button");

/* ------------------------ MODIFY TEXT FUNCTIONALITY ----------------------- */
const initializer = () => {
  fontList.map((value) => {
    let option = document.createElement("option");
    option.value = value;
    option.innerHTML = value;
    fontName.appendChild(option);
  });
};

window.onload = initializer();

// (deprecated) execCommand runs function on selected text
const modifyText = (command, defaultUi, value) => {
  document.execCommand(command, defaultUi, value);
};

noParametersButtons.forEach((button) => {
  button.addEventListener("click", () => {
    modifyText(button.id, false, null);
  });
});

parametersButtons.forEach((button) => {
  button.addEventListener("change", () => {
    modifyText(button.id, false, button.value);
  });
});

/* --------------------------- HYPERLINK FUNCTIONS -------------------------- */
createHyperlinkButton.addEventListener("click", () => {
  const enteredUrl = prompt("Enter a valid URL:");
  // checks if URL starts with http (case-insensitive)
  if (/^(http|https):\/\/[^\s]+/i.test(enteredUrl)) {
    modifyText(createHyperlinkButton.id, false, enteredUrl);
  } else {
    // add http:// if missing
    const correctedUrl = "https://" + enteredUrl;
    modifyText(createHyperlinkButton.id, false, enteredUrl);
  }

  console.log("Hyperlink successfully created.");
});

removeHyperlinkButton.addEventListener("click", () => {
  const userSelection = window.getSelection();
  const range = userSelection.getRangeAt(0);
  const containerElement = range.commonAncestorContainer;

  let hasLink = false;
  let linkElement = null;
  let currentElement = containerElement;
  while (currentElement) {
    if (
      currentElement.tagName === "A" ||
      /^(http|https):\/\/[^\s]+/i.test(currentElement.href)
    ) {
      hasLink = true;
      linkElement = currentElement;
      break;
    }
    currentElement = currentElement.parentNode;
  }

  if (hasLink) {
    const linkText = linkElement.textContent;
    const textNode = document.createTextNode(linkText);
    linkElement.parentNode.replaceChild(textNode, linkElement);
    console.log("Hyperlink has been removed.");
  } else {
    console.log("Selected text does not contain a hyperlink.");
  }
});

/* ------------------------------ CLEAR EDITOR ------------------------------ */
clearButton.addEventListener("click", () => {
  if (clearButton) {
    clearButton.onclick = function () {
      let choice = confirm(
        "Hey! 👋 Are you sure you would like to clear all text input from the editor?"
      );
      if (choice) {
        editor.innerHTML = "";
        console.log("Editor has been cleared successfully.");
      }
    };
  }
});

/* ------------------------------ COPY FUNCTION ----------------------------- */
copyButton.addEventListener("click", () => {
  const range = document.createRange();
  range.selectNodeContents(editor);
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
  document.execCommand("copy");
  console.log("Editor successfully copied.")
});
