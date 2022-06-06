# Jira项目

#### 代码自动格式化工具：prettier

配置过程：https://prettier.io/docs/en/precommit.html

``` yarn add --dev --exact prettier ```

新建``` .prettierrc.json，.prettierignore ```文件

设置git commit预提交钩子

```npx mrm@2 lint-staged ```



#### 规范git commit工具：commitlint

配置过程：https://github.com/conventional-changelog/commitlint

`` yarn add --save-dev @commitlint/config-conventional @commitlint/cli ``

新建 commitlint.config.js文件，引入规则module.exports = {extends: ['@commitlint/config-conventional']}



#### 常见MOCK方案

##### 1. 代码侵入（直接在代码中写死Mock数据，或请求本地的JSON文件

​	优点：无

​	缺点：与真实server环境的切换比较麻烦（需要修改请求地址），一切需要侵入代码切换环境的行为都是不好的

##### 2. 请求拦截

​	代表：[Mock.js](http://mockjs.com/)

```javascript
Mock.mock(/\\\\/api\\\\/visitor\\\\/list/, 'get', {
  code: 2000,
  msg: 'ok',
  'data|10': [
    {
      'id|+1': 6,
      'name': '@csentence(5)',
      'tag': '@integer(6, 9)-@integer(10, 14)岁 @cword("零有", 1)基础',
      'lesson_image': "<https://images.pexels.com/3737094/pexels-photo-3737094.jpeg>",
      'lesson_package': 'L1基础指令课',
      'done': '@integer(10000, 99999)',
    }
  ]
})
```

优点：

1. 与前端代码分离
2. 可生成随机数据

缺点：

1. 数据都是动态生成的假数据，无法真实模拟增删改查的情况
2. 只支持ajax，不支持fetch（本质上是重写了ajax方法，两者的差别见：[AJAX 之 XHR, Fetch 的对比](https://zhuanlan.zhihu.com/p/24594294)）

##### 3. 接口管理工具

代表：rap，swagger，moco，yapi

优点：

​	1.配置功能强大，接口管理与Mock一体，后端修改接口Mock也跟着更改，可靠

缺点：

​	1.配置复杂，依赖后端

​	2.一般会作为大团队的基础建设而存在

##### 4. 本地node服务器

代表：[json-server](https://github.com/typicode/json-server )

优点：

​	1.配置简单，json-server甚至可以0代码30s启动一个REST API Server

​	2.自定义程度高

​	3.增删改查真是模拟

##### REST API

一句话总结：URI 代表 资源/对象，METHOD 代表行为

```
GET /tickets // 列表
GET /tickets/12 // 详情
POST /tickets  // 增加
PUT /tickets/12 // 替换
PATCH /tickets/12 // 修改
DELETE /tickets/12 // 删除
```



#### d.ts类型文件

改造js文件为ts文件后，引入的qs库报错

![image-20211110193223804](C:\Users\H\AppData\Roaming\Typora\typora-user-images\image-20211110193223804.png)

```yarn add @types/qs --save-dev   ``` 安装对应的ts补丁文件

**d.ts文件的作用：说明书文件**

JS 文件 + .d.ts 文件   === ts 文件

.d.ts 文件可以让 JS 文件继续维持自己JS文件的身份，而拥有TS的类型保护

一般写业务代码不会用到，但是点击类型跳转一般会跳转到 .d.ts文件

