var fs = require("fs");
var path = require("path");

/**
 * 
 * @param {string} buildDir - the path where your dist files is. - 目标路径
 * @param {Object} options - DIY options - 自定义选项
 */
function DeleteHash(buildDir, options = {}) {
    this.buildDir = buildDir;
    this.options = options;
};
// 不能写成箭头函数，因为会丢失this呢
DeleteHash.prototype.apply = function(compiler) {
    const buildDir = this.buildDir;
    const options = this.options;
    let exclude = [];
    if (options.hasOwnProperty("exclude")) {
        exclude = options.exclude.map(item => {
            return path.resolve(buildDir + item);
        });
    }
    // TODO:新版本好像要用hook来做，后面我再改吧。
    compiler.plugin('done',compat => {
        //待删除的文件
        let unlinked = [];
        //打包后的资源
        const newlyCreatedAssets = compat.compilation.assets;
        // 把打包后所有资源的路径保存到数组中
        const dirArrays = [];
        for (let keys in newlyCreatedAssets) {
            dirArrays.push(newlyCreatedAssets[keys].existsAt);
        }
        delFolder(buildDir, dirArrays, exclude, unlinked);
        if (unlinked.length > 0) {
            console.info("remove files: ", unlinked);
        } else {
            console.info("remove-plugin:", "everything is up-to-date");
        }
    });
};
/** 
 * 文件类别及操作：
 * 1. 在白名单里的不删除；
 * 2. 否则，如果是文件夹，递归遍历其内部；
 * 3. 如果是文件，其路径不对应于资源图中某个所存文件的路径，则删除
*/
/**
 * traversal folder
 * 递归遍历目录
 */
function delFolder(dir, dirArrays, exclude, unlinked) {
    let operateDir = dir;
    operateDir = path.resolve(operateDir);
    //如果路径不以\结尾，则加上。
    if (operateDir.lastIndexOf("\\") != operateDir.length - 1) {
        operateDir += "\\";
    }
    //使用同步方法才能获取到删除的文件名
    let files = fs.readdirSync(operateDir);
    files.forEach(file => {
        let filePath = path.resolve(operateDir + file);
        //如果文件在白名单里，无操作
        if (exclude.indexOf(filePath) > -1) {
            return;
        }
        //否则读取该文件信息
        let stat = fs.statSync(filePath);
        //如果是文件夹，递归遍历其子目录
        if (stat.isDirectory()) {
            delFolder(filePath, dirArrays, exclude, unlinked);
        }
        //如果文件目录不存在于路径数组中
        else if (dirArrays.indexOf(filePath) < 0)  {
            fs.unlink(path.resolve(filePath));
            unlinked.push(file);
        }
    });
    // 如果删除后是空文件夹
    files = fs.readdirSync(operateDir);
    if (files.length === 0) {
        fs.rmdirSync(operateDir);
    }
}

module.exports = DeleteHash;