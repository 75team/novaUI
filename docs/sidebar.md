---
layout: widget
---

# Sidebar

## 例子
### 注意：请使用开发者工具模拟Touch事件

<link rel="stylesheet" href="{{site.baseurl}}nova/sidebar/sidebar.css?t={{site.time | date: "%H%M%S"}}" />
<div>
<style type="text/css">
    .page {
        position: relative;
        background-color: white;
        overflow: hidden;
        text-align: center;
    }

    .side {
        width: 220px;
    }

    .side img {
    }

    .cont {
        height: 300px;
        background-color: white;
        padding: 30px 20px;
        box-sizing: border-box;
        -webkit-box-sizing: border-box;
    }

    .btn1, .btn2 {
        -webkit-appearance: none;
        background-color: #FF4D51;
        border: 0;
        color: #FFF;
        font-size: 14px;
        padding: 10px 15px;
        border-radius: 8px;
    }

    .yellow {
        background-color: #FFD02E;
    }

    .blue {
        background-color: #32B6E6;
    }
</style>
</div>

<div class="page">
    <div class="side">
        <img src="{{site.baseurl}}images/lovely.jpeg" alt="" />
    </div>
    <div class="cont">
        <p>
            <h3>从左边打开</h3>
            <button class="btn1" data-display="push">Push</button>
            <button class="btn1 yellow" data-display="overlay">Overlay</button>
            <button class="btn1 blue" data-display="reveal">reveal</button>
        </p>
        <p style="margin-top:40px;">
            <h3>从右边打开</h3>
            <button class="btn2" data-display="push">Push</button>
            <button class="btn2 yellow" data-display="overlay">Overlay</button>
            <button class="btn2 blue" data-display="reveal">reveal</button>
        </p>
    </div>
</div>

<script type="text/javascript" src="{{site.baseurl}}nova/widget.js?t={{site.time | date: "%H%M%S"}}"></script>
<script type="text/javascript" src="{{site.baseurl}}nova/sidebar/sidebar.js?t={{site.time | date: "%H%M%S"}}"></script>
<script type="text/javascript">
    var sidebar = new Sidebar({
        element: '.side',
        contentSelector: '.cont'
    });
    $('.btn1').on('tap', function() {
        sidebar.toggle($(this).data('display'));
    });
    $('.btn2').on('tap', function() {
        sidebar.toggle($(this).data('display'), 'right');
    });

    sidebar.before('show', function() {
        console.log('before show');
    });
</script>
<br />

## 文件

### CSS

    <link rel="stylesheet" href="link[sidebar.css]({{site.baseurl}}nova/sidebar/sidebar.css?t={{site.time | date: "%H%M%S"}})">

引入 sidebar.css 或者将 sidebar.css中的必备样式拷入

### Javascript

    <script src="zepto.js"></script>
    <script src="zepto.touch.js"></script>
    <script src="link[widget.js]({{site.baseurl}}nova/widget.js?t={{site.time | date: "%H%M%S"}})"></script>
    <script src="link[sidebar.js]({{site.baseurl}}nova/sidebar/sidebar.js?t={{site.time | date: "%H%M%S"}})"></script>

## 使用方法

### Class说明

| 类名          |  作用  |
|---------------|---------|
| sidebar       | 侧边栏 |
| content       | 与侧边栏同级的内容 |

    <!-- HTML结构 -->
    <div class="page">
        <!-- Sidebar -->
        <div class="sidebar">Sidebar</div>
        <!-- Content -->
        <div class="cont">
            <p>Content</p>
            <button class="btn">Click to open sidebar</button>
        </div>
    </div>

    <!-- Javascript -->
    <script type="text/javascript">
        var sidebar = new Sidebar({
            element: '.side',
            contentSelector: '.cont'
        });

        $('.btn').on('tap', function() {
            sidebar.toggle();
        });
    </script>

## 配置

    var config = {
        element: '.side'        // 侧边栏元素
        contentSelector: '.cont',    // 与侧边栏同级的内容元素

        duration_ms: 200,       // 动画时长
        display: 'push',        // 动画类型，可为'push','overlay','reveal'
        position: 'left',       // sidebar位置，可为'left'或'right'

        classNames: {
            sidebar: 'sidebar',             // 加在侧边栏上的类
            content: 'content',             // 加在与侧边栏同级的内容上的类
            left: 'sidebar-left',           // 侧边栏靠左
            right: 'sidebar-right',         // 侧边栏靠右
            push: 'sidebar-push',           // 侧边栏以push方式显示
            overlay: 'sidebar-overlay',     // 侧边栏以overlay方式显示
            reveal: 'sidebar-reveal',       // 侧边栏以reveal方式显示
            mask: 'sidebar-mask'            // 点击隐藏侧边栏区域
        },
    };
    var sidebar = new Sidebar(config);

## 方法

    // 注意：当display, position未传入时，使用初始化时的配置
    sidebar.toggle(display, position);      // 显示或隐藏sidebar 
    sidebar.show(display, position);        // 显示sidebar
    sidebar.hide();                         // 隐藏sidebar
    sidebar.push(position);                 // 使用push动画, 来显示或隐藏sidebar
    sidebar.overlay(position);              // 使用overlay动画, 来显示或隐藏sidebar
    sidebar.reveal(position);               // 使用reveal动画, 来显示或隐藏sidebar

## 扩展

### 可通过before, after在方法前后插入一段代码

    // 在show()方法前执行一段代码, 回调函数的参数为show方法的参数
    carousel.before('show', function(ev, display, position) {
        // .... 
    });

    // 在hide()方法后执行一段代码
    carousel.after('hide', function(ev, display, position) {
    });
### 
