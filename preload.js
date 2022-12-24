const {
    contextBridge,
    ipcRenderer,
    dialog,
    BrowserWindow,
    shell,
} = require("electron");
var pjson = require('./package.json');

contextBridge.exposeInMainWorld(
    "api", {
    start: (path) => {
        ipcRenderer.invoke("start", path);
    },
    receive: (channel, func) => {
        let validChannels = ["startSearch", "loadData"];
        if (validChannels.includes(channel)) {
            ipcRenderer.on(channel, (event, ...args) => func(...args));
        }
    }
}
);

contextBridge.exposeInMainWorld('util', {
    getVersion: () => {
        return pjson.version
    },
    openExternalLink: (href) => {
        shell.openExternal(href)
    }
})

contextBridge.exposeInMainWorld('fs', {
    promptFile: async (options) => {
        return await ipcRenderer.invoke("prompt-file", options);
    }
})