const path = require('path')
const fs = require('fs')

self.addEventListener("message", function ({ data: {folderPath, config} }) {
    parent_node = {
        text: { name: path.basename(folderPath) }
    };

    chart_config = [
        config, parent_node,
    ];

    function dfs(file){
        const current = file;
        chart_config.push(file)
        scanned++
        self.postMessage({ finished: false, scanned, treeData: chart_config })
        if(fs.lstatSync(current.path).isDirectory()){
            fs.readdirSync(current.path).forEach(file => {
                return dfs({
                    parent: current,
                    path: path.join(current.path, file),
                    text: { name: file },
                })
            })
        }
    }
        

    let scanned = 0;
    fs.readdirSync(folderPath).forEach(file => {
        dfs({
            parent: parent_node,
            path: path.join(folderPath, file),
            text: { name: file },
        })
    })

    self.postMessage({ finished: true, scanned, treeData: chart_config })
})
