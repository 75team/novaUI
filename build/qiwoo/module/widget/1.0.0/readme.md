# Widget

---
Widget 是 UI 组件的基础类，它约定了组建的生命周期，提供了一些事件代理，data-api, widget缓存查询，onRender等功能。       
Widget继承自Base, 因此也拥有class, events, attribute, aspect等功能。

---

## 定义一个组件
```js
// 继承自Widget
var Panel = Widget.extend({
    // 组件默认配置
    attrs: {
        className: 'panel', 
        
        events: {
            'click .closeBtn': 'closePanel'
        },

        template: '<div><p class="content"></div><button class="closeBtn">关闭</button></div>'
        parentNode: 'body'
    }, 

    // 组件初始化方法
    setup: function() {
        var ele = this.element, 
            $ele = this.$element, 
            config = this.get();

        // Do something

        // 渲染this.element，插入到文档流
        this.render();
    }
});
```

## 生命周期
Widget 有一套完整的生命周期，控制着组件从创建到销毁的整个过程。主要有 initialize，render，destroy 三个过程。

### Initialize
Widget 在实例化的时候会做一系列初始化操作，包括缓存实例，解析配置，初始化事件等。并最后调用子类的初始化方法`setup()`

### Render
将`this.element`插入到文档流中，默认插入到document.body，可以通过parentNode指定。  
Render 这一步操作从 Initialize 中独立出来，因为有些组件在实例化的时候不希望操作 DOM，如果希望实例化的时候处理可在 setup 里调用 `this.render()`。

### Destroy
组件销毁。将 widget 生成的 element 和事件都销毁。

## 模板渲染
每个 Widget 只会对应一个 element，会对他的 DOM 及事件进行操作。

element 的生成有两种情况

1. 实例化的时候传入
2. 由 template 生成  

Widget 默认处理模板的方式是直接转换成 jQuery 对象，但不能处理数据。
渲染后，可通过`this.element`和`this.$element`分别获得DOM element和经过jQuery包装的element。

## 事件代理

使用Widget提供的事件代理有如下好处： 
 
1. 所有事件都代理到`this.element`上。这样若DOM内容有修改，无需重新绑定。  
2. 回调函数的`this`指向组件实例  
3. 支持以配置形式声明事件代理  

### 事件代理API

#### function delegateEvents([element], events, handler)

`element`：事件代理的对象，为空时，默认代理到this.element上  
`events`：事件类型和Selector，如'click .btn'  
`handler`：回调函数。可传入Function或实例上的方法名  

Example: 
```js
// 将this.clickHandler代理到ele上
this.delegateEvents(ele, 'click .btn', 'clickHandler');

// element为空时，默认代理到this.element上
this.delegateEvents('click .btn', 'clickHandler');

// 支持以对象形式传入
this.delegateEvents({ 'click .btn': 'clickHandler'});
```

#### function undelegateEvents([element], eventKey)

`element`：事件代理的对象，为空时，默认为this.element
`eventKey`：事件类型和Selector，如'click .btn'  

Example: 
```js
// 解除element上关于eventKey的代理
this.undelegateEvents(ele, eventKey);

// element为空时，默认解除this.element上的对应代理
this.undelegateEvents(eventKey);

// eventKey为空时，解除所有事件代理
this.undelegateEvents();
```

### 在attrs中声明代理事件
```js
var MyWidget = Widget.extend({
    attrs: {
        events: {
            "dblclick": "open",
            "click .icon.doc": "select",
            "mouseover .date": "showTooltip"
        }
    },
    open: function() {
        ...
    },
    select: function() {
        ...
    },
    ...
});
```

#### events中支持{{attrName}}表达式
```js
var MyWidget = Widget.extend({
    attrs: {
        events: {
            "click {{selectors.nextControl}}": "next"
        },
        selectors: {
            nextControl: '.next-control'
        }
    },
    next: function() {
        ...
    }
    ...
});
```

#### events可在实例化组件式作为配置传入
```js
var widget = new MyWidget({
    events: {
        'click .control': function() {
            ...
        }
    }
});
```

## Data-Api
Widget支持自动渲染，可以根据DOM上得data-api渲染相应的组件

当在`this.element`上设置属性data-api="on"时，widget会将所有data-attrname转为驼峰命名作为配置。  

Example: 
```html
<div class="tab" data-api="on" data-auto-play="true" data-interval="10000"></div>
<script>
    var tab = new Tab( {
        element: '.tab'
    });
</script>
```
等同于：
```html
<div class="tab"></div>
<script>
    var tab = new Tab({
        element: '.tab',
        autoPlay: true,
        interval: 10000
    });
</script>
```

## Widget.query

可通过`Widget.query`方法获得组件实例。  
Example: 
```js
var tab = Widget.query('.tab');
```

## _onRenderAttr

Widget使用了Attribute, 支持_onChangeAttr, 另外它还做了一层扩展。提供了_onRenderAttr机制。  

_onChangeAttr在属性初始化时不会触发，只会在属性改变时触发。而_onRenderAttr会在以下两种情况下触发：  
1. 属性改变时  
2. 在调用render方法时（插入到文档流之前），但属性值为null或undefined时则不会触发。

Widget为属性id, classNames, style定义了_onRender方法

```js
var tab = new Tab({
    id: 'myTab', 
    className: 'tab', 
    style: 'border: 1px'
});
```
在调用`render()`时，widget会实时根据id, className, style属性更改this.element的id, class和样式












