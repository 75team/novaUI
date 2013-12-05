---
layout: widget
---

# Tab

## 例子
### 注意：请使用开发者工具模拟Touch事件

<link rel="stylesheet" href="{{site.baseurl}}nova/tab/tab.css?t={{site.time | date: "%H%M%S"}}" />
<div>
<style type="text/css">
    .nova-tab {
        width: 100%;
        box-sizing: border-box;
        -webkit-box-sizing: border-box;
    }

    .tab-cont {
        height: 400px;
    }

    .cont-item {
        padding: 5% 15%;
        vertical-align: top;
    }

    .cont-item img{
        -webkit-user-drag: none;
    }
</style>
</div>

<div class="nova-tab">
    <div class="tab-control">
        <div class="control-item">Tab1</div>
        <div class="control-item">Tab2</div>
        <div class="control-item">Tab3</div>
    </div>
    <div class="tab-cont">
        <div class="cont-item">
            <p>Delicious</p>
            <img id="firstImg" src="{{site.baseurl}}images/1.jpg" alt=""/>
        </div>
        <div class="cont-item">
            <p>口水哗啦啦滴流啊流~~</p>
            <img src="{{site.baseurl}}images/2.jpg" alt="" />
        </div>
        <div class="cont-item">
            <p>欢迎啃我</p>
            <img src="{{site.baseurl}}images/3.jpg" alt="" />
        </div>
    </div>
</div>

<script type="text/javascript" src="{{site.baseurl}}nova/widget.js?t={{site.time | date: "%H%M%S"}}"></script>
<script type="text/javascript" src="{{site.baseurl}}nova/tab/tab.js?t={{site.time | date: "%H%M%S"}}"></script>
<script type="text/javascript">
    $('#firstImg').on('load', function() {
        var tab = new Tab({
            element: '.nova-tab',
            swipable: true,
            className: 'nova-tab'
        });
    });
</script>
<br />

## 文件

### CSS

    <link rel="stylesheet" href="link[tab.css]({{site.baseurl}}nova/tab/tab.css?t={{site.time | date: "%H%M%S"}})">

引入 tab.css 或者将 tab.css中的必备样式拷入

### Javascript

    <script src="zepto.js"></script>
    <script src="zepto.touch.js"></script>
    <script src="link[widget.js]({{site.baseurl}}nova/widget.js?t={{site.time | date: "%H%M%S"}})"></script>
    <script src="link[tab.js]({{site.baseurl}}nova/tab/tab.js?t={{site.time | date: "%H%M%S"}})"></script>

## 使用方法

### Class说明

| 类名          |  作用  |
|-------------------|---------|
| tab-control       | 控制器容器 |
| control-item      | 单个控制器 |
| tab-cont          | tab容器    |
| cont-item         | 单个tab    |
| active            | 当前tab或控制器    |

    <!-- HTML结构 -->
    <div class="nova-tab">
        <!-- Controls -->
        <div class="tab-control">
            <!-- Control item -->
            <div class="control-item">Tab1</div>
            <div class="control-item">Tab2</div>
            <div class="control-item">Tab3</div>
        </div>
        <!-- Contents -->
        <div class="tab-cont">
            <!-- Content item -->
            <div class="cont-item">
                <img src="{{site.baseurl}}images/1.jpg" alt="" />
                看我的胡子~
            </div>
            <div class="cont-item">
                <img src="{{site.baseurl}}images/2.jpg" alt="" />
                我要吃冰淇淋
            </div>
            <div class="cont-item">
                <img src="{{site.baseurl}}images/3.jpg" alt="" />
                这是骗人的，不能吃
            </div>
        </div>
    </div>

    <!-- Javascript -->
    <script type="text/javascript">
        var tab = new Tab({
            element: '.nova-tab',
            swipable: true,
            className: 'nova-tab'
        });
    </script>

## 配置

    var config = {
        element: '.nova-tab'                // Tab元素

        index: 0,                           // 初始index 
        animate: true,                      // 是否使用动画
        duration_ms: 200,                   // 切换动画时长 
        autoplay: true,                     // 是否自动轮播 
        autoplay_interval_ms: 10000,        // 自动轮播时间间隔 
        swipable: true,                     // 是否可滑动

        selectors: {
            content: '.tab-cont',           // 切换内容容器
            contItem: '.cont-item',         // 单个切换内容
            control: 'tab-control',         // 触发器容器
            controlItem: '.control-item',   // 单个触发器
            active: '.active'               // 当前的内容或触发器
        }
    };  
    var tab = new Tab(config);


## 方法

    tab.next();                        // 切换到下一个内容
    tab.prev();                        // 切换到上一个内容
    tab.switch(n);                     // 切换到第n个内容
    tab.set('autoplay', false)         // 打开或关闭自动轮播

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
