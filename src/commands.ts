import { Settings } from './types';
import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { extensionName } from './const';

export const openCurrentDirectoryFiles = (uri: vscode.Uri) => {
    if (typeof uri === 'undefined') {
        vscode.window.showErrorMessage('Öffnen Sie eine Datei in diesem Ordner.');
        //vscode.window.showErrorMessage('Open a File in this Folder.');
        return;
    }

    openAllFilesInDirectory(uri);
};

export const openCurrentDirectoryFilesRecursive = (uri: vscode.Uri) => {
    if (typeof uri === 'undefined') {
        vscode.window.showErrorMessage('Öffnen Sie eine Datei in diesem Ordner.');
        //vscode.window.showErrorMessage('Open a File in this Folder.');
        return;
    }

    openAllFilesInDirectory(uri, true);
};

function openAllFilesInDirectory(uri: vscode.Uri, recursive: boolean = false, depth = 0, fileCount = 0) {
    const isDirectory: boolean = fs.statSync(uri.fsPath).isDirectory();
    let { dir: parentDir } = path.parse(uri.fsPath);
    const config: Settings = vscode.workspace.getConfiguration().get(extensionName) as Settings;
    let isError: boolean = false;

    if (depth > config.maximumFolderDepth) {
        isError = true;
        vscode.window.showErrorMessage(`${depth} Unterordner können nicht geöffnet werden. Maximale Tiefe/Unterordner ist: ${config.maximumFolderDepth}`);
        //vscode.window.showErrorMessage(`Can't not open ${depth} Sub Folders. Maximum Depth/Subfolders is: ${config.maximumFolderDepth}`);
        return;
    }

    if (fileCount > config.maximumFiles) {
        isError = true;
        let fileCountName = "Datei";
        //let fileCountName = "File";

        if (fileCount > 1 || fileCount == 0) {
            fileCountName = "Dateien";
            //fileCountName = "Files";
        }

        vscode.window.showErrorMessage(`Kann ${fileCount} ${fileCountName} nicht öffnen. Die maximale Dateianzahl beträgt: ${config.maximumFiles}`);
        //vscode.window.showErrorMessage(`Can't not open ${fileCount} Files. FileCount: ${config.maximumFiles}`);
        return;
    }

    if (!isError) {
        if (isDirectory) {
            parentDir = uri.fsPath;
        }

        fs.readdir(parentDir, (err, files: string[]) => {
            if (err) {
                return vscode.window.showErrorMessage(`Verzeichnis kann nicht gelesen werden. Fehler: ${err?.message}`);
                //return vscode.window.showErrorMessage(`Can't read Directory. Error: ${err?.message}`);
            }

            files.forEach((file) => {
                const filePath = `${parentDir}/${vscode.Uri.file(file).fsPath}`;
                const isDirectory = fs.statSync(filePath).isDirectory();

                if (isDirectory) {
                    if (recursive) {
                        openAllFilesInDirectory(vscode.Uri.file(filePath), true, ++depth, ++fileCount);
                    }
                    return;
                }

                vscode.workspace.openTextDocument(filePath).then((doc) => {
                    fileCount++;
                    vscode.window.showTextDocument(doc, { preview: false });
                });
            });
        });
    } else {
        return;
    }
};