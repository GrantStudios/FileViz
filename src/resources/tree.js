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
            $('.scan-status-indicator').hide()
            $('#scan-finished').css('display', 'flex')
            const elapsed = performance.now() - start
            $('#scan-time').text(elapsed.toFixed(0))
            $('#stop-search').hide()
        }
        filesScannedLabel.text(scanned)
        new Treant(treeData)
    });
    worker.postMessage({folderPath, config })
})

const pz = panzoom(tree)

$('#reset-zoom').click(function () {
    pz.zoomAbs(0, 0, 1)
    pz.moveTo(0, 0)
})

$('#stop-search').click(function(){
    worker.terminate()
    $('.scan-status-indicator').hide()
    $(this).hide()
    $('#scan-stopped').css('display', 'flex')
})