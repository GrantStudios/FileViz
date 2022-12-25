const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const path = require('path')
const fs = require('fs')
const cp = require('child_process');

const showMainWindow = () => {
    const win = new BrowserWindow({
        autoHideMenuBar: true,
        width: 800,
        height: 600,
        icon: __dirname + '/build/icon.ico',
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            devTools: false
        },
    })

    win.loadFile('src/index.html')

    function promptUpload(options) {
        return dialog.showOpenDialogSync(win, options)
    }

    ipcMain.handle("prompt-file", async (e, args) => {
        return promptUpload(args);
    })

    ipcMain.handle("start", async (e, { method, folderPath, options }) => {
        config = {
            container: "#tree",
            levelSeparation:    options.levelSeperation,
            siblingSeparation:  options.siblingSeparation,
            connectors: {
                type: options.tree_style,
                style: {
                    "stroke-width": 2,
                    "stroke": "#ccc"
                }
            }
        }

        const userConfig = {
            fileScanLimit: options.fileScanLimit
        }

        const treeWin = new BrowserWindow({
            autoHideMenuBar: true,
            width: 800,
            height: 600,
            webPreferences: {
                preload: path.join(__dirname, "preload.js"),
                nodeIntegrationInWorker: true,
                devTools: false
            },
        })
        treeWin.loadFile('src/tree.html')

        treeWin.once('ready-to-show', () => {
            treeWin.webContents.send('startSearch', {
                method, folderPath, config, userConfig
            })
        })
    })

}

app.whenReady().then(() => {
    showMainWindow()
})