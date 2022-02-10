# Hooks

### hooks的作用

**钩子（hook）就是 React 函数组件的副效应解决方案，用来为函数组件引入副效应。** 函数组件的主体只应该用来返回组件的 HTML 代码，所有的其他操作（副效应）都必须通过钩子引入。

由于副效应非常多，所以钩子有许多种。React 为许多常见的操作（副效应），都提供了专用的钩子。

- `useState()`：保存状态
- `useContext()`：保存上下文
- `useRef()`：保存引用
- ......

上面这些钩子，都是引入某种特定的副效应，而 **`useEffect()`是通用的副效应钩子** 。找不到对应的钩子时，就可以用它。其实，从名字也可以看出来，它跟副效应（side effect）直接相关。

### useEffect

`useEffect()`本身是一个函数，由 React 框架提供，在函数组件内部调用即可。

例如：

> ```javascript
> import React, { useEffect } from 'react';
> 
> function Welcome(props) {
>   useEffect(() => {
>     document.title = '加载完成';
>   });
>   return <h1>Hello, {props.name}</h1>;
> }
> ```

上面例子中，`useEffect()`的参数是一个函数，它就是所要完成的副效应（改变网页标题）。组件加载以后，React 就会执行这个函数。

`useEffect()`的作用就是指定一个副效应函数，组件每渲染一次，该函数就执行一次。**组件首次在网页 DOM 加载后，副效应函数也会执行。**



#####  useEffect指定依赖项

有时候，我们不希望`useEffect()`每次渲染都执行，这时可以使用它的第二个参数，使用一个数组指定副效应函数的依赖项，只有依赖项发生变化，才会执行。

如果上例改为

```react
function Welcome(props) {
  useEffect(() => {
    document.title = '加载完成';
  }, []);
  return <h1>Hello, {props.name}</h1>;
}
```

便只会在组件首次挂载时执行函数，相当于class component中的componentDidMount



##### useEffect() 的用途

只要是副效应，都可以使用`useEffect()`引入。它的常见用途有下面几种。

- 获取数据（data fetching）
- 事件监听或订阅（setting up a subscription）
- 改变 DOM（changing the DOM）
- 输出日志（logging）



##### useEffect返回值

副效应是随着组件加载而发生的，那么组件卸载时，可能需要清理这些副效应。

`useEffect()`允许返回一个函数，在组件卸载时，执行该函数，清理副效应。如果不需要清理副效应，`useEffect()`就不用返回任何值。

> ```javascript
> useEffect(() => {
>   const subscription = props.source.subscribe();
>   return () => {
>     subscription.unsubscribe();
>   };
> }, [props.source]);
> ```

上面例子中，`useEffect()`在组件加载时订阅了一个事件，并且返回一个清理函数，在组件卸载时取消订阅。

**实际使用中，由于副效应函数默认是每次渲染都会执行，所以清理函数不仅会在组件卸载时执行一次，每次副效应函数重新执行之前，也会执行一次，用来清理上一次渲染的副效应。**



##### useEffect常见问题

###### **使用useEffect应该在依赖的变量中指明定义的函数会用到哪些state或者props**

effect 可能会使用一些频繁变化的值。可能会忽略依赖列表中 state，但这通常会引起 Bug：<span name = "233"> </span>

```react
function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      console.log(count);
      setCount(count + 1); // 这个 effect 依赖于 `count` state    
    }, 1000);
    return () => clearInterval(id);
  }, []); // 🔴 Bug: `count` 没有被指定为依赖
  return <h1>{count}</h1>;
}
```

传入空的依赖数组 `[]`，意味着该 hook 只在组件挂载时运行一次，并非重新渲染时。但如此会有问题，在 `setInterval` 的回调中，`count` 的值不会发生变化。因为当 effect 执行时，**react会创建一个闭包，并将 `count` 的值被保存在该闭包当中，且初值为 `0`。每隔一秒，回调就会执行 `setCount(0 + 1)`，因此，`count` 永远不会超过 1。**

指定 `[count]` 作为依赖列表就能修复这个 Bug，但会导致每次改变发生时定时器都被重置。事实上，每个 `setInterval` 在被清除前都会调用一次（等于说直接使用 `setTimeout`就行了）。要解决这个问题，可以使用类似setState函数式更新的操作，不依赖外部count变量，它允许我们指定 state 该如何改变而不用引用state或者props

