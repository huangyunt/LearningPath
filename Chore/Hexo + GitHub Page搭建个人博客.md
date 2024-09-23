### Hexo介绍
Hexo是一款基于Node.js的开源静态博客框架，用于快速、简单且高效地搭建静态博客网站。本质上是一个静态网站生成器，新增文章只需要编辑md文件，通过运行命令再生成像html的静态文件。

### 环境搭建
``` shell
# 全局安装hexo脚手架
npm install -g hexo-cli

# 创建一blog项目
hexo init blog

# 进入项目
cd blog

# 安装依赖包
npm install
```

### 其他操作
``` shell
# 右键 Git Bush，用户项目自动化部署
npm install hexo-deployer-git --save
```

### 项目预览
``` shell
# 清理旧的静态文件
hexo clean

# 生成静态文件
hexo g

# 运行预览项目
hexo s
```

### Hexo配置文件详解（_config.yml）


### 主题样式修改
##### Next主题样式
https://theme-next.js.org/docs/getting-started/configuration.html


使用
1. Hexo 版本 >= 5.0
2. 在 Hexo 项目根目录下创建 Next 配置文件 ``` _config.next.yml ```
3. 拷贝 Next 下的配置文件到步骤二的配置文件中

``` shell
# Installed through npm
cp node_modules/hexo-theme-next/_config.yml _config.next.yml
# Installed through Git
cp themes/next/_config.yml _config.next.yml
```