### Hexo介绍
Hexo是一款基于Node.js的开源静态博客框架，用于快速、简单且高效地搭建静态博客网站。本质上是一个静态网站生成器，新增文章只需要编辑md文件，通过运行命令再生成像html的静态文件。

### 环境搭建
```
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
```
# 右键 Git Bush，用户项目自动化部署
npm install hexo-deployer-git --save
```

### 项目预览
```
# 清理旧的静态文件
hexo clean

# 生成静态文件
hexo g

# 运行预览项目
hexo s
```

### Hexo配置文件详解（_config.yml）
