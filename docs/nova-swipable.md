# &lt;nova-swipable&gt;

滑动组件，支持水平和垂直方向的惯性滑动，边缘有回弹效果。

## Demo
**注意：**PC用户请使用开发者工具模拟Touch行为

<style type="text/css">
nova-swipable {
    overflow: hidden;
}
nova-swipable .swipable-nav {
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

<div> 
<nova-swipable direction="horizontal">
    <ul class="swipable-nav">
        <li>Home</li>
        <li>Blog</li>
        <li>Gallery</li>
        <li>About</li>
        <li>Contact</li>
    </ul>
</nova-swipable>
</div>

<script>
    _loader.add('customEle', '{{urls.swipable}}');
    _loader.use('customEle', function() { });
</script>

## 使用方法

### HTML

```markup
<nova-swipable direction="horizontal">
    <ul class="nav">
        <li>Home</li>
        <li>Blog</li>
        <li>Gallery</li>
        <li>About</li>
        <li>Contact</li>
    </ul>
</nova-swipable>
```

#### 使用要求
* `<nova-swipable>`只能有一个子节点
* `<nova-swipable>`的子节点宽度大于它时，才会有滑动效果

### Javascript
需先引入依赖的文件：Zepto基础库，Zepto touch模块, Zepto fx模块 
```markup
<script src="{{urls.nova_polyfills}}"></script>
<script src="{{urls.nova}}"></script>
<script src="{{urls.swipable}}"></script>
```

## 配置

```markup
<nova-swipable></nova-swipable>
<!-- 可配置如下attributes
    direction="vertical"                // 滑动方向。默认vertical，可取vertical或horizontal
    speed="0.5"                         // 滑动速度。范围(0,1)，数值越大速度越快
-->
```

## 方法
```javascript
var swipable = document.querySelector('nova-swipable');
swipable.refresh();                     // 当容器或内容的宽高改变时，需调用refresh
```

## 日志

### 1.0.1
1. 使用Nova.1.0.0.js作为底层框架

### 1.0.0
首次发布


