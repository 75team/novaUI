---
layout: widget
---

# Tab

## Demo
### Please imulate touch events

<link rel="stylesheet" href="{{site.baseurl}}nova/tab/tab.css?t={{site.time | date: "%H%M%S"}}" />
<div>
<style type="text/css">
    .nova-tab {
        width: 100%;
        box-sizing: border-box;
        -webkit-box-sizing: border-box;
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
            <p>看我的胡子~</p>
            <img id="firstImg" src="{{site.baseurl}}images/1.jpg" alt=""/>
        </div>
        <div class="cont-item">
            <p>我要吃冰淇淋</p>
            <img src="{{site.baseurl}}images/2.jpg" alt="" />
        </div>
        <div class="cont-item">
            <p>这是骗人的，不能吃</p>
            <img src="{{site.baseurl}}images/3.jpg" alt="" />
        </div>
    </div>
</div>

<script type="text/javascript" src="{{site.baseurl}}nova/nova.js?t={{site.time | date: "%H%M%S"}}"></script>
<script type="text/javascript" src="{{site.baseurl}}nova/tab/tab.js?t={{site.time | date: "%H%M%S"}}"></script>
<script type="text/javascript">
    $('#firstImg').on('load', function() {
        var tab = new Tab('.nova-tab');
    });
</script>
<br />

## Resources

### CSS

    <link rel="stylesheet" href="link[tab.css]({{site.baseurl}}nova/tab/tab.css?t={{site.time | date: "%H%M%S"}})">

引入 tab.css 或者将 tab.css中的必备样式拷入

### Javascript

    <script src="zepto.js"></script>
    <script src="zepto.touch.js"></script>
    <script src="link[nova.js]({{site.baseurl}}nova/nova.js?t={{site.time | date: "%H%M%S"}})"></script>
    <script src="link[tab.js]({{site.baseurl}}nova/tab/tab.js?t={{site.time | date: "%H%M%S"}})"></script>

## Usage

| 类名          |  作用  |
|-------------------|---------|
| tab-control       | 控制器容器 |
| control-item      | 单个控制器 |
| tab-cont          | tab容器    |
| cont-item         | 单个tab    |
| active            | 当前tab或控制器    |

    <!-- Tab -->
    <div class="nova-tab">
        <!-- Tab controls -->
        <div class="tab-control">
            <!-- Control item -->
            <div class="control-item">Tab1</div>
            <div class="control-item">Tab2</div>
            <div class="control-item">Tab3</div>
        </div>
        <!-- Tab contents -->
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

    <!-- Construct tab -->
    <script type="text/javascript">
        var tab = new Tab('.nova-tab', {index: 0});
    </script>

## Configuration
    var config = {
        index: 0,               // 初始选项
        openAnimate: true,      // 切换使用slide效果
        duration_ms: 200,       // 使用slide效果的切换时长
        enableSwipe: true       // 是否启用滑动效果
    };
    var tab = new Tab('.nova-tab', {index: 0});

## Methods

    tab.next();                 // 切换到下一个tab
    tab.prev();                 // 切换到上一个tab
    tab.go(n);                  // 切换到第n个tab

## Events

### beforeswitch
面板切换前触发

    tab.on('beforeswitch', function(ev, from, to) {
    });

### afterswitch
面板切换后触发

    tab.on('afterswitch', function(ev, from, to) {
    });

