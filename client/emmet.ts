import * as vscode from "vscode";
import expand from "emmet";

export const allowedLangIds = [
  "javascript",
  "javascriptreact",
  "typescript",
  "typescriptreact",
  "regularjs",
];

export function isValidate() {
  let editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showInformationMessage("No editor is active");
    return false;
  }
  return allowedLangIds.includes(editor.document.languageId);
}

function fallbackTab(): Thenable<boolean | undefined> {
  return vscode.commands.executeCommand("tab");
}

// lookbehind to find the no empty character and then return the range
// from it to the pos parameter
function extractAbbr(doc: vscode.TextDocument, pos: vscode.Position) {
  let start = pos;
  let ch = "";
  do {
    start = start.translate(0, -1);
    ch = doc.getText(new vscode.Range(start, start.translate(0, 1)));
  } while (ch !== "" && ch !== " " && ch !== "\t");
  if (ch !== "") {
    start = start.translate(0, 1);
  }
  const range = new vscode.Range(start, pos);
  const text = doc.getText(range);
  return { range, text };
}

export function expandEmmet(): Thenable<boolean | undefined> {
  if (!isValidate()) {
    return fallbackTab();
  }

  const activeEditor = vscode.window.activeTextEditor;

  // VSCode 支持 [Multiple selections](https://code.visualstudio.com/docs/editor/codebasics#_multiple-selections-multicursor)
  // 如果处在多选模式下，则不进行展开逻辑
  // activeEditor.selection 表示当前主编辑选择区，!activeEditor.selection.isEmpty 表示当前未处在文字选择状态
  if (
    activeEditor?.selections.length !== 1 ||
    !activeEditor.selection.isEmpty
  ) {
    return fallbackTab();
  }

  const anchor = activeEditor.selection.anchor;
  // 如果 cursor 处在行首，则按下 tab 不需要进行展开
  if (anchor.character === 0) {
    return fallbackTab();
  }

  const prevAnchor = anchor.translate(0, -1);
  const prevText = activeEditor.document.getText(
    new vscode.Range(prevAnchor, anchor)
  );

  // 简单判断下当前 cursor 前一个位置上的字符是否是空白字符（未考虑所有空白字符），如果是的话
  // 就 fallbackTab
  if (prevText === " " || prevText === "\t") {
    return fallbackTab();
  }

  const abbr = extractAbbr(activeEditor.document, anchor);
  if (!/^[a-zA-Z0-9_\-*>=\[\]|'"]+$/.test(abbr.text)) {
    return fallbackTab();
  }

  const expanded = expand(abbr.text);
  if (!expanded) {
    return fallbackTab();
  }

  activeEditor.insertSnippet(new vscode.SnippetString(expanded), abbr.range);
  return Promise.resolve(false);
}
