# javascript执行上下文对象

#### 前言：

#### 在看js垃圾回收时遇到相关问题，感觉自己对上下文对象理解的还是不够透彻（实在是太菜了）这就回来恶补。



#### 执行上下文（Execution Context）

+ **执行上下文可以理解为当前代码的运行环境。**在 JavaScript 中，运行环境主要包含了**全局环境**和**函数环境**。

+ 在 JavaScript 代码运行过程中，最先进入的是全局环境，而在函数被调用时则进入相应的函数环境。全局环境和函数环境所对应的执行上下文我们分别称为**全局上下文**和**函数上下文**。

+ 在一个 JavaScript 文件中，经常会有多个函数被调用，也就是说在 JavaScript 代码运行过程中很可能会产生多个执行上下文，那么如何去管理这多个执行上下文呢？

+ 执行上下文是以栈（一种 LIFO 的数据结构）的方式被存放起来的，我们称之为**执行上下文栈（Execution Context Stack）**。

+ **在 JavaScript 代码开始执行时，首先进入全局环境，此时全局上下文被创建并入栈，之后当调用函数时则进入相应的函数环境，此时相应函数上下文被创建并入栈，当处于栈顶的执行上下文代码执行完毕后，则会将其出栈。**

+ 所以在执行上下文栈中，栈底永远是全局上下文，而栈顶则是当前正在执行的函数上下文。

```js
function fn2() {
  console.log('fn2')
}
function fn1() {
  console.log('fn1')
  fn2();
}
fn1();
```

对于如上代码

```javascript
/* 伪代码 以数组来表示执行上下文栈 ECStack=[] */
// 代码执行时最先进入全局环境，全局上下文被创建并入栈
ECStack.push(global_EC);
// fn1 被调用，fn1 函数上下文被创建并入栈
ECStack.push(fn1_EC);
// fn1 中调用 fn2，fn2 函数上下文被创建并入栈
ECStack.push(fn2_EC);
// fn2 执行完毕，fn2 函数上下文出栈
ECStack.pop();
// fn1 执行完毕，fn1 函数上下文出栈
ECStack.pop();
// 代码执行完毕，全局上下文出栈
ECStack.pop();
```

![image-20210414214146564](Picture\image-20210414214146564.png)

在一个执行上下文中，最重要的三个属性分别是**变量对象（Variable Object）**、**作用域链（Scope Chain）**和 **this 指向**。

```js
EC = {
  VO,
  SC,
  this
}
```

一个执行上下文的生命周期分为**创建**和**执行**阶段。创建阶段主要工作是**生成变量对象**、**建立作用域链**和**确定 this 指向**。而执行阶段主要工作是变量赋值以及执行其它代码等。



#### 变量对象（Variable Object）

生成变量有三个过程：

**1. 检索当前上下文中的函数参数**。该过程生成 Arguments 对象（函数参数），并建立以形参变量名为属性名，形参变量值为属性值的属性；

**2. 检索当前上下文中的函数声明**。该过程建立以函数名为属性名，函数所在内存地址引用为属性值的属性；

**3. 检索当前上下文中的变量声明**。该过程建立以变量名为属性名，undefined 为属性值的属性（如果变量名跟已声明的形参变量名或函数名相同，则**该变量声明**不会干扰已经存在的这类属性）。

伪代码表示变量对象

```js
VO = {
  Arguments: {}, 
  ParamVariable: 具体值,  //形参变量
  Function: <function reference>,
  Variable:undefined
}
```

当执行上下文进入执行阶段后，变量对象会变为**活动对象（Active Object）**。此时原先声明的变量会被赋值。

**变量对象和活动对象都是指同一个对象，只是处于执行上下文的不同阶段**。

我们可以通过以下伪代码来表示活动对象

```js
AO = {
  Arguments: {},
  ParamVariable: 具体值,  //形参变量
  Function: <function reference>,
  Variable:具体值
}
```

实际例子：

```js
function fn1(a) {
  var b = 1;
  function fn2() {}
  var c = function () {};
}
fn1(0);
```

