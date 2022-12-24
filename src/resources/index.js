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

$('#file-select').click(function () {
    window.fs.promptFile({
        properties: ['openDirectory']
    }).then(file => {
        if (file && file[0]) {
            const isDfs = $('#method-dfs').prop('checked')
            const isTreeStyleCurvy = $('#tree-style-curvy').prop('checked')
            window.api.start({
                method: isDfs ? ENUMS.SEARCH_METHOD.DFS : ENUMS.SEARCH_METHOD.BFS,
                folderPath: file[0],
                options: {
                    tree_style: isTreeStyleCurvy ? ENUMS.OPTIONS.TREE_STYLE.CURVE : ENUMS.OPTIONS.TREE_STYLE.STRAIGHT
                }
            })
        }
    });
})

const settingsModal = $('#settings')
const settingsToggle = $('#settings-toggle')
settingsModal.click(function (e) {
    e.stopPropagation();
})
settingsToggle.click(function (e) {
    settingsModal.slideToggle('fast');
    e.stopPropagation()
})

$(document).click(function (e) {
    settingsModal.slideUp('fast')
})