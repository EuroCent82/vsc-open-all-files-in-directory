import * as vscode from 'vscode';
import * as commands from './commands';

export function activate(context: vscode.ExtensionContext) {
    const menus = [];

    menus.push(
        vscode.commands.registerCommand('vsc-oafid.currentOpenAllDirFiles', commands.openCurrentDirectoryFiles)
    );

    menus.push(
        vscode.commands.registerCommand('vsc-oafid.currentOpenAllDirFilesDepth', commands.openCurrentDirectoryFilesRecursive)
    );

    context.subscriptions.push(...menus);
}

export function deactivate() { }