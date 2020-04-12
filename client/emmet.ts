import * as vscode from "vscode";
import expand from "emmet";

// 补全功能可以通过 [registerCompletionItemProvider](https://code.visualstudio.com/api/references/vscode-api#2771)
// 向 VSCode 注册一个具有补全功能的 Provider，并提供预期的 triggerCharacters，当用户输入命中了 triggerCharacters 时会由 VSCode
// 内部逻辑自动调用之前提供的 Provider 相关功能

// 按下 tab 进行补全的功能，实现方式与上述方案完全不同，所以为了以后可以快速区分这两个功能
// 最好使用「补全」和「展开」来进一步区分两者

//「展开」的功能，需要经过这几步来实现：
// 1. 插件需要能够使得自身预先被 VSCode 激活，比如通过 `activationEvents` 来声明
// 2. 插件需要注册一个用于表示展开的命令，通过 `vscode.commands.registerCommand`
// 3. 在 `keybindings` 中声明将 tab 键绑定到上一步注册的命令

// 这样在用户输入 tab 的时候，就会由 VSCode 根据按键绑定自动调用到插件代码，插件逻辑将被一个事件绑定函数的回调所唤起
// 在这个回调的参数中没有携带任何上下文信息，因此需要借助挂于 vscode 对象上的方法获取相应所需的信息

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
  if (!/^[a-zA-Z0-9_\-*>=\[\]|'"+]+$/.test(abbr.text)) {
    return fallbackTab();
  }

  const expanded = expand(abbr.text);
  if (!expanded) {
    return fallbackTab();
  }

  activeEditor.insertSnippet(new vscode.SnippetString(expanded), abbr.range);
  return Promise.resolve(false);
}
