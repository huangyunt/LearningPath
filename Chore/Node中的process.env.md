# Node中的process.env

#### process.env

`process` 是 `Node.js` 中的 一个全局变量，提供来有关当前 Node.js 进程的信息并对其进行控制。而`process` 中的 `env` 则是返回包含用户环境的对象。可以通过 `process.env` 拿到当前项目运行环境的信息。



#### 设置环境变量

##### 通过cli的方式进行设置

```javascript
// index.js中
console.log(process.env.PROT)
```

mac 下  ```PROT=10086 node index.js```  设置

windows 下 ```set PROT=10086 && node index.js``` 设置



##### .env文件

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



#### CRA创建的项目下使用环境变量

