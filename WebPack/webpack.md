# webpack

## 1.1 webpack 是什么

webpack 是一种**前端资源构建工具**，一个静态模块打包器(module bundler)。

在webpack 看来, 前端的所有资源文件(js/json/css/img/less/...)都会作为模块处理。
它将根据模块的依赖关系进行静态分析，打包生成对应的静态资源(bundle)。

## 1.2 webpack 五个核心概念

#### 1.2.1 Entry

入口(Entry)：指示 webpack 以哪个文件为入口起点开始打包，分析构建内部依赖图。

#### 1.2.2 Output

输出(Output)：指示 webpack 打包后的资源 bundles 输出到哪里去，以及如何命名。

#### 1.2.3 Loader

Loader：让 webpack 能够去处理那些非 JS 的文件，比如样式文件、图片文件(webpack 自身只理解
JS)

#### 1.2.4 Plugins

插件(Plugins)：可以用于执行范围更广的任务。插件的范围包括，从打包优化和压缩，
一直到重新定义环境中的变量等。

#### 1.2.5 Mode

模式(Mode)：指示 webpack 使用相应模式的配置。

1. development:  

    会将 DefinePlugin 中 ```process.env.NODE_ENV``` 的值设置为 development。

   启用 

   ```NamedChunksPlugin``` 和 ```NamedModulesPlugin```。

   特点： 能让代码本地调试运行的环境。

2. production

   会将 DefinePlugin 中 ```process.env.NODE_ENV``` 的值设置为 production。

   启用 

   ```FlagDependencyUsagePlugin,```

   ``` FlagIncludedChunksPlugin,``` 

   ``` ModuleConcatenationPlugin, ``` 

   ```NoEmitOnErrorsPlugin, ```

    ```OccurrenceOrderPlugin, ```

   ```SideEffectsFlagPlugin 和 TerserPlugin```。

   特点： 能让代码优化上线运行的环境。

   

## 2 编译打包应用

创建 src 下的 js 等文件后，不需要配置 webpack.config.js 文件，在命令行就可以编译打包。

指令：

- 开发环境：webpack ./src/index.js -o ./build/built.js --mode=development

  webpack会以 ./src/index.js 为入口文件开始打包，打包后输出到 ./build/built.js 整体打包环境，是开发环境

- 生产环境：webpack ./src/index.js -o ./build/built.js --mode=production

  webpack会以 ./src/index.js 为入口文件开始打包，打包后输出到 ./build/built.js 整体打包环境，是生产环境

结论：

1. webpack 本身能处理 js/json 资源，不能处理 css/img 等其他资源
2. 生产环境和开发环境将 ES6 模块化编译成浏览器能识别的模块化，但是不能处理 ES6 的基本语法转化为 ES5（需要借助 loader）
3. 生产环境比开发环境多一个压缩 js 代码

```javascript
// resolve用来拼接绝对路径的方法
const { resolve } = require('path');
module.exports = {
  // webpack配置
  // 入口起点
  entry: './src/index.js',
  // 输出
  output: {
    // 输出文件名
    filename: 'built.js',
    // 输出路径
    // __dirname nodejs的变量，代表当前文件的目录绝对路径
    path: resolve(__dirname, 'build')
  },
  // loader的配置
  module: {
    rules: [
      // 详细loader配置
      // 不同文件必须配置不同loader处理
      { 
        // 匹配哪些文件
        test: /\.css$/,
        // 使用哪些loader进行处理
        use: [
          // use数组中loader执行顺序：从右到左，从下到上 依次执行
          // 创建style标签，将js中的样式资源插入进行，添加到head中生效
          'style-loader',
          // 将css文件变成commonjs模块加载js中，里面内容是样式字符串
          'css-loader'
        ]
      },
      {
        test: /\.less$/,
        use: [
          'style-loader',
          'css-loader',
          // 将less文件编译成css文件
          // 需要下载 less-loader和less
           'less-loader'
        ]
      }
    ]
  },
  // plugins的配置
  plugins: [
    // 详细plugins的配置
  ],
  // 模式
  mode: 'development', // 开发模式
  // mode: 'production'
}

```

