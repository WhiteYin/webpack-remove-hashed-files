var fs = require("fs");
var path = require("path");

/**
 * 
 * @param {string} buildDir - the path where your dist files is
 */
function DeleteHash(buildDir) {
    this.buildDir = buildDir;
};
  
DeleteHash.prototype.apply = function(compiler) {
    let buildDir = this.buildDir;
    compiler.plugin('done', function (compat) {
        //打包后的资源
        const newlyCreatedAssets = compat.compilation.assets;
        console.log(compat.compilation.assets);
        //用来输出被删除的文件名
        const unlinked = [];
        fs.readdir(path.resolve(buildDir), (err, files) => {
            files.forEach(file => {
                let filePath = path.resolve(buildDir + file);
                fs.stat(filePath, function (err, stat) {
                    //如果不是文件夹并且不在资源图中，删除之
                    if (!stat.isDirectory() && !newlyCreatedAssets[file]) {
                        fs.unlink(path.resolve(filePath));
                        unlinked.push(file);
                    }
                })
            });
            if (unlinked.length > 0) {
                console.log('删除文件: ', unlinked);
            }
        });
    });
};  

module.exports = DeleteHash;