```react
function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + 1); // ✅ 在这不依赖于外部的 `count` 变量    }, 1000);
    return () => clearInterval(id);
  }, []); // ✅ 我们的 effect 不使用组件作用域中的任何变量
  return <h1>{count}</h1>;
}
```



##### useLayoutEffect vs. useEffect

useLayoutEffect 和 useEffect 的传参一致，但有以下区别

1. 执行时机不同。useLayoutEffect 的入参函数会在 react 更新 DOM 树后同步调用（**其实就是dom树更新，浏览器重绘前会执行useLayoutEffect里的函数，此时比如去拿 style 或者 dom 尺寸，都是游览器即将渲染的那一次的尺寸，而不是现在页面上展示的尺寸**），useEffect 为异步调用（useEffect 则肯定是在游览器渲染完后才执行），所以应该尽可能使用标准的 `useEffect` 以避免阻塞视觉更新
2. useLayoutEffect 在 development 模式下 SSR 会有警告⚠️

通常情况下 useLayoutEffect 会用在做动效和记录 layout 的一些特殊场景（比如防止渲染闪烁，在渲染前再给你个机会去改 DOM）。一般不需要使用 useLayoutEffect。



### useRef

当需要存放一个数据，需要无论在哪里都取到最新状态时，需要使用 useRef，**ref 是一种可变数据。**

<a href="#233">如上文提到的代码段</a> 中，因为存在闭包问题，count永远会为1，log永远为0；

可以引入<code>useRef</code>解决这个问题

```react
function Counter() {
  const [count, setCount] = useState(0);
  const currentCount = useRef(count);
  // 这里在每一次组件重新渲染后更新ref的值
  currentCount.current = count;
  useEffect(() => {
    const id = setInterval(() => {
      console.log(currentCount.current)
      setCount(currentCount.current + 1); // 这个 effect 依赖于 `count` state    
    }, 1000);
    return () => clearInterval(id);
  }, []); // 🔴 Bug: `count` 没有被指定为依赖
  return <h1>{count}</h1>;
}
```



### useState、useRef 如何决策用哪种来维护状态

useRef 生成的可变对象，因为使用起来就跟普通对象一样，赋值时候 React 是无法感知到值变更的，所以也不会触发组件重绘。利用其与 useState 的区别，我们一般这样区分使用：

- 维护与 UI 相关的状态，使用 useState

> 确保更改时刷新 UI

- 值更新不需要触发重绘时，使用 useRef
- 不需要变更的数据、函数，使用 useState

> 比如，需要声明一个不可变的值时，可以这样：

> ```
> const [immutable] = useState(someState);
> ```

> 不返回变更入口函数。useRef 虽然可以借助 TypeScript 达到语法检测上的 immutable，但实际还是 mutable 的。



### useContext

##### context简介：

`React.createContext` 新建context

```
const MyContext = React.createContext(defaultValue);
```

创建一个 Context 对象。当 React 渲染一个订阅了这个 Context 对象的组件，这个组件会从组件树中离自身最近的那个匹配的 `Provider` 中读取到当前的 context 值。

**只有**当组件所处的树中没有匹配到 Provider 时，其 `defaultValue` 参数才会生效。此默认值有助于在不使用 Provider 包装组件的情况下对组件进行测试。**注意：将 `undefined` 传递给 Provider 的 value 时，消费组件的 `defaultValue` 不会生效。**



`Context.Provider`

每个 Context 对象都会返回一个 Provider React 组件，它允许消费组件订阅 context 的变化。



##### useContext使用

接收一个 context 对象（`React.createContext` 的返回值）并返回该 context 的当前值。当前的 context 值由上层组件中距离当前组件最近的 `<MyContext.Provider>` 的 `value` prop 决定。

