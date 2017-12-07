var fs = require("fs");
var path = require("path");

/**
 * 
 * @param {string} buildDir - the path where your dist files is
 */
function DeleteHash(buildDir) {
    function callback(stats) {
        const newlyCreatedAssets = stats.compilation.assets;
        const unlinked = [];
        fs.readdir(path.resolve(buildDir), (err, files) => {
            files.forEach(file => {
                if (!newlyCreatedAssets[file]) {
                    fs.unlink(path.resolve(buildDir + file));
                    unlinked.push(file);
                }
            });
            if (unlinked.length > 0) {
                console.log('删除文件: ', unlinked);
            }
        });
    }
    this.callback = callback;
};
  
DeleteHash.prototype.apply = function(compiler) {
    compiler.plugin('done', this.callback);
};  

module.exports = DeleteHash;