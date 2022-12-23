const ENUMS = {
    SEARCH_METHOD: {
        BFS: 'BFS', DFS: 'DFS'
    }
}

const filesScannedLabel = $('#files-scanned')

let worker;
window.api.receive("startSearch", ({ method, folderPath, config }) => {
    if (method == ENUMS.SEARCH_METHOD.BFS) {
        worker = new Worker('../bfs.js')
    } else {
        worker = new Worker('../dfs.js')
    }

    worker.addEventListener("message", function handleMessageFromWorker(msg) {
        const { finished, scanned, treeData } = msg.data;
        if (finished) {
            $('#scan-finished').css('display', 'flex')
            $('#scan-loading').hide()
        }
        filesScannedLabel.text(scanned)
        new Treant(treeData)
    });
    worker.postMessage({ folderPath, config })
})

panzoom(tree)