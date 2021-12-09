# CSS

### 写在前面

最近看了两本书《CSS揭秘》和《CSS权威指南》恶补一下CSS（自己真是菜到天际），记录一些有意思的问题



### CSS高度由什么决定？

#### 块级元素

一个块级元素div的高度一般是与自身的**CSS样式**和**内部元素的高度总和**有关

- `div`设置了height后，整个盒模型的高度基本确定，其内部元素再高也无法改变`div`的高度
- 当`div`不设置height时，其高度和内部文档流元素高度的总和有关

##### 块级元素不设置高度，内有块级元素时

会被子元素的height、padding、border撑起来

```html
<style>
    *{
        margin: 0;
        padding: 0;
    }
    .parent{
        outline: 5px solid red;
        width: 300px;
    }
    .child{
        height:400px;
        border: 5px solid green;
    }
</style>
<div class="parent">
    <div class="child"></div>
</div>
```

如图，父级元素不设高度，高度为子元素height+border

<div style="display: flex; justify-content: center; align-items: center;">
    <img src="C:\Users\H\AppData\Roaming\Typora\typora-user-images\image-20211120195130235.png"
        alt="image-20211120195130235" style="zoom:50%;" />
    <img src="C:\Users\H\AppData\Roaming\Typora\typora-user-images\image-20211120195056819.png"
        alt="image-20211120195056819" style="zoom:50%;" />
</div>



##### 子元素设置margin时

父元素高度无法被子元素垂直方向上margin撑开

```html
<style>
    * {
        margin: 0px;
        padding: 0px;
    }

    .parent {
        outline: 5px solid red;
        width: 300px;
    }

    .child {
        height: 400px;
        border: 5px solid green;
        margin: 20px;
    }
</style>
<div class="parent">
    <div class="child"></div>
</div>
```

<div style="display: flex; justify-content: center; align-items: center;">
    <img src="C:\Users\H\AppData\Roaming\Typora\typora-user-images\image-20211120202203417.png"
        alt="image-20211120202203417" style="zoom:50%;" />
    <img src="C:\Users\H\AppData\Roaming\Typora\typora-user-images\image-20211120202344779.png"
        alt="image-20211120202344779" style="zoom:50%;" />
</div>

**解决方案：父元素设置border/padding/overflow：hidden**

**总结：父元素高度能被子元素的height、border、padding撑开，如果父元元素在垂直方向上有`border`,`padding`（只要在逻辑上存在，不论大小）以及`overflow:hidden`，都能被子元素的`margin`撑开，否则只能撑开父元素的宽度**



### CSS宽度由什么决定？

#### 行内/行内块元素

行内元素/行内块的宽度是由它的内容决定的，行内元素不能设置宽高

#### 块级元素

一个块级元素宽度当不设置样式时默认为父级元素的100%**（这个100%是自适应的，并不相当于width：100%）**







### 为什么margin-top/padding-top设置百分比基于父元素的宽度计算的？

```html
<head>
    <style>
        .parent {
            width: 300px;
            height: 400px;
            border: 5px solid red;
        }
        .child {
            height: 200px;
            margin-top: 50%;
            background-color: green;
        }
    </style>
</head>
<body>
    <div class="parent">
        <div class="child"></div>
    </div>
</body>
```

<img src="C:\Users\H\AppData\Roaming\Typora\typora-user-images\image-20211120194334386.png" alt="image-20211120194334386" style="zoom:50%;" />

这里利用margin-top：50%将子元素挤到最下方贴底，然而这里的百分比是相对于父级宽度计算的。

CSS权威指南中的解释：若是相对于父元素的高度计算会形成死循环。
***“我们认为，正常流中的大多数元素都会足够高以包含其后代元素（包括外边距），如果一个元素的上下外边距是父元素的height的百分数，就可能导致一个无限循环，父元素的height会增加，以适应后代元素上下外边距的增加，而相应的，上下外边距因为父元素height的增加也会增加，形成无限循环。”***

**本质上是因为css中高度是可以自适应的，基于父级高度的百分比计算会导致无限循环的问题**。

