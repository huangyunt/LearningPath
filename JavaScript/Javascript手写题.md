# Javascript手写题



#### 实现一个new

**new的具体步骤**

1. 内存中创建一个新对象
2. 新建对象的 _ _proto_ _指向构造函数的prototype
3. 调用构造函数，函数的this指向新创建的对象
4. 执行构造函数内部的代码（给新对象添加属性）
5. **如果构造函数返回非空对象，则返回该对象，否则，返回新创建的对象**

```javascript
    function Person(age, name) {
        this.age = age;
        this.name = name;
    }
    Person.prototype.sayHello = function() {
        console.log(this.name);
    }
    
    function myNew(fn, ...args) {
        // 修改obj.__proto__ = fn.prototype，如果直接obj = {}会出现没有对象标识的问题（对象标识为Object），还会使得方法没有被创建
        const obj = Object.create(fn.prototype)  //fn.prototype代表 用当前对象的原型去创建
        //现在obj就代表Dog了,但是参数和this指向没有修改
        const rel = fn.apply(obj,args)
        /*
           正常规定,如何fn返回的是null或undefined(也就是不返回内容),我们返回的是obj,否则返回rel
           因为比如下面这个构造函数
           function Person(name, age) {
                this.name = name;
                this.age = age;
            	return {
                	a: 1,
                	b: 2,
            	}
        	}
        	const p = new Person('h', 'y');
        	这里new会优先为构造函数的返回值
        	所以p的值为{a: 1,b: 2}
        */
        return rel instanceof Object ? rel : obj
    }
    const p1 = myNew(Person, 19, 'hyz');
```



#### 实现一个Object.create

Object.create(proto)创建一个空对象，proto为空对象的"___proto___"

```javascript
export function create(obj) {
  // Object.create(null) 返回一个__proto__指向空的干净对象
  if (obj === null) {
    return Object.setPrototypeOf({}, null);
  }
  // 非对象非null，抛出异常
  if (!(obj instanceof Object)) {
    throw new TypeError();
  }
  return Object.setPrototypeOf({}, obj);
}
```



#### 虾皮笔试题

十分有水平的一道题，综合了new原理，原型链+instanceof原理

```javascript
    function Person() {

    }
    let person1 = new Person();
    Person.prototype = {
        name: 'ee',
        sayName: () => {

        }
    }    
    // Person 的 prototype 已经改变，而 person1.__proto__ 指向一开始的 Person.prototype
    console.log('person1 instanceof Person: ', person1 instanceof Person) // 为啥是false
    // 所有的对象都继承自 Object，除了 null 或者你把最顶层的 prototype 也给改了
    console.log('person1 instanceof Object: ', person1 instanceof Object) // 为啥是true
    // person1 本身没有 constructor, 会沿着原型链找，
    // person1.constructor === person1.__proto__.constructor
    // 而上面也说了 person1.__proto__ 并没有因为 Person.prototype 改变而改变
    // 这里需要注意的是：
    // Person 本身就是 constructor
    // 初始情况下
    // Person.prototype => Person.prototype
    // Person.prototype.constructor => Person
    console.log('person1.constructor == Person: ', person1.constructor == Person) // 为啥是true
    // 上面是 true, 下面就好说了
    console.log('person1.constructor == Object: ', person1.constructor == Object) // 为啥是false
```



#### 实现消息订阅

```javascript
class EventCenter {
    /**
     * @param {Map<string, Array<Function>} handlers
     */
    constructor(handlers=new Map()) {
        this.handlers = handlers;
    }
    /**
     * @param {Function} handler
     * @param {string} type
    */
    addEventListener(type, newHandler) {
        let hanlder = this.handlers.has(type);
        if (hanlder) {
            this.handlers.set(type, [...this.handlers.get(type), newHandler]) 
        }
        else {
            this.handlers.set(type, [newHandler]);
        }
    }
    /**
     * @param {string} type
     * @param {Array} params
    */
    dispatchEvent(type, params=[]) {
        const handler = this.handlers.get(type);
        handler && handler.forEach((callback) => {
            callback(...params);
        })
    }
    /**
     * 
     * @param {string} type 
     * @param {Function} delHandler 
     * @returns 
     */
    removeEventListener(type, delHandler) {
        if (!this.handlers.has(type)) {
            return new Errow("Unable to delete")
        }
        if (delHanlder) {
            const oldHandlers = this.handlers.get(type);
            const ind = oldHandlers.indexOf(delHandler);
            if (ind === -1) {
                return new Errow("Unable to delete")
            }
            oldHandlers.splice(ind, 1);
        }
        else {
            this.handlers.delete(type);
        }
    }
}
```



#### 实现一个JSONP

前端部分

```js
    function jsonp(url, options) {
        // 超时处理
        const { timeout } = options;
        return new Promise((resolve, reject) => {
            // 防止函数名冲突
            let funcName = `jsonp${Date.now()}`;
            let time = null, scriptNode;
            // 定义callback
            window[funcName] = function (data) {
                if (timeout) clearTimeout(time);
                resolve(data);
                // 很重要的性能优化点
                // 清除本次请求产生的回调函数和script标签
                delete window[funcName];
                document.body.removeChild(scriptNode);
            }
            // 创建script标签
            scriptNode = document.createElement('script');
            // 给script标签添加src属性
            scriptNode.src = `${url}?callback=${funcName}`;
            // 发出请求
            document.body.appendChild(scriptNode);
            time = setTimeout(() => {
                reject('network err, timeout')
            }, timeout)
            // 失败
            scriptNode.onerror = function (err) {
                reject(err);
            }
        })
    }
    jsonp('http://localhost:9090/api', {
        callBack: 'res1',
        // 超时处理
        timeout: 3000
    })
        // 请求成功
        .then(res => {
            console.log('jsonp->', res);
        })
        // 请求失败
        .catch(err => {
            console.log("network err!")
        })
```

后端部分

```javascript
// 后端
const http = require('http');
const url = require('url');
http.createServer((req, res) => {
  // /api?callback=onResponse
  // 解析前端请求url中的callback名
  if(req.url.includes('/api')) {
    let myurl = url.parse(req.url);
    let params = new URLSearchParams(myurl.query)
    let posts = ['js', 'php'];
    let mathodName = params.get('callback');
    res.end(`${mathodName}(${JSON.stringify(posts)})`)
  }
})
.listen(9090, () => {
  console.log(9090);
})

```

