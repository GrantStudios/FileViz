const ENUMS = {
    SEARCH_METHOD: {
        BFS: 'BFS', DFS: 'DFS'
    }
}

const filesScannedLabel = $('#files-scanned')

let worker;
let start;
window.api.receive("startSearch", ({ method, folderPath, config }) => {
    start = performance.now()
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
            const elapsed = performance.now() - start
            $('#scan-time').text(elapsed.toFixed(0))
        }
        filesScannedLabel.text(scanned)
        new Treant(treeData)
    });
    worker.postMessage({ folderPath, config })
})

const pz = panzoom(tree)

$('#reset-zoom').click(function () {
    pz.zoomAbs(0, 0, 1)
    pz.moveTo(0, 0)
})