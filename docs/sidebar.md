---
layout: widget
---

# Sidebar

## Demo
### Please imulate touch events

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
            <h3>Open Sidebar from left</h3>
            <button class="btn1" data-display="push">Push</button>
            <button class="btn1 yellow" data-display="overlay">Overlay</button>
            <button class="btn1 blue" data-display="reveal">reveal</button>
        </p>
        <p style="margin-top:40px;">
            <h3>Open Sidebar from right</h3>
            <button class="btn2" data-display="push">Push</button>
            <button class="btn2 yellow" data-display="overlay">Overlay</button>
            <button class="btn2 blue" data-display="reveal">reveal</button>
        </p>
    </div>
</div>

<script type="text/javascript" src="{{site.baseurl}}nova/nova.js?t={{site.time | date: "%H%M%S"}}"></script>
<script type="text/javascript" src="{{site.baseurl}}nova/sidebar/sidebar.js?t={{site.time | date: "%H%M%S"}}"></script>
<script type="text/javascript">
    var sidebar = new Sidebar('.side', {
        contentWrap: '.cont'
    });
    $('.btn1').on('tap', function() {
        sidebar.toggle($(this).data('display'));
    });
    $('.btn2').on('tap', function() {
        sidebar.toggle($(this).data('display'), 'right');
    });
</script>
<br />

## Resources

### CSS

    <link rel="stylesheet" href="link[sidebar.css]({{site.baseurl}}nova/sidebar/sidebar.css?t={{site.time | date: "%H%M%S"}})">

引入 sidebar.css 或者将 sidebar.css中的必备样式拷入

### Javascript

    <script src="zepto.js"></script>
    <script src="zepto.touch.js"></script>
    <script src="link[nova.js]({{site.baseurl}}nova/nova.js?t={{site.time | date: "%H%M%S"}})"></script>
    <script src="link[sidebar.js]({{site.baseurl}}nova/sidebar/sidebar.js?t={{site.time | date: "%H%M%S"}})"></script>

## Usage

    <!-- Page -->
    <div class="page">
        <!-- Sidebar -->
        <div class="sidebar">Sidebar</div>
        <!-- Content -->
        <div class="cont">
            <p>Content</p>
            <button class="btn">Click to open sidebar</button>
        </div>
    </div>

    <!-- Construct sidebar -->
    <script type="text/javascript">
        var sidebar = new Sidebar('.sidebar', {
            contentWrap: '.cont'
        });
        $('.btn').on('tap', function() {
            sidebar.toggle();
        });
    </script>

## Configuration
    var config = {
        duration_ms: 200,       // 动画时长
        position: 'left',       // sidebar位置，可为'left'或'right'
        display: 'push',        // 动画类型，可为'push','overlay','reveal'
        prefix: 'nova'          // 类的前缀
    };
    var sidebar = new Sidebar('.sidebar', config);

## Methods

    sidebar.toggle(display, position);      // 显示或隐藏sidebar, 当未传入display或position时将使用默认配置
    sidebar.push(position);                 // 使用push动画, 来显示或隐藏sidebar，当未传入position时将使用默认配置
    sidebar.overlay(position);              // 使用overlay动画, 来显示或隐藏sidebar，当未传入position时将使用默认配置
    sidebar.reveal(position);               // 使用reveal动画, 来显示或隐藏sidebar，当未传入position时将使用默认配置
    sidebar.open(display, position);        // 显示sidebar, 当未传入display或position时将使用默认配置
    sidebar.close();                        // 隐藏sidebar

## Events

### beforeopen
sidebar显示前触发

    sidebar.on('beforeopen', function() {
    });

### afteropen
sidebar显示后触发

    sidebar.on('afteropen', function() {
    });

### beforeclose
sidebar隐藏前触发

    sidebar.on('beforeclose', function() {
    });

### afterclose
sidebar隐藏后触发

    sidebar.on('afterclose', function() {
    });
