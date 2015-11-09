# &lt;nova-sidebar&gt;

侧边栏组件，使用硬件加速实现流畅滑动，支持Push, Overlay, Review三种显示方式。

## Demo
**注意：**PC用户请使用开发者工具模拟Touch行为

<style type="text/css">
    .page {
        position: relative;
        background-color: white;
        overflow: hidden;
        text-align: center;
    }

    nova-sidebar[unresolved] {
        display: none;
    }

    nova-sidebar {
        width: 220px;
    }

    nova-sidebar img {
    }

    .cont {
        height: 300px;
        background: #F5F2F0;
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
    /* Customized */
    nova-sidebar {
        background-color: #3D3D3D;
        color: white;
        padding: 20px 10px;
        width: 240px;
    }
</style>

<div class="page">
    <nova-sidebar unresolved>
        Awesome
    </nova-sidebar>
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

<script>
    _loader.add('customEle', '{{urls.sidebar}}');
    _loader.use('customEle', function() {
        var sidebar = document.querySelector('nova-sidebar');
        $('.btn1').on('tap', function() {
            sidebar.toggle($(this).data('display'));
        });
        $('.btn2').on('tap', function() {
            sidebar.toggle($(this).data('display'), 'right');
        });

        sidebar.before('show', function() {
            console.log('before show');
        });
    });
</script>

## 使用方法

### HTML


```markup
<style>
    .page {
        position: relative;
    }
</style>
<div class="page">
    <!-- Sidebar -->
    <nova-sidebar></nova-sidebar>
    <!-- Content -->
    <div class="cont">
        <p>Content</p>
        <button class="btn">Click to open sidebar</button>
    </div>
</div>
```

### Javascript
需先引入依赖的文件：Zepto基础库，Zepto touch模块, Zepto fx模块
```markup
<script src="{{urls.nova_polyfills}}"></script>
<script src="{{urls.nova}}"></script>
<script src="{{urls.sidebar}}"></script>
<script>
    var sidebar = document.querySelector('nova-sidebar');

    $('.btn').on('tap', function() {
        sidebar.toggle();
    });
</script>
```

## 配置

```markup
<nova-sidebar></nova-sidebar>
<!-- 可配置如下attributes, 以下均为默认值
    element=".side"                     // 侧边栏元素
    content-selector=".cont"             // 与侧边栏同级的内容元素，若不传，nova-sidebar默认会使用其nextSibiling作为content

    duration-ms="200"                   // 动画时长
    display="push",                     // 动画类型，可为'push','overlay','reveal'
    position="left"                     // sidebar位置，可为'left'或'right'
-->
```

## 方法
```javascript
var sidebar = document.querySelector('nova-sidebar');

// display, position均为optional
var display = 'push';
var position = 'left';
sidebar.toggle(display, position);      // 显示或隐藏sidebar
sidebar.show(display, position);        // 显示sidebar
sidebar.hide();                         // 隐藏sidebar
sidebar.push(position);                 // 使用push动画, 来显示或隐藏sidebar
sidebar.overlay(position);              // 使用overlay动画, 来显示或隐藏sidebar
sidebar.reveal(position);               // 使用reveal动画, 来显示或隐藏sidebar
```

## 扩展
```javascript
// 1. 在show()方法前执行一段代码, 回调函数的参数为show方法的参数
sidebar.before('show', function(ev, display, position) {
    // .... 
});

// 2. 在hide()方法后执行一段代码
sidebar.after('hide', function(ev, display, position) {
});
```

## 日志

### 1.0.2
1. 使用Nova.1.0.0.js作为底层框架

### 1.0.1 
升级依赖widget.js版本为1.0.2

### 1.0.0 
首次发布


