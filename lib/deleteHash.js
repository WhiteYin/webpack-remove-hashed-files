var fs = require("fs");
var path = require("path");

/**
 * 
 * @param {string} buildDir - the path where your dist files is. - 目标路径
 * @param {Object} options - DIY options - 自定义选项
 */
function DeleteHash(buildDir,options) {
    this.buildDir = buildDir;
    this.options = options || {};
};

DeleteHash.prototype.apply = function (compiler) {
    const buildDir = this.buildDir;
    const options = this.options;
    let exclude = [];
    if (options.hasOwnProperty("exclude")) {
        exclude = options.exclude.map(item => {
            return path.resolve(buildDir+item);
        });
    }
    compiler.plugin('done', function (compat) {
        //待删除的文件
        let unlinked = [];
        //打包后的资源
        const newlyCreatedAssets = compat.compilation.assets;
        delFolder(buildDir, newlyCreatedAssets, exclude,unlinked);
        if (unlinked.length > 0) {
            console.info("remove files: ", unlinked);
        } else {
            console.info("remove-plugin:","everything is up-to-date");
        }
    });
};
/** 
 * 文件类别及操作：
 * 1. 在白名单里的不删除；
 * 2. 否则，如果是文件夹，递归遍历其内部；
 * 3. 如果是文件
 *  * 如果文件名不在资源图中，删除；
 *  * 如果文件名在资源图中；
 *      * 如果资源图中的文件路径与当前遍历的路径不一致，删除；
 *      * 如果一致，不删除。
*/
/**
 * traversal folder
 * 递归遍历目录
 */
function delFolder(dir, assets,exclude,unlinked) {
    //如果路径不以/结尾，则加上。
    if (dir.lastIndexOf("/") != dir.length - 1) {
        dir += "/";
    }
    //使用同步方法才能获取到删除的文件名
    fs.readdirSync(path.resolve(dir))
        .forEach(file => {
            let filePath = path.resolve(dir + file);
            //如果文件在白名单里，无操作
            if (exclude.indexOf(filePath) > -1) {
                return;
            }
            //否则读取该文件信息
            let stat = fs.statSync(filePath);
            //如果是文件夹，递归遍历其子目录
            if (stat.isDirectory()) {
                delFolder(filePath, assets,exclude,unlinked);
            }
            //1. 如果不是文件夹并且不在资源图中，删除之
            //2. 如果文件名在资源图中，但路径不对(assets中每项的existsAt字段表示资源路径)，也删除
            else if (!assets[file] || filePath !== assets[file].existsAt) {
                fs.unlink(path.resolve(filePath));
                unlinked.push(file);
            }
        });
}

module.exports = DeleteHash;