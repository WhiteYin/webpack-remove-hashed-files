### This plugin is able to remove hashed files.  
### If you meet any problems,publish an issue plz.

### 这个插件可以删除过往webpack打包hash编码后的文件。
### 如果你在使用过程中，遇到了什么问题，欢迎提交issue给我。

[![npm package](https://img.shields.io/npm/v/webpack-remove-hashed-files.svg?style=flat-square)](https://www.npmjs.org/package/webpack-remove-hashed-files)
[![NPM downloads](http://img.shields.io/npm/dt/webpack-remove-hashed-files.svg?style=flat-square)](https://npmjs.org/package/webpack-remove-hashed-files) 

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
    exclude:["test.js","foo/bar.js","WEB-INF","test/www"]
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
新增options参数，可以配置exclude数组用来设置白名单。exclude每项最好为准确的文件或文件夹的相对路径名，暂不支持正则。  

### 2018-7-3 修复bug && 新增功能
修改原有逻辑，现在是根据遍历传入的路径中每个文件的绝对路径是否存在于assets资源图中来判断该文件是否应该删除。同时新增删除文件夹中所有文件后会删除该空文件夹的功能。