# Class

---
提供简单的OO原型继承
---

## 使用说明:

### 创建类：

通过`Class.extend([properties])`创建类， `properties`是要混入到原型的属性，
Example: 
```javascript
var Animal = Class.extend({
    name: 'an animal',
    initialize: function(name) {
        this.name = name;
    }
});
var garfile = new Animal('Garfile');
```

`initialize` 为初始化方法，会在创建实例时被调用

### 继承：

使用`Class.extend`创建的类，也拥有`extend`方法，可以继续创建子类,  Example: 

```javascript
var Cat = Animal.extend({
    talk: function() {
        alert('Miao~');
    }
})
```

### 调用父类同名方法

```javascript
var Cat = Animal.extend({
    sleep: function() {
        console.log('lick~');
        Cat.superclass.sleep.apply(this, arguments);        // 调用父类sleep方法
    }
})
```
`Cat.superclass`指向父类的原型链，因此可通过`Cat.superclass.methodName`获得父类原型链上方法的引用。