# Javascript手写题

#### 1. 实现一个new

**new的具体步骤**

1. 内存中创建一个新对象
2. 调用构造函数，this指向新创建的对象
3. 返回这个对象

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



#### 2. 实现一个Object.create

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

