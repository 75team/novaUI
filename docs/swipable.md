
#Swipable

滑动组件，支持水平和垂直方向的惯性滑动，边缘有回弹效果。

## Demo
**注意：**PC用户请使用开发者工具模拟Touch行为

<style type="text/css">
.swipable-wrap {
    overflow: hidden;
}
.swipable-wrap .swipable-nav {
    width: 300%;
    box-sizing: border-box;
    height: 150px;
    display: table;
    background: #F5F2F0;
    color: #f88;
    font-weight: bold;
    font-size: 24px;
    padding: 0;
}

.swipable-nav li {
    display: table-cell; 
    text-align: center;
    text-decoration: none;
    vertical-align: middle;
    border-left: 1px solid white;
}
</style>

<div class="swipable-wrap"> 
    <ul class="swipable-nav">
        <li>Home</li>
        <li>Blog</li>
        <li>Gallery</li>
        <li>About</li>
        <li>Contact</li>
    </ul>
</div>

<script type="text/javascript">
    _loader.add('widget', 'http://s1.qhimg.com/static/c8b7de8c67377042/widget.1.0.2.js');
    _loader.add('swipable', 'http://s4.qhimg.com/static/cd00e5b0ab939a47/swipable.1.0.0.js');
    _loader.use('widget, swipable', function() { 
        var swipable = new Swipable({
            element: '.swipable-wrap',
            dir: 'horizontal'
        });
    });
</script>

## 使用方法

### HTML

```markup
<div class="wrap"> 
    <ul class="nav">
        <li>Home</li>
        <li>Blog</li>
        <li>Gallery</li>
        <li>About</li>
        <li>Contact</li>
    </ul>
</div>
```

### Javascript
需先引入依赖的文件：Zepto基础库，Zepto touch模块, Zepto fx模块 
```markup
<script type="text/javascript" src="http://s1.qhimg.com/static/c8b7de8c67377042/widget.1.0.2.js"></script>
<script type="text/javascript" src="http://s4.qhimg.com/static/cd00e5b0ab939a47/swipable.1.0.0.js"></script>
<script type="text/javascript">
    var swipable = new Swipable({
        element: '.swipable-wrap',
        dir: 'horizontal'
    });
</script>
```

## 配置

```javascript
var config = {
    dir: 'vertical',                    // 滑动方向，可取值vertical, horizontal
    speed: 0.5                          // 速度，范围(0, 1)，数值越大速度越大
};
```

## 方法
```javascript
swipable.refresh();                     // 当容器或内容的宽高改变时，需调用refresh
```

## 日志

### 1.0.0 
首次发布


