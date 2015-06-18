#Carousel

跑马灯组件。使用硬件加速实现切换，动画流畅且tab之间无缝，支持循环，自动轮播，切换事件监听，回弹效果等。

## Demo
<link rel="stylesheet" href="http://s4.qhimg.com/static/19a226791da76e1a/carousel.1.0.4.css" />

<style type="text/css">
    .nova-carousel {
        height: 300px;
    }

    .nova-carousel img{
        height: 300px;
        -webkit-user-drag: none;
    }
</style>

<div class="nova-carousel">
    <div class="carousel-cont">
        <div class="cont-item">
            <img src="novaui/img/1.jpg" alt="some pic">
        </div>
        <div class="cont-item">
            <img src="novaui/img/2.jpg" alt="some pic">
        </div>
        <div class="cont-item">
            <img src="novaui/img/3.jpg" alt="some pic">
        </div>
    </div>
    <div class="carousel-control">
        <span class="control-item"></span>
        <span class="control-item"></span>
        <span class="control-item"></span>
    </div>
</div>


<script type="text/javascript">
    _loader.add('widget', 'http://s1.qhimg.com/static/c8b7de8c67377042/widget.1.0.2.js');
    _loader.add('carousel', 'http://s3.qhimg.com/static/92642666da227923/carousel.1.0.4.js');
    _loader.use('widget, carousel', function() { 
        var carousel = new Carousel({
            element: '.nova-carousel',
            autoplay: true
        });
    });
</script>

## 使用方法

### HTML
| 默认类名          |  作用  |
|-------------------|---------|
| carousel-control  | 触发器容器 |
| control-item      | 单个触发器 |
| carousel-cont     | 切换内容容器    |
| cont-item         | 单个切换内容    |
| active            | 当前内容和其左右相邻内容 |
| current           | 当前内容或触发器    |

```markup
<div class="nova-carousel">
    <div class="carousel-cont">
        <div class="cont-item">
            <img src="novaui/img/1.jpg" alt="some pic">
        </div>
        <div class="cont-item">
            <img src="novaui/img/2.jpg" alt="some pic">
        </div>
        <div class="cont-item">
            <img src="novaui/img/3.jpg" alt="some pic">
        </div>
    </div>
    <div class="carousel-control">
        <span class="control-item"></span>
        <span class="control-item"></span>
        <span class="control-item"></span>
    </div>
</div>
```

### Javascript
需先引入依赖的文件：Zepto基础库，Zepto touch模块, Zepto fx模块
```markup
<script type="text/javascript" src="http://s1.qhimg.com/static/c8b7de8c67377042/widget.1.0.2.js"></script>
<script type="text/javascript" src="http://s3.qhimg.com/static/92642666da227923/carousel.1.0.4.js"></script>
<script type="text/javascript">
        var carousel = new Carousel({
            element: '.nova-carousel'
        });
</script>
```
### CSS
```markup
<link rel="stylesheet" href="http://s4.qhimg.com/static/19a226791da76e1a/carousel.1.0.4.css" />
```
使用默认样式，请引入以上文件。若需自定义样式，仅复制未压缩版文件中/\* Required \*/注释下的样式即可。

## 配置

```javascript
var config = {
    element: '.nova-carousel'           // Carousel元素

    index: 0,                           // 初始index 
    recyclable: true,                   // 是否可循环
    duration_ms: 200,                   // 切换动画时长
    autoplay: false,                    // 是否自动轮播
    autoplay_interval_ms: 10000,        // 自动轮播时间间隔
    swipable: true,                     // 是否可滑动
    direction: 'horizontal',            // horizontal:水平，vertical:垂直

    selectors: {
        content: '.carousel-cont',      // 切换内容容器
        contItem: '.cont-item',         // 单个切换内容
        control: 'carousel-control',    // 触发器容器
        controlItem: '.control-item',   // 单个触发器
        active: '.active'               // 当前的内容或触发器
    }
};  
```

## 方法
```javascript
carousel.next();                        // 切换到下一个内容
carousel.prev();                        // 切换到上一个内容
carousel.switch(n);                     // 切换到第n个内容
carousel.set('autoplay', false)         // 打开或关闭自动轮播
```

## 扩展
```javascript
// 1. 在切换前后执行代码
carousel.on('beforeSwitch', function(ev, toIndex, fromIndex) {
    console.log('before Sliding from ' + fromIndex + ' to ' + toIndex);
});

carousel.on('afterSwitch', function(ev, toIndex, fromIndex) {
    console.log('after Sliding from ' + fromIndex + ' to ' + toIndex);
});

// 2. 在上述方法前后执行代码
carousel.before('prev', function() {
    // ....
});

carousel.after('next', function() {
    // ...
});

```

## 日志

## 1.0.4
1. 修复新版webkit动画渲染问题
2. 支持两个滑动项循环滑动
3. 新增current类，当前切换到的滑动项上会有此类
4. 将配置recursive名称改为recyclable
5. 支持多个Carousel嵌套

## 1.0.3

1. 支持垂直滑动
2. 修复2.3滑动失效问题，bug原因是使用关键字switch作为方法ogz..

### 1.0.2

1. 当切换内容数小于或等于2个时，关闭循环轮播
2. 当切换内容数为1时，关闭滑动
3. 新增refresh方法，当显示，或尺寸更改时调用

### 1.0.1
升级依赖widget.js版本为1.0.2

### 1.0.0
首次发布

