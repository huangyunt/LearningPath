# Mini-React

#### 项目拆解：

1. Jsx 和虚拟 DOM

2. 组件和生命周期

3. Diff

4. 异步的setState

5. hook支持

#### 具体思路

##### 将jsx经过babel转成React.createElement的形式

例如

```react
class Hem extends React.Component {
    render() {
        return (
            <A>
                <B>
                    <C>
                        <div />
                        <span />
                    </C>
                    <D />
                </B>
                <E />
                <F />
            </A>
        );
    }
}
```

经过babel转义后

```javascript
_createClass(Hem, [
    {
        key: "render",
        value: function render() {
            return React.createElement(
                A,
                null,
                // A组件的亲儿子组件B
                React.createElement(
                    B,
                    null,
                    React.createElement(
                        C,
                        null,
                        // C组件的亲儿子 div
                        React.createElement("div", null),
                        // C组件的亲儿子 span
                        React.createElement("span", null)
                    ),
                    React.createElement(D, null)
                ),
                // A组件的亲儿子组件E
                React.createElement(E, null),
                // A组件的亲儿子组件F
                React.createElement(F, null)
            );
        },
    },
]);
```

##### createElement生成虚拟dom

