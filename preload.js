const {
    contextBridge,
    ipcRenderer,
    dialog,
    BrowserWindow
} = require("electron");

contextBridge.exposeInMainWorld(
    "api", {
    start: (path) => {
        ipcRenderer.invoke("start", path);
    },
    receive: (channel, func) => {
        let validChannels = ["startSearch"];
        if (validChannels.includes(channel)) {
            ipcRenderer.on(channel, (event, ...args) => func(...args));
        }
    }
}
);

contextBridge.exposeInMainWorld('fs', {
    promptFile: async (options) => {
        return await ipcRenderer.invoke("prompt-file", options);
    }
})