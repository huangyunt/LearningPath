# JavaScript

#### 1. script标签中async和defer的区别

![image-20211025190555184](../Picture/Snipaste_2021-12-13_03-23-58.png)

+ 普通script标签：下载和执行都会阻塞Dom渲染
+ defer：立即进行异步下载，等到HTML完全解析完后开始执行，有多个defer的标签时，会按照顺序下载执行
+ async：立即进行异步下载，下载完后会立即执行同时阻塞Dom渲染，因为是下载完立即执行，不能保证多个加载时的先后顺序。

