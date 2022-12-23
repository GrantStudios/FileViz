const ENUMS = {
    SEARCH_METHOD: {
        BFS: 'BFS', DFS: 'DFS'
    }
}

$('#file-select').click(function(){
    window.fs.promptFile({
        properties: ['openDirectory']
    }).then(file => {
        const isDfs = $('#method-dfs').prop('checked')
        window.api.start({
            method: isDfs ? ENUMS.SEARCH_METHOD.DFS : ENUMS.SEARCH_METHOD.BFS,
            folderPath: file[0]
        })
    });
})