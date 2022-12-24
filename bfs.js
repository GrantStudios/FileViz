const path = require('path')
const fs = require('fs')

self.addEventListener("message", function ({ data: { folderPath, config, userConfig } }) {
    const { fileScanLimit } = userConfig;
    parent_node = {
        text: { name: path.basename(folderPath) }
    };

    chart_config = [
        config, parent_node,
    ];

    let scanned = 0;
    const q = []
    fs.readdirSync(folderPath).forEach(file => {
        q.push({
            parent: parent_node,
            path: path.join(folderPath, file),
            text: { name: file },
        })
    })

    while (q.length > 0 && (fileScanLimit == 0 || fileScanLimit > scanned)) {
        const current = q.shift();
        chart_config.push(current);
        scanned++;
        self.postMessage({ finished: false, scanned, treeData: chart_config })
        if (fs.lstatSync(current.path).isDirectory()) {
            fs.readdirSync(current.path).forEach(file => {
                q.push({
                    parent: current,
                    path: path.join(current.path, file),
                    text: { name: file },
                })
            })
        }
    }
    self.postMessage({ finished: true, scanned, treeData: chart_config })
})
