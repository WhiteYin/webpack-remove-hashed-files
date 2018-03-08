### This plugin is able to remove hashed files.  
### 这个插件可以删除过往webpack打包hash编码后的文件。
### If you meet any problems,publish an issue plz.
### 如果你在使用过程中，遇到了什么问题，欢迎提交issue给我。

### 使用方法
1. 初始化npm
```
npm init
```
2. 安装模块
```
npm i webpack-remove-hashed-files --save-dev
```
3. 修改webpack.config.js
```
const removeFiles = require('webpack-remove-hashed-files');
//你的打包目标文件夹 - your distnation folder
const buildDir = './dist/';
//自定义选项 - DIY options
const options = {
    exclude:["test.js","foo/bar.js"]
}
//修改plugins - modify plugins
plugins:[
    new removeFiles(buildDir,options)
]
```

### 2018-3-7 修复bug
加上文件夹判断。当目标文件夹中含有子文件夹，将跳过该文件夹。

### 2018-3-8 功能更新
能够递归目录，判断内部子文件是否应该被删除。

### 2018-3-8 新增功能
新增options参数，可以配置exclude数组用来设置白名单。exclude每项必须为准确的文件路径名，暂不支持正则。  
*文件夹不需要设置白名单，若要删除请手动。*