当 fn1 函数被调用时，fn1 执行上下文被创建（创建阶段）并入栈，其变量对象如下所示

```js
fn1_EC = {
  VO = {
    Arguments: {
      '0': 0,
      length: 1
    },
    a: 0,
    b: undefined,
    fn2: <function fn2 reference>,
    c:undefined
  }
}
```

执行阶段：

```js
fn1_EC = {
  AO = {
    Arguments: {
      '0': 0,
      length: 1
    },
    a: 0,
    b: 1,
    fn2: <function fn2 reference>,
    c:<function express c reference>,
  }
}
```

对于全局上下文来说，由于其不会有参数传递，所以在生成变量对象的过程中只有检索当前上下文中的函数声明和检索当前上下文中的变量声明两个步骤。

在浏览器环境中，全局上下文中的变量对象（全局对象）即我们熟悉的 window 对象，通过该对象可以使用其预定义的变量和函数，在全局环境中所声明的变量和函数，也会成为全局对象的属性。



##### 函数提升和变量提升

```jsx
console.log(a) // undefined
fn(0); // fn
var a = 0;
function fn() {
  console.log('fn')
}
```

全局上下文的创建阶段

```js
VO = {
  Arguments: {}, 
  ParamVariable: 具体值,  //形参变量
  Function: function fn() {console.log('fn')}
  Variable: a = undefined
}
```

个人理解：没执行一行，AO都会更新一次（给变量赋值），比如执行到`console.log(a) // undefined`此时由于AO中的a还未更新，所以输出undefined

所以实际执行过程：

```jsx
function fn() {
  console.log('fn')
}
var a = undefined;
console.log(a) // undefined
fn(0); // fn
a = 0;
```



#### 作用域链（Scope Chain）

+ **作用域链是指由当前上下文和上层上下文的一系列变量对象组成的层级链**。它保证了当前执行环境对符合访问权限的变量和函数的有序访问。

+ 我们已经知道，执行上下文分为创建和执行两个阶段，在执行上下文的执行阶段，当需要查找某个变量或函数时，会在当前上下文的变量对象（活动对象）中进行查找，若是没有找到，则会沿着上层上下文的变量对象进行查找，直到全局上下文中的变量对象（全局对象）。

+ 那么当前上下文是如何有序地去查找它所需要的变量或函数的呢？答案就是依靠当前上下文中的作用域链，其包含了当前上下文和上层上下文中的变量对象，以便其一层一层地去查找其所需要的变量和函数。

+ 执行上下文中的作用域链又是怎么建立的呢？我们都知道，JavaScript 中主要包含了全局作用域和函数作用域，而**函数作用域是在函数被声明的时候确定的**。

+ 每一个函数都会包含一个 [[scope]] 内部属性，在函数被声明的时候，该函数的 [[scope]] 属性会保存其上层上下文的变量对象，形成包含上层上下文变量对象的层级链。**[[scope]] 属性的值是在函数被声明的时候确定的**。

+ 当函数被调用的时候，其执行上下文会被创建并入栈。在创建阶段生成其变量对象后，会将该变量对象添加到作用域链的顶端并将 [[scope]] 添加进该作用域链中。而在执行阶段，变量对象会变为活动对象，其相应属性会被赋值。

+ 所以，作用域链是由当前上下文变量对象及上层上下文变量对象组成的

```js
SC = AO + [[scope]]
```

例如：

```js
var a = 1;
function fn1() {
  var b = 1;
  function fn2() {
    var c = 1;
  }
  fn2();
}
fn1();
```

在 fn1 函数上下文中，fn2 函数被声明，所以

```js
fn2.[[scope]]=[fn1_EC.VO, globalObj]
```

当 fn2 被调用的时候，其执行上下文被创建并入栈，此时会将生成的变量对象添加进作用域链的顶端，并且将 [[scope]] 添加进作用域链

```js
fn2_EC.SC=[fn2_EC.VO].concat(fn2.[[scope]])
=>
fn2_EC.SC=[fn2_EC.VO, fn1_EC.VO, globalObj]
```