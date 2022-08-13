# Node中的process.env

#### process.env

`process` 是 `Node.js` 中的 一个全局变量，提供来有关当前 Node.js 进程的信息并对其进行控制。而`process` 中的 `env` 则是返回包含用户环境的对象。可以通过 `process.env` 拿到当前项目运行环境的信息。



#### 设置环境变量

##### 通过cli的方式进行设置

```javascript
// index.js中
console.log(process.env.PROT)
```

**Windows (cmd.exe)**

```cmd
set PROT=10086 && node index.js
```

**Linux, macOS (Bash)**

```bash
PROT=10086 node index.js
```



##### <a name="env">.env文件</a>

+ 创建

直接在项目根目录中创建 `.env` 文件，然后键入环境变量及其值。

```
NDOE_ENV=development
PROT=10086
APP_KEY=***********
HOST_URL=**********
复制代码
```

**⚠️注意**：不要把`.env`文入放入代码版本管理中，因为这些环境变量都是项目中的隐私数据。



+ 读取

**在cra创建的项目中，自带了dotenv解析.env，所以创建.env文件后即可**。

创建 `.env` 文件后，可以自己编写代码来查找解析文件并将其写入到你的项目中，或者利用第三方的`npm`包，比如 [`dotenv`](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fmotdotla%2Fdotenv) 。

```js
yarn add dotenv

// .env
PROT=10086

// index.js
const dotenv = require('dotenv');
dotenv.config(); 
console.log(process.env.PROT); // 10086
```

现在当你执行命令脚本的时候就不用传入环境变量及其值了，在 `.env` 文件里也能更直观的看到和管理各环境变量的配置。



##### 更好的组织

一旦环境变量变多，就需要对所有环境变量进行集中式的管理，因为在所有需要使用的地直接引用变量与集中管理相比，重构和维护会更加困难。

所以**创建一个负责收集环境变量的模块**是一个更好的方式，这样可以轻松地一次查看环境变量并将它们映射为可读的名称。



+ 手动整理

创建一个名为 `config.js` 的文件，然后写入变量，将其命名为具有良好可读性的属性进行并导出它们。

```js
const dotenv = require（'dotenv'）; 

dotenv.config（）; 

module.exports = { 
  hostUrl：process.env.HOST_URL，
  secretKey：process.env.API_KEY，
  port：process.env.PORT 
};
```

然后就可以这样进行使用：

```js
const {port} = require（'./ config'）; 
console.log（`端口为：$ {port}`）; // 10086
```

这样有什么好处呢？

1. 项目文件组织更为直观合理

2. 清楚的知道环境变量的映射关系

3. 变量重命名为更具可读性的属性

4. 可以添加其他非环境变量的配置属性

但是如果要添加新的环境变量时，就必须将其添加到`config`模块中。



+ 自动整理

前面提到的第三方 `NPM` 包 `dotenv` 就可以做到。

```js
// config.js 
const dotenv = require('dotenv');
const result = dotenv.config();

if (result.error) {
  throw result.error;
}

const { parsed: envs } = result;
console.log(envs);
module.exports = envs;
```

然后就可以其他模块中这样引用：

```js
const { HOST_URL, API_KEY, PROT } = require('./config');
```



#### CRA创建的项目使用环境变量

必须以 `REACT_APP_` 开头创建自定义环境变量，环境变量在构建期间嵌入。

##### 设置临时环境变量

**Windows (cmd.exe)**

```cmd
set "REACT_APP_SECRET_CODE=abcdef" && npm start
```

（注意：变量赋值需要用引号包裹，以避免尾随空格。）

**Windows (Powershell)**

```Powershell
($env:REACT_APP_SECRET_CODE = "abcdef") -and (npm start)
```

**Linux, macOS (Bash)**

```bash
REACT_APP_SECRET_CODE=abcdef npm start
```



#####  `.env` 中添加环境变量

见<a href="#env">上文</a>设置。



##### 其他 `.env` 文件

> 注意：此功能 **适用于 `react-scripts@1.0.0` 及更高版本**。

- `.env`：默认。
- `.env.local`：本地覆盖。**除 test 之外的所有环境都加载此文件**。
- `.env.development`, `.env.test`, `.env.production`：设置特定环境。
- `.env.development.local`, `.env.test.local`, `.env.production.local`：设置特定环境的本地覆盖。

左侧的文件比右侧的文件具有更高的优先级：

- `npm start`: `.env.development.local`, `.env.development`, `.env.local`, `.env`
- `npm run build`: `.env.production.local`, `.env.production`, `.env.local`, `.env`
- `npm test`: `.env.test.local`, `.env.test`, `.env` (注意没有 `.env.local` )



##### `NODE_ENV` 的特殊内置环境变量

有一个名为 `NODE_ENV` 的特殊内置环境变量。可以从 `process.env.NODE_ENV` 中读取。运行 `npm start` 时，它总是等于 `'development'` ，运行 `npm test` 它总是等于 `'test'` ，运行 `npm run build` 来生成一个生产 bundle(包) 时，它总是等于 `'production'` 。**`NODE_ENV`无法手动覆盖。** 

