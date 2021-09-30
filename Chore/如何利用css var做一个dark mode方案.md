# 如何利用css var做一个dark mode方案

# 背景

1. 希望利用 css 变量实现 dark 和 light 模式的切换
2. 原有的工程都是 less 形式定义的 css，并且还有 less 的函数，比如 fade 等，不想手动改 less 的函数，希望该插件能支持解析 less 函数
3. 需要支持局部不切换模式，比如某个区域是固定的 light 模式

# 步骤

## 第一步：less 变量转换成 css 变量

这一步比较简单，less 已经提供了字段用于转换，只需要添加一个配置项就可以，就是`globalVars`属性。

可以查看[example 代码](https://link.juejin.cn/?target=https%3A%2F%2Fcodebase.byted.org%2Frepo%2Flark%2Fdark-mode-css-var%2F-%2Fblob%2Fexample%2Fconfig%2Fwebpack.dm-cssvar.config.js)参考

```JavaScript
{
    loader: 'less-loader',
    options: {
      globalVars: LessGlobalCSSVars,
    }
}
复制代码
```

`LessGlobalCSSVars`大概长这个样子

```JavaScript
{
    "bg-body": "var(--bg-body)",
    "static-white": "var(--static-white)",
    ...
}
复制代码
```

less 会将`LessGlobalCSSVars`的映射关系追加到 less 文件前，在进行变量查找的时候就会替换成相应的 css 变量

比如，下面的 less 文件

```JavaScript
div {
    color: @bg-body;
}

复制代码
```

less 实际解析的文件内容是

```JavaScript
bg-body: "var(--bg-body)";
static-white: "var(--static-white)"
div {
    color: @bg-body;
}

复制代码
```

最后上面的文件就会被编译成

```JavaScript
div { color: var(--bg-body);}
复制代码
```

## 第二步：less 函数如何解析？【less 插件】

但是还有一个问题是 less 函数应该如何解析呢？比如`fade(``@bg-body, 20%``)`，如果不经过任何处理，这个函数会抛出异常，因为`var(--bg-body)`并不是 less 能够解析的节点类型，会提示`var(--bg-body)`不能被转换成`Color`类型（less 的一个节点类型），这是 less 的语法树解析，需要将 fade 函数的第一个参数解析成 Color 节点类型，否则就会抛异常。所以，我们需要对 less 函数进行改写，具体通过 less 插件的方式实现。修改 less-loader 的配置如下，增加一个插件。

```JavaScript
{
    loader: 'less-loader',
    options: {
      globalVars: LessGlobalCSSVars,
      plugins: [
        new LessSkipVarsPlugin ()
      ]
    }
}
复制代码
```

less 的所有函数会被注册到`[functions](https://github.com/less/less.js/blob/master/packages/less/src/less/functions/index.js "functions")`中，插件暴露了该`functions`，因此可以通过修改响应的 less 函数，实现函数的覆盖。该插件的实现[源代码](https://link.juejin.cn/?target=https%3A%2F%2Fcodebase.byted.org%2Frepo%2Flark%2Fdark-mode-css-var%2F-%2Fblob%2Fexample%2Fconfig%2Fwebpack.dm-cssvar.config.js)如下，functions 对象是函数名到函数体的映射，所以我们将需要重写的函数重置成我们自定义的即可。而函数的计算结果通过`calc`和`var`两个函数以及 css 变量进行表示，在页面中即可根据 css 变量进行实时计算！

下面只摘出来了我们支持的其中两个函数——fade 和 darken，fade 利用 rgba 的函数表示，而 darken 利用的是 hsl 的函数表示，主要是用 rgba 的表示法无法用 css 支持的函数表示出来，所以我们用了 hsl 函数。这里可以看到我们需要一些特殊的 css 变量，比如`--bg-body-SA`、`--bg-body-raw`、`--bg-HS`、 `--bg-body-L`.所以我们需要利用原始的色值（`bg-body`）进行转换

(下面代码做了省略，主要是示意，具体代码可以看源代码)

```JavaScript
class LessSkipVarsPlugin {
    install(less, pluginManager, functions) {
        functions.add('fade', function (color, percent) {
            if (color.type === 'Call') {
              if (color.name === 'var') {
                const key = color.args[0].value.substring(2);
                return `rgba(var(--${key}-raw), calc(var(--${key}-SA) * ${parseLessNumber(percent)}))`;
              }
            }
            ......

            return `rgba(${red},${green},${blue},${alpha * parseLessNumber(percent)})`;
        });
        functions.add('darken', function (color, amount, method) {
            .......
            if (color.type !== 'Color')
              throw new Error(`fade function parameter type error: except Color, get ${color.type}`);
            const hsl = (new Color(color.rgb, color.alpha)).toHSL();
            if (typeof method !== 'undefined' && method.value === 'relative') {
                hsl.l = hsl.l * (1 - parseLessNumber(amount));
            } else {
                hsl.l = hsl.l - parseLessNumber(amount);
            }
            return `hsl(${hsl.h},${hsl.s},${hsl.l})`;
        })
    }
}
复制代码
```

## 第三步：局部 light 模式如何支持？【postcss 插件】

点击[这里](https://link.juejin.cn/?target=https%3A%2F%2Fcodebase.byted.org%2Frepo%2Flark%2Fdark-mode-css-var%2F-%2Fblob%2Fsrc%2Fcss-loader%2Fplugins%2Fpostcss-color.js%23L50)可以快速定位到源代码。可以在 dom 节点上添加 classname 前缀，用来标注该 dom 下的样式都使用静态的亮色模式，不随主题切换。这里需要做的主要分为 3 步：

1. ### 第 1 步：【添加 dom 前缀 classname】

在相应的 dom 节点添加 classname 前缀，比如 static-light；

```JavaScript
// 原来的dom结构
<div className="test">aaa</div>
// 新的dom结构
<div className="static-light">
    <div className="test">aaa</div>
</div>
复制代码
```

1. ### 第 2 步：【追加前缀样式】

   1. 生成样式时，通过 postcss 为所有的样式添加 static-light 前缀；

这一步实际上是在 css-loader 的处理过程中加入了一个 postcss 插件，对每条规则[rule](https://link.juejin.cn/?target=https%3A%2F%2Fwww.postcss.com.cn%2Fapi%2F%23rule)额外生成一条静态样式。

举个例子,我定义了如下的 less 样式

```JavaScript
.test {
    background-color: @static-white;
}
复制代码
```

经过该 postcss 插件之后，生成的产物会变成

```JavaScript
.test {
    background-color: var(--static-white);
}
.static-light .test {
    background-color: var(--static-white);
}
复制代码
```

所以要怎样才能追加生成这样的 css 呢？

可以看到 css-loader 的[源码](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fwebpack-contrib%2Fcss-loader%2Fblob%2Fmaster%2Fsrc%2Findex.js%23L163)中，节点都经过了 postcss 插件的处理，我们只需要在插件列表中，加上我们的插件即可

```JavaScript
result = await postcss([...plugins, new colorPlugin({
  staticEx: {prefix:'.static-light'},
})]).process(content, {...});
复制代码
```

所以接下来可以实现我们的 postcss 插件

```JavaScript
var postcss = require('postcss');
module.exports = postcss.plugin('postcss-color-and-function', function (options) {
    const { staticEx } = options;
    function processNode(node, type) {
        let staticNode;
        switch (node.type) {
            ......
            case 'rule':
                staticNode =  node.clone();
                staticNode.selectors = staticNode.selectors.map(i => {
                  return `${options.staticEx.prefix} ${i}`
                });
                break;
            default:
                break;
        }
        return staticNode;
    }
    return function (css) {
        let last = [];
        css.each((node, type) => {
            const staticNode = processNode(node, type);
            if (staticNode) {
                last.push(staticNode);
            }
        });
        css.nodes = css.nodes.concat(last);
    };
});

复制代码
```

主要的实现思路是：

- 通过当前节点克隆一个一样的节点，在最后返回的时候拼接该节点，这样可以生成两份样式；
- 对于克隆的那份节点，追加选择器，

```JavaScript
staticNode.selectors = staticNode.selectors.map(i => {
  return `${options.staticEx.prefix} ${i}`
});
复制代码
```

这样就可以实现追加节点和局部 css 变量定义了。

> 注:css-loader 会校验参数，所以如果需要修改传入的参数格式，还需要修改[options.json](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fwebpack-contrib%2Fcss-loader%2Fblob%2Fmaster%2Fsrc%2Foptions.json%23L197)和[normalizeOptions](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fwebpack-contrib%2Fcss-loader%2Fblob%2Fmaster%2Fsrc%2Futils.js%23L628)。

1. ### 第 3 步：插入一套制定 classname（这里是 static-light）的 css var 变量。

这里我们借助 webpack 的插件来实现，详细内容看下一部分

## 第四步：追加全局 css 变量定义【webpack 插件】

我们可以定义一下 css 变量，就可以生效了，添加@media (prefers-color-scheme: dark)可以在系统模式变化的时候切换 css 变量，就可以实现样式的切换。

```CSS
:root {
 --bg-body: "#1f1f1f";
 --static-white: '#fff'
}
@media (prefers-color-scheme: dark) {
    :root {
     --bg-body: "#2f2f2f";
     --static-white: '#fff'
    }
}
复制代码
```

上面一小节中，我们还需要追加局部 light 样式对应的 css 变量，需要在上述变量的基础上追加下面的一段代码。

```CSS
:root {
 --bg-body: "#1f1f1f";
 --static-white: '#fff'
}
@media (prefers-color-scheme: dark) {
    :root {
     --bg-body: "#2f2f2f";
     --static-white: '#fff'
    }
}
.static-light {
 --bg-body: "#1f1f1f";
 --static-white: '#fff'
}
复制代码
```

这样我们手动追加变量就会变得复杂，并且容易出错，所以我们可以利用 webpack 插件进行追加，webpack 提供了各种钩子，我们可以利用这些生命周期钩子在合适的时机执行相应的逻辑。

1. ### 第 1 步：【生成 css 文件】

   1. 我们需要保证生成 css 文件只会执行一次，并且保证生成文件在插入 link 标签之前，HtmlWebpackPlugin 插件提供的生命周期钩子函数[alterAssetTags](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fjantimon%2Fhtml-webpack-plugin%23alterassettags-hook)，返回当前所有的资源列表，用户可以在此追加一些资源链接，所以我们可以在此生命周期钩子处，触发生成文件。

```JavaScript
compiler.hooks.compilation.tap('LarkThemePlugin', compilation => {
    HtmlWebpackPlugin.getHooks(compilation).alterAssetTags.tapAsync('LarkThemePlugin', (data, cb) => {
        const source = xxx;
        compilation.assets['theme.css'] = { source: () => source, size: () => Buffer.byteLength(source, 'utf-8')};
      cb(null,data);
    })

})
复制代码
```

1. ### 第 2 步：生成 link 标签引用：

   1. 上一步生成了 css 资源文件，我们需要在 html 中追加一个 link 标签，引用该 css 资源，在实际应用中，我们往往会有很多资源标签插入到 html 中，而我们又希望该标签可以插入到所有资源文件之前进行加载

```JavaScript
compiler.hooks.compilation.tap('LarkThemePlugin', compilation => {
    HtmlWebpackPlugin.getHooks(compilation).alterAssetTags.tapAsync('LarkThemePlugin', (data, cb) => {
      const { assetTags: { styles }} = data;
      styles.unshift({
        tagName: 'link',
        voidTag: true,
        attributes: {
          href: 'theme.css',
          rel: 'stylesheet'
        }
      })
      cb(null,data);
    })

})
复制代码
```

完整的 webpack 插件代码在下方：

```JavaScript
const fs = require('fs');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { getRootCSSVarMap } = require('../util');
class InjectThemeWebpackPlugin {
    constructor({ lessVarsSet, darkTokens, lightTokens }) {
      this.darkTokens = darkTokens;
      this.lightTokens = lightTokens;
    }
    // 生成css变量的css样式
    generateResult() {
      const generateCss = (cssObj) => {
        let css = '';
        for (let key in cssObj) {
            const value = cssObj[key];
            css += `${key}: ${value};`
        }
        return `:root{${css}}`;
      }
      const darkCSSObj = getRootCSSVarMap(this.darkTokens, 'DARK');
      const lightCSSObj = getRootCSSVarMap(this.lightTokens, 'LIGHT');
      return `${generateCss(lightCSSObj)}\n@media (prefers-color-scheme: dark) {${generateCss(darkCSSObj)}}`;
    }

    apply(compiler) {
      // 追加link标签
      compiler.hooks.compilation.tap('LarkThemePlugin', compilation => {
        HtmlWebpackPlugin.getHooks(compilation).alterAssetTags.tapAsync('LarkThemePlugin', (data, cb) => {
          const source = this.generateResult();
          compilation.assets['theme.css'] = { source: () => source, size: () => Buffer.byteLength(source, 'utf-8')};
          const { assetTags: { styles }} = data;
          styles.unshift({
            tagName: 'link',
            voidTag: true,
            attributes: {
              href: 'theme.css',
              rel: 'stylesheet'
            }
          })
          cb(null,data);
        })

      })
    }
}
module.exports = InjectThemeWebpackPlugin;
复制代码
```

> 注：这里需要注意，需要保证`html-webpack-plugin`插件一直是一个，不然会出现无法追加上 link 标签的情况

# 🧭 技术点快速导航：

本文涉及了 less 插件、postcss 插件、和 webpack 插件的内容，对于没有插件背景的朋友会有点陌生，可以学习了解以下内容，方便补齐各个插件使用方式的信息。