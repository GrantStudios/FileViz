const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const path = require('path')
const fs = require('fs')
const cp = require('child_process');

const ENUMS = {
    SEARCH_METHOD: {
        BFS: 'BFS', DFS: 'DFS'
    },
    OPTIONS: {
        TREE_STYLE: {
            CURVE: 'curve', STRAIGHT: 'straight'
        }
    }
}

const showMainWindow = () => {
    const win = new BrowserWindow({
        autoHideMenuBar: true,
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            // devTools: false
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
            levelSeparation:    20,
            siblingSeparation:  15,
            subTeeSeparation:   15,
            connectors: {
                type: options.tree_style,
                style: {
                    "stroke-width": 2,
                    "stroke": "#ccc"
                }
            }
        }
        
        const treeWin = new BrowserWindow({
            autoHideMenuBar: true,
            width: 800,
            height: 600,
            webPreferences: {
                preload: path.join(__dirname, "preload.js"),
                nodeIntegrationInWorker: true,
                // devTools: false
            },
        })
        treeWin.loadFile('src/tree.html')
        treeWin.webContents.send('startSearch', {
            method, folderPath, config
        })

        treeWin.on('browser-window-blur', (event, w) => {
            treeWin.focus()
        })
    })

}

app.whenReady().then(() => {
    showMainWindow()
})