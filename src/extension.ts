import * as vscode from 'vscode';
import * as commands from './commands';

export function activate(context: vscode.ExtensionContext) {
    const menus = [];

    menus.push(
        vscode.commands.registerCommand('vsc-open-all-files-in-directory.currentOpenAllDirFiles', commands.openCurrentDirectoryFiles)
    );

    menus.push(
        vscode.commands.registerCommand('vsc-open-all-files-in-directory.currentOpenAllDirFilesDepth', commands.openCurrentDirectoryFilesRecursive)
    );

    context.subscriptions.push(...menus);
}

export function deactivate() { }