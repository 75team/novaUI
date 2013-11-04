##简单的类实现：
1. 提供Class.extend形式的类继承， init方法将在实例化对象时被调用
2. 简单的super机制。子类方法中可通过this._super调用父类的该方法。

###继承形式：

```javascript
// 定义Widget类
var Animal = Class.extend({
     init: function() {…….},                   // 构造函数
     sound: function(…...)
});
```
实例化Widget对象时会调用init方法

```javascript
// 继承Widget类
var Pig = Animal.extend({
     sound: function() {
          this._super();                         // 调用父类的sound方法
     }
});
```

##Widget基类：
1. 组件的生命周期  
     setup,           // 初始化组件时调用  
     render,            
     destroy  

2. 需定义方法/属性：  
     defaultConfig   默认配置  
     setup 组件的构造函数  

     获得配置和DOM元素  
     this.config  
     this.element  

3. 自定义事件   
     on, off, trigger
     
4. 插件机制   
     plug

###Example: 

```javascript
// Class Switchable
this.Switchable = Widget.extend({
     defaultConfig: {
          index: -1,
          count: 0
     },
     setup: function() {
          this.index = this.config.index;
          this.count = this.config.count;
     }
});
```

```javascript
// Class tab
this.Tab = Switchable.extend({
     defaultConfig: {
          animate: true,
          duration_ms: 200
     },
     setup: function() {
          this._super(arguments);          // 调用父类setup方法
          
          this.plug($swipe);                    // 使用$swipe插件
     }, 
     method: function() {
          // …...
     }
});
```

```javascript
// 定义Swipe插件
this.$swipe = {
     defaultConfig: {
          enableSwipe: true
     },

     // 将在宿组调用this.plug($swipe)方法时调用
     setupPlugin: function() {  
          // …...
     }, 
     
     method: function() {
          this._host(arguments);          // 可通过this._host调用宿组的该方法
     }
}
```
