var fs = require("fs");
var path = require("path");

/**
 * 
 * @param {string} buildDir - the path where your dist files is
 */
function DeleteHash(buildDir) {
    this.buildDir = buildDir;
};

DeleteHash.prototype.apply = function (compiler) {
    let buildDir = this.buildDir;
    compiler.plugin('done', function (compat) {
        //打包后的资源
        const newlyCreatedAssets = compat.compilation.assets;
        delFolder(buildDir, newlyCreatedAssets);
    });
};

/**
 * 递归遍历目录
 * @param {*} dir 相对路径
 * @param {*} assets 资源图
 */
function delFolder(dir, assets) {
    //如果路径不以/结尾，则加上。
    if (dir.lastIndexOf("/") != dir.length - 1) {
        dir += "/";
    }
    fs.readdir(path.resolve(dir), (err, files) => {
        let unlinked = [];
        files.forEach(file => {
            let filePath = path.resolve(dir + file);
            fs.stat(filePath, function (err, stat) {
                //如果是文件夹，递归遍历其子目录
                if (stat.isDirectory()) {
                    delFolder(filePath, assets);
                }
                //如果不是文件夹并且不在资源图中，删除之
                else if (!assets[file]) {
                    fs.unlink(path.resolve(filePath));
                    unlinked.push(file);
                }
            })
        });
        if (unlinked.length > 0) {
            console.log('删除文件: ', unlinked);
        }
    });
}
module.exports = DeleteHash;