// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { Formatter, LocatableError } from "regularjs-beautify-core";
import { format, scan } from "regularjs-beautify-dozen";

const handleError = (e: Error) => {
  if (e instanceof LocatableError) {
    vscode.window.showErrorMessage(e.message, "goto").then(() => {
      const editor = vscode.window.activeTextEditor;
      if (editor) {
        const range = editor.document.lineAt(e.loc.start.line - 1).range;
        editor.selection = new vscode.Selection(range.start, range.end);
        editor.revealRange(range);
      }
    });
  } else {
    vscode.window.showErrorMessage(e.message);
  }
};

// format selection
vscode.languages.registerDocumentRangeFormattingEditProvider("javascript", {
  provideDocumentRangeFormattingEdits(
    document: vscode.TextDocument,
    range: vscode.Range
  ): vscode.TextEdit[] {
    const code = document.getText(range);
    const space = code.match(/^\s*/);
    let indent = 2;
    if (space && space[0]) {
      indent = space[0].length & ~1;
    }
    const formatter = new Formatter(
      code,
      document.fileName,
      range.start.line + 1,
      { baseIndent: indent, printWidth: 80 }
    );
    try {
      const output = formatter.run();
      return [vscode.TextEdit.replace(range, output)];
    } catch (e) {
      handleError(e);
    }
    return [];
  }
});

// format whole file
vscode.languages.registerDocumentFormattingEditProvider("javascript", {
  provideDocumentFormattingEdits(
    document: vscode.TextDocument
  ): vscode.ProviderResult<vscode.TextEdit[]> {
    try {
      const code = document.getText();
      const cooked = format("", code);
      const range = new vscode.Range(
        document.positionAt(0),
        document.positionAt(code.length)
      );
      return [vscode.TextEdit.replace(range, cooked)];
    } catch (e) {
      handleError(e);
    }
    return [];
  }
});

// folding
vscode.languages.registerFoldingRangeProvider("javascript", {
  provideFoldingRanges(
    document: vscode.TextDocument
  ): vscode.ProviderResult<vscode.FoldingRange[]> {
    const code = document.getText();
    const ranges = scan(code);
    return ranges
      .map(([start, end]) => ({
        start: start - 1,
        end: end - 1
      }))
      .filter(r => r.start !== r.end);
  }
});

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(_: vscode.ExtensionContext) {}

// this method is called when your extension is deactivated
export function deactivate() {}
