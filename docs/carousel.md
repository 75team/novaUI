---
layout: widget
---

# Carousel 

## 例子
### 注意：请使用开发者工具模拟Touch事件

<link rel="stylesheet" href="{{site.baseurl}}nova/carousel/carousel.css?t={{site.time | date: "%H%M%S"}}" />
<div>
<style type="text/css">
    .nova-carousel {
        height: 300px;
    }

    .nova-carousel img{
        height: 300px;
    }
</style>
</div>

<div class="nova-carousel">
    <div class="carousel-cont">
        <div class="cont-item">
            <img src="{{site.baseurl}}images/1.jpg" alt="" class="src">
        </div>
        <div class="cont-item">
            <img src="{{site.baseurl}}images/2.jpg" alt="" class="src">
        </div>
        <div class="cont-item">
            <img src="{{site.baseurl}}images/3.jpg" alt="" class="src">
        </div>
    </div>
    <div class="carousel-control">
        <span class="control-item"></span>
        <span class="control-item"></span>
        <span class="control-item"></span>
    </div>
</div>
<script type="text/javascript" src="{{site.baseurl}}nova/widget.js?t={{site.time | date: "%H%M%S"}}"></script>
<script type="text/javascript" src="{{site.baseurl}}nova/carousel/carousel.js?t={{site.time | date: "%H%M%S"}}"></script>
<script type="text/javascript">
    var carousel = new Carousel({
        element: '.nova-carousel'
    });

</script>
<br />

## 文件

### CSS

    <link rel="stylesheet" href="link[carousel.css]({{site.baseurl}}nova/carousel/carousel.css?t={{site.time | date: "%H%M%S"}})">

引入carousel.css，或者拷贝carousel.css中的必备(Required)样式。

### Javascript

    <script src="zepto.js"></script>
    <script src="zepto.touch.js"></script>
    <script src="link[widget.js]({{site.baseurl}}nova/widget.js?t={{site.time | date: "%H%M%S"}})"></script>
    <script src="link[carousel.js]({{site.baseurl}}nova/carousel/carousel.js?t={{site.time | date: "%H%M%S"}})"></script>

## 使用方法

### Class说明

| 类名          |  作用  |
|-------------------|---------|
| carousel-control  | 触发器容器 |
| control-item      | 单个触发器 |
| carousel-cont     | 切换内容容器    |
| cont-item         | 单个切换内容    |
| active            | 当前内容或触发器    |

    <!-- HTML结构 -->
    <div class="nova-carousel" >
        <!-- Contents -->
        <div class="carousel-cont">
            <!-- Carousel item -->
            <div class="cont-item">
                <img src="1.jpg" alt="" />
            </div>
            <div class="cont-item">
                <img src="2.jpg" alt="" />
            </div>
            <div class="cont-item">
                <img src="3.jpg" alt="" />
            </div>
        </div>
        <!-- Controls -->
        <div class="carousel-control">
            <!-- Control item -->
            <a href="#" class="control-item"></a> 
            <a href="#" class="control-item"></a> 
            <a href="#" class="control-item"></a> 
        </div>
    </div>

    <!-- Javascript -->
    <script type="text/javascript">
        var carousel = new Carousel({
            element: '.nova-carousel'
        });
    </script>

## 配置

    var config = {
        element: '.nova-carousel'           // Carousel元素

        index: 0,                           // 初始index 
        recursive: true,                    // 是否可循环
        duration_ms: 200,                   // 切换动画时长 
        autoplay: true,                     // 是否自动轮播 
        autoplay_interval_ms: 10000,        // 自动轮播时间间隔 
        swipable: true,                     // 是否可滑动

        selectors: {
            content: '.carousel-cont',      // 切换内容容器
            contItem: '.cont-item',         // 单个切换内容
            control: 'carousel-control',    // 触发器容器
            controlItem: '.control-item',   // 单个触发器
            active: '.active'               // 当前的内容或触发器
        }
    };  
    var carousel = new Carousel(config);

## 方法

    carousel.next();                        // 切换到下一个内容
    carousel.prev();                        // 切换到上一个内容
    carousel.switch(n);                     // 切换到第n个内容
    carousel.set('autoplay', false)         // 打开或关闭自动轮播

    
## 扩展

### 可通过before, after在方法前后插入一段代码

    // 在prev()方法前执行一段代码
    carousel.before('prev', function() {
        // .... 
    });

    // 在next()方法后执行一段代码
    carousel.after('next', function() {
    });

### 事件beforeSwitch, afterSwitch

    // 在切换动画前执行一段代码
    carousel.on('beforeSwitch', function(ev, toIndex, fromIndex) {
        console.log('before Sliding from ' + fromIndex + ' to ' + toIndex);
    });

    // 在切换动画后执行一段代码
    carousel.on('afterSwitch', function(ev, toIndex, fromIndex) {
        console.log('after Sliding from ' + fromIndex + ' to ' + toIndex);
    });
