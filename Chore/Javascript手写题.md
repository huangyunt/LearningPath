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
    
    function myNew(Person, ...args) {
        // 修改that.__proto__ = Dog.prototype，如果直接that = {}会出现没有对象标识的问题（对象标识为Object），还会使得方法没有被创建
        const that = Object.create(Person.prototype);
        Person.apply(that, args);
        return that;
    }
    const p1 = myNew(Person, 19, 'hyz');
```