当组件上层最近的 `<MyContext.Provider>` 更新时，该 Hook 会触发重渲染，并使用最新传递给 `MyContext` provider 的 context `value` 值。即使祖先使用 [`React.memo`](https://zh-hans.reactjs.org/docs/react-api.html#reactmemo) 或 [`shouldComponentUpdate`](https://zh-hans.reactjs.org/docs/react-component.html#shouldcomponentupdate)，也会在组件本身使用 `useContext` 时重新渲染。

```react
import React, { useContext, useState } from "react";
import { ThemeContext, themes } from "./utils/index";

export default function App() {
    const [theme, setTheme] = useState(themes.light);
    return (
        <ThemeContext.Provider
            value={{
                theme,
                toggle: () =>
                    setTheme(
                        theme === themes.light ? themes.dark : themes.light
                    ),
            }}
        >
            <Toolbar />
        </ThemeContext.Provider>
    );
}

function Toolbar() {
    return (
        <div>
            <ThemedButton />
        </div>
    );
}

function ThemedButton() {
    const context = useContext(ThemeContext);
    return (
        <button
            style={{
                background: context.theme.background,
                color: context.theme.foreground,
            }}
            onClick={context.toggle}
        >
            I am styled by theme context!
        </button>
    );
}

```



### useMemo

useMemo 主要有两个作用：

1. 缓存一些耗时计算，通过声明计算结果的依赖是否变更，来重用上次计算结果
2. 保证引用不变，针对下游使用 React.memo 的组件进行性能优化（useCallback 也有一样的作用）



比如，计算耗时的 fibonacci 数列，就可以用 useMemo 来优化在 n 不变的情况下，二次渲染的性能

`useMemo(() => {  return fibonacci(props.n) }, [props.n]); `



### useCallback

useCallback 是简化版的 useMemo，方便缓存函数引用。下面的代码是等价的：

```JavaScript
const memoCallback = useCallback((...args) => {
  // DO SOMETHING
}, [...deps]);
```

> ```JavaScript
> const memoCallback = useMemo(() => (...args) => {
>   // DO SOMETHING
> }, [...deps]);
> ```
>
> 在么有遇到性能问题时，不要使用 useCallback 和 useMemo，性能优化先交给框架处理解决。手工的微优化在没有对框架和业务场景有深入了解时，可能出现性能劣化。

> [致命的 useCallback/useMemo（翻译）](https://bytedance.feishu.cn/docs/doccnKcSsW0lazRObCmw3GlGkmd) 

> [useCallback hell问题总结](https://bytedance.feishu.cn/docs/doccn9SDGhQJ6mM58BxjfRJFs3d) 

> 关于如何减少 useCallback 看 **[第二天](https://bytedance.feishu.cn/docs/doccnmgIb5KcV3F0zeE47o6PvCh#KQKJ2M)**
>
> 

### 组件通信

##### 爷孙组件通信

爷孙组件通信主要有 3 种方式：

1. 将孙子组件的 props 封装在一个固定字段中
2. 通过 children 透传
3. 通过 context 传递

假设有个三层组件，爷爷分别给儿子和孙子发红包

先看青铜解决方案：

```JavaScript
function Grandpa() {
  const [someMoneyForMe] = useState(100);
  const [someMoneyForDaddy] = useState(101);
  return <Daddy money={someMoneyForDaddy} moneyForSon={someMoneyForMe} />;
}
function Daddy(props: { money: number; moneyForSon: number }) {
  const { money, moneyForSon } = props;
  return (
    <div className="daddy">
      <h2>This is Daddy, received ${money}</h2>
      <Me money={moneyForSon} />
    </div>
  );
}
function Me(props: { money: number }) {
  const { money } = props;
  return (
    <div className="son">
      <h3>This is Me, received ${money}</h3>
    </div>
  );
}
```

Daddy 组件会透传爷爷给孙子的组件给 Me。这种方案的缺点很明显，以后爷爷要给 Daddy 和 Me 发糖果的时候，Daddy 还得加字段。



**将孙子组件的 props 封装在一个固定字段中**

按照 1 的方案，我们可以固定给 Daddy 添加一个 sonProps 的字段，然后将 Grandpa 需要传给孙子的状态全部通过 sonProps 传递

```JavaScript
function Grandpa() {
  const [someMoneyForMe] = useState(100);
  const [someMoneyForDaddy] = useState(101);
  return <Daddy money={someMoneyForDaddy} sonProps={{money: someMoneyForMe}} />;
}
function Daddy(props: { money: number; sonProps: Parameters<typeof Me>[0]; }) {
  const { money, sonProps } = props;
  return (
    <div className="daddy">
      <h2>This is Daddy, received ${money}</h2>
      <Me {...sonProps}/>
    </div>
  );
}
function Me(props: { money: number }) {
  const { money } = props;
  return (
    <div className="son">
      <h3>This is Me, received ${money}</h3>
    </div>
  );
}
```

这样以后要给 Me 加字段，就不用改 Daddy 了。**但要测试 Daddy 时还得 mock Me 组件的数据，Daddy 和 Son 耦合。**



**通过 children 透传**

children 类似于 vue 中的 slot，可以完成一些嵌套组件通信的功能

```JavaScript
function Grandpa() {
  const [someMoneyForMe] = useState(100);
  const [someMoneyForDaddy] = useState(101);
  return (
    <Daddy money={someMoneyForDaddy}>
      <Me money={someMoneyForMe} />
    </Daddy>
  );
}
function Daddy(props: { money: number; children?: React.ChildNode }) {
  const { money, children } = props;
  return (
    <div className="daddy">
      <h2>This is Daddy, received ${money}</h2>
      {children}
    </div>
  );
}
function Me(props: { money: number }) {
  const { money } = props;
  return (
    <div className="son">
      <h3>This is Me, received ${money}</h3>
    </div>
  );
}
```

将 Daddy 的嵌套部分用 children 替代后，解耦了子组件和孙子组件的依赖关系，Daddy 组件更加独立。

作为替代，也可以传递一个组件实例：

<code><Daddy money={someMoneyForDaddy} me={<Me money={someMoneyForMe} /> </code>



**三种方案的决策**

1. 第一种方案一般用于固定结构和跨组件有互相依赖的场景，多见于 UI 框架中的复合组件与原子组件的设计中
2. 第二种常用在嵌套层级不深的业务代码中，比如表单场景。**优点是顶层 Grandpa 的业务收敛度很高，一眼能看清 UI 结构及状态绑定关系，相当于拍平了 React 组件树**
3. 第三种比较通用，适合复杂嵌套透传场景。缺点是范式代码较多，且会造成 react dev tools 层级过多；Context 无法在父组件看出依赖关系，必须到子组件文件中才能知道数据来源



### 组件的生命周期

React 函数组件的执行阶段分为：

1. Render 阶段

此阶段就是函数本体的执行阶段

1. Commit 阶段

Commit 阶段是拿着 render 返回的结果，去同步 DOM 更新的阶段。render 和 commit 分开以达到批量更新 DOM 的目的，也是 react 之后推出并行模式的设计基础。对于我们代码能感知到的部分就是 useLayoutEffect

1. DOM 更新结束

此时 DOM 已经更新完成，代码能感知到的部分 代码上的体现就是执行 useEffect



### React 性能优化思路

我觉得React 性能优化的理念的主要方向就是这两个：

1. **减少重新 render 的次数。因为在 React 里最重(花时间最长)的一块就是 reconciliation(简单的可以理解为 diff)，如果不 render，就不会 reconciliation。**
2. **减少计算的量。主要是减少重复计算，对于函数式组件来说，每次 render 都会重新从头开始执行函数调用。**

在使用类组件的时候，使用的 React 优化 API 主要是：`shouldComponentUpdate`和  `PureComponent`，这两个 API 所提供的解决思路都是为了**减少重新 render 的次数**，主要是减少父组件更新而子组件也更新的情况。

但是在函数式组件里面没有声明周期也没有类，那如何来做性能优化呢？

**先分个类，组件什么时候会重新执行？**

1. **组件自己的状态改变**
2. **父组件重新渲染，导致子组件重新渲染，但是父组件的 props 没有改变**
3. **父组件重新渲染，导致子组件重新渲染，但是父组件传递的 props 改变**



针对第二点，在FC中，可以通过memo减少rerender

```react
function Component(props) {
   /* 使用 props 渲染 */
}
const MyComponent = React.memo(Component);
```

通过 `React.memo` 包裹的组件在 props 不变的情况下，这个被包裹的组件是不会重新渲染的(相当于PureComonent)

默认情况下其只会对 props 的复杂对象做浅层对比(浅层对比就是只会对比前后两次 props 对象引用是否相同，不会对比对象里面的内容是否相同)，如果你想要控制对比过程，那么请将自定义的比较函数通过第二个参数传入来实现。

```react
function MyComponent(props) {
  /* 使用 props 渲染 */
}
function areEqual(prevProps, nextProps) {
  /*
  如果把 nextProps 传入 render 方法的返回结果与
  将 prevProps 传入 render 方法的返回结果一致则返回 true，
  否则返回 false
  */
}
export default React.memo(MyComponent, areEqual);
```

