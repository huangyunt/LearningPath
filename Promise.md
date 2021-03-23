# Promise

### 引言：

感觉promise的思想非常有意思，为了代码的可读性和可维护性提供了一种新的异步编程方法，接触了一段时间的工程代码也让我体会到代码可维护，可拓展的必要性。



### 为什么要用Promise？

对于异步操作，例如文件读取

```javascript
var fs = require('fs')

fs.readFile('./a.txt', 'utf-8', function(err, data) {
    if (err) {
        throw err;
    }
    console.log(data);
})
fs.readFile('./b.txt', 'utf-8', function(err, data) {
    if (err) {
        throw err;
    }
    console.log(data);
})
fs.readFile('./c.txt', 'utf-8', function(err, data) {
    if (err) {
        throw err;
    }
    console.log(data);
})

```

输出结果：

![image-20210324010746141](./picture/image-20210324010746141.png)

由于读取文件为异步操作，输出的结果不确定。

为了a -> b -> c依次读取文件：

```javascript
fs.readFile('./src/a.txt', 'utf-8', function(err, data) {
    if (err) {
        throw err;
    }
    console.log(data);
    fs.readFile('./src/b.txt', 'utf-8', function(err, data) {
        if (err) {
            throw err;
        }
        console.log(data);
        fs.readFile('./src/c.txt', 'utf-8', function(err, data) {
            if (err) {
                throw err;
            }
            console.log(data);
        })
    })
})
```

回调函数嵌套回调函数，导致了回调地狱，带来的问题也很明显，不便于维护，阅读，异常处理。

使用promise：

```javascript
var fs = require('fs')
function myReadFile(url) {
    return new Promise((resolve, reject) => {
        fs.readFile(url, 'utf-8', function(err, data){
            if (err) {
                reject(err);
            }
            resolve(data);
        })
    })
}
myReadFile('./a.txt')
.then(value=>{
    console.log(value);
    return myReadFile('./b.txt');
})
.then(value=> {
    console.log(value);
    return myReadFile('./c.txt');
})
.then(value=>{
    console.log(value);
})
.catch(reason=> {
    console.log('reason', reason);
});
```

由于异常穿透，异常只需要在最后捕获，代码的可读性和维护性也更高，解决了回调地狱的问题。



### Promise的工作流程

![image-20210321164956018](./picture/image-20210321164956018.png)



### 如何改变promise对象的状态？

```javascript
          let p = new Promise((resolve, reject) => {
            //1. resolve 函数
            // resolve(''); // pending   => fulfilled (resolved)
            //2. reject 函数
            // reject("");// pending  =>  rejected 
            //3. 抛出错误
            //throw '出问题了';// pending  =>  rejected
        });

```

+ Promise对象初始状态

![image-20210321172121084](./picture/image-20210321172121084.png)

+ Promise对象成功状态

![image-20210322004628047](./picture/image-20210322004628047.png)

+ Promise对象失败状态

![image-20210322004718603](./picture/image-20210322004718603.png)



### Promise可以执行多个成功/失败的回调

```javascript
        let p = new Promise((resolve, reject) => {
            resolve('OK');
        });

        ///指定回调 - 1
        p.then(value => {
            console.log(value);
        });
        //指定回调 - 2
        p.then(value => {
            alert(value);
        });
```



### Promise.prototype.then

#### Promise.prototype.then()返回的新 promise 的结果状态由什么决定?

由 then()指定的回调函数执行的结果决定

1. 如果抛出异常, 新 promise 变为 rejected, *[[PromiseResult]]*为抛出的异常 

2. 如果返回的是非 promise 的任意值, 或者没有返回值（相当于返回undefined），新 promise 变为 resolved, *[[PromiseResult]]*为返回的值 

3. 如果返回的是另一个新 promise, 此 promise 的*[[PromiseResult]]*就会成为新 promise 的*[[PromiseResult]]*

```javascript
       let result = p.then(value => {
            // console.log(value);
            //1. 抛出错误
            // throw '出了问题';
            //2. 返回结果是非 Promise 类型的对象
            // return 521;
            //3. 返回结果是 Promise 对象
            // return new Promise((resolve, reject) => {
            //     // resolve('success');
            //     reject('error');
            // });
        }, reason => {
            console.warn(reason);
        });
```

#### Promise.prototype.then()的链式调用

```javascript
        let p = new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve('OK');
            }, 1000);
        });

        p.then(value => {
            return new Promise((resolve, reject) => {
                resolve("success");
            });
        }).then(value => {
            console.log(value);
        }).then(value => {
            console.log(value);//输出undefine，原因：上一次的then方法返回值为undefine，所以上一次返回一个参数为undefine，状态为resolve的promise对象
        })
```

#### 异常穿透

1. 当使用 promise 的 then 链式调用时, 可以在最后指定失败的回调。

2. 前面任何操作出了异常, 都会传到最后失败的回调中处理

```javascript
        let p = new Promise((resolve, reject) => {
            setTimeout(() => {
                //resolve('OK');
                reject('Err');
            }, 1000);
        });

        p.then(value => {
            // console.log(111);
            throw '失败啦!';
        }).then(value => {
            console.log(222);
        }).then(value => {
            console.log(333);
        }).catch(reason => {
            console.warn(reason);
        });
```



```javascript
        let p = new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve('OK');
            }, 1000);
        });

        p.then(value => {
            console.log(111);
            //有且只有一个方式
            return new Promise(() => {});
        }).then(value => {
            console.log(222);
        }).then(value => {
            console.log(333);
        }).catch(reason => {
            console.warn(reason);
        });
```



### Promise.resolve

    + 如果传入的参数为 非Promise类型的对象, 则返回的结果为成功promise对象
    + 如果传入的参数为 Promise 对象, 则参数的结果决定了 resolve 的结果

```javascript
        let p1 = Promise.resolve(521);
        let p2 = Promise.resolve(new Promise((resolve, reject) => {
            // resolve('OK');
            reject('Error');
        }));
        // console.log(p2);
        p2.catch(reason => {
            console.log(reason);
        })
```



### Promise.reject

Promise.reject(reason)方法返回一个失败的promise对象（无论reason是什么）

```javascript
        let p3 = Promise.reject(new Promise((resolve, reject) => {
            resolve('OK');
        }));
        console.log(p3);
```

输出：

![image-20210321171102762](./picture/image-20210321171102762.png)



### Promise.prototype.catch

**catch()** 方法返回一个Promise，只处理拒绝的情况。它的行为与调用[`Promise.prototype.then(undefined, onRejected)`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/then)相同。

