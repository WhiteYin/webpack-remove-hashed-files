### This plugin is about to remove hashed files.  
### 这个插件可以删除过往webpack打包hash编码后的文件。
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
//你的打包目标文件夹
//your distnation folder
const buildDir = './dist/';
//……修改plugins
//...modify plugins
plugins:[
    new removeFiles(buildDir)
]
```