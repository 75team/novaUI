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
var garfield = new Animal('Garfield');
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
`ClassName.superclass`指向父类的原型链，因此可通过`ClassName.superclass.methodName`获得父类原型链上方法的引用。

#Base

---
Base是一个基础类，提供[Event](#event), [Attribute](#attribute), [Aspect](#aspect)功能

---

## 使用方法

### Event

---

提供自定义事件的添加，移除和触发功能,  Example: 

```javascript
var Cat = Base.extend({
    initialize: function() {
        this.on('getup', function() {
            console.log('Strech~~');
        });
    }, 
    getup: function() {
        this.trigger('getup');
    }, 
    destroy: function() {
        this.off('getup');
    }
});
``` 
#### CustEvent

CustEvent对象的属性和方法  

`target`: 事件派发者   
`type`: 事件名称   
`timeStamp`: 事件发生的时间戳  
`preventDefault`: 该方法用于阻止后续绑定的处理函数的执行  


#### function on(eventType, callback, [context])
给对象绑定事件回调函数。*chainable*    
`eventType`：事件名  
`callback`：回调函数  
`context`：回调函数的this值。若为空，则毁掉函数的this默认指向事件绑定对象

#### function off([eventType], [callback])
给对象移除事件回调函数。   *chainable*  
`eventType`：事件名  
`callback`：回调函数  
```javascript
// off支持以下三种写法

ins.off();            // 移除ins上的所有事件回调函数

ins.off('change')        // 移除ins上change事件的所有回调函数

ins.off('change', onChange)        // 移除ins上change事件的名为onChange的回调函数
```

#### function trigger([eventType], [Array args])
触发一个或多个事件（用空格分离)。  
`eventType`：事件名  
`args`：传给回调函数的额外参数
```javascript
ins.on('change', function(ev, curValue, preValue) {
    // ...
});

ins.trigger('change', [curValue, prevValue]);        // 触发change事件，传递curValue和prevValue作为额外参数

ins.trigger('change switch', [curValue, prevValue]);        // 触发change和switch事件
```
回调函数中的第一个参数`ev`是一个CustEvent对象, 可通过调用ev.preventDefault()阻止后续绑定的处理函数的执行

### Attribute

---
提供基本的属性添加，获取，移除等功能

#### 属性初始化
#####类定义时，通过设置attrs来定义类的属性。
```javascript
var Person = Base.extend({
    // 在attrs中声明属性
    attrs: {
        name: 'someone'
    }
});
```

#####属性有以下选项：  
1. `value` 初始化值  
2. `getter` getter函数  
3. `setter` setter函数  
4. `mergeOnInit`  初始化是否与父类的该属性merge。若为true, 则merge。若为false, 则override。默认false。

#####声明属性的两种方式：
```javascript
var Person = Base.extend({
    attrs: {
        // 方式一：
        // 为方式二的简写，value为'someone,' setter, getter默认为空，mergeOnInit默认为false
        name: 'someone'

        // 方式二：
        name: {
            value: 'someone'， 
            setter: function(val, name, data) { /* ... */ }, 
            getter: function(val, name) {  /* ... */ }, 
            mergeOnInit: true
        }
    }
});
```


#####mergeOnInit的作用：
```javascript
var Switchable = Base.extend({
    attrs: {
        classNames: {
            container: 'ui-container', 
            content: 'ui-content' 
        }
    }
})

var Tab = Switchable.extend({
    attrs: {
        classNames: {
            value: {
                control: 'ui-control'
            }, 
            mergeOnInit: true
        }
    }
});

var tab = new Tab();
var classNames = tab.get('classNames');    // {container: 'ui-container', content: 'ui-content', control: 'ui-control'}
```
当属性的`mergeOnInit`选项为true时，会在初始化属性时，将其与父类的该属性merge，而不是override。
若`mergeOnInit`为false，则以上代码得到的classNames则为{control: 'ui-control'}

#### function set(key, value, [options])
设置某个值的属性，如果有定义setter，会先调用setter  
`key`：属性名  
`value`：属性值  
`options`：额外参数。  
`options.silent`决定是否触发change事件, 为true时不触发。默认为false。  
`options.merge`决定是merge属性还是override属性。为true时进行merge，默认为false。  
`options.data`是会被传给setter方法和change事件回调函数的额外数据。  
`@return`：设置结果。true代表成功。当设置不存在的属性，或setter返回`ATTRIBUTE_INVALID_VALUE`时，会返回false

```javascript
// set支持的写法

// 通过传入属性名值对设置
ins.set('name', 'wendy', { silent: true, merge: false, data: { } });

// 传入一个包含多个属性名值对的对象来设置
var attrs = {
    name: 'wendy',
    gender: 'female'
};
ins.set(attrs);

// 设置子属性
ins.set('family.daddy', 'Stephen');

```

#### function get(key)
获取某个属性的值，如果有定义getter，会返回getter的返回值。  
`key`：属性名  
`@return`：属性值，如果有定义getter，会返回getter的返回值。当属性不存在时，返回false
```javascript
// get支持的写法

// 当传入为空时，返回所有属性
var attrs = ins.get();

// 返回名为name的属性
var name = ins.get('name');

// 但回family属性的子属性daddy
var dad = ins.get('family.daddy');
```

#### setter
属性若有定义`setter`，则在设置属性时，会调用`setter`，再将属性值设为它的返回值。

##### function setter(value, name, data) 
`value`：`set()`传入的属性值  
`name`：`set()`传入的属性名  
`data`：`set()`传入的`options.data`  
`@return`：返回值为属性最终的值， 若设置值不合理，可返回`ATTRIBUTE_INVALID_VALUE`，代表设置值无效，不会改变属性的值，并且`set`方法会返回false  

```markup
<html>
haha
</html>
```

Example: 
```javascript
var Person = Base.extend({
    attrs: {
        age: {
            value: 18,
            setter: function(age) {
                if(age < 0) return ATTRIBUTE.INVALIE_VALUE;
                return age;
            }
        }
    }
});
```

#### getter
属性若有定义`getter`，则会在调用对象调用`get()`时触发，并返回`getter()`返回的值

##### function getter(value, name)
`value`：`get()`传入的属性值  
`name`：`get()`传入的属性名  
`@return`：为最终`get()`返回的值  

Example: 
```javascript
var Person = Base.extend({
    attrs: {
        age: {
            value: 18,
            getter: function(age) {
                return age + ' years old';
            }
        }
    }
});
```

#### change事件
当通过`set()`改变属性值时，会触发`chan
