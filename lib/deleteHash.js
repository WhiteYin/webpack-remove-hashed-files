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
    buildDir = this.buildDir;
    compiler.plugin('done', function (compat) {
        //获取资源数组对象
        const newlyCreatedAssets = compat.compilation.assets;
        const unlinked = [];
        fs.readdir(path.resolve(buildDir), (err, files) => {
            files.forEach(file => {
                //删除当前打包资源组中不存在的文件
                if (!newlyCreatedAssets[file]) {
                    fs.unlink(path.resolve(buildDir + file));
                    unlinked.push(file);
                }
            });
            if (unlinked.length > 0) {
                console.log('删除文件: ', unlinked);
            }
        });
    });
};  

module.exports = DeleteHash;