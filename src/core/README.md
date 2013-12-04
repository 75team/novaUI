# Widgetcore

---


Widgetcore由Class.js, Base.js, Widget.js组成。

Class.js实现了简单地OO原型继承。  
Base.js是个基础类，提供了Event, Attribute, Aspect功能。  
Widget 是UI组件的基础类，继承自Base。它约定了组建的生命周期，提供了一些事件代理，data-api, widget缓存查询，onRender等功能。         

基于Widgetcore，你可以快速方便地构建出想要的Web UI组件
