
#Sidebar

侧边栏组件，使用硬件加速实现流畅滑动，支持Push, Overlay, Review三种显示方式。

## Demo
**注意：**PC用户请使用开发者工具模拟Touch行为
<link rel="stylesheet" href="http://s4.qhimg.com/static/59be558196d5185c/sidebar.1.0.1.css" />

<style type="text/css">
    .page {
        position: relative;
        background-color: white;
        overflow: hidden;
        text-align: center;
    }

    .sidebar {
        width: 220px;
    }

    .sidebar img {
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
</style>

<div class="page">
    <div class="sidebar">
        Awesome
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

<script type="text/javascript">
    _loader.add('widget', 'http://s1.qhimg.com/static/c8b7de8c67377042/widget.1.0.2.js');
    _loader.add('sidebar', 'http://s2.qhimg.com/static/9f9ccc3da55619a4/sidebar.1.0.1.js');
    _loader.use('widget, sidebar', function() { 
        var sidebar = new Sidebar({
            element: '.sidebar',
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
    });
</script>

## 使用方法

### HTML

| 类名          |  作用  |
|---------------|---------|
| sidebar       | 侧边栏 |
| content       | 与侧边栏同级的内容 |

```markup
<div class="page">
    <!-- Sidebar -->
    <div class="side">Sidebar</div>
    <!-- Content -->
    <div class="cont">
        <p>Content</p>
        <button class="btn">Click to open sidebar</button>
    </div>
</div>
```

需先引入依赖的文件：Zepto基础库，Zepto touch模块, Zepto fx模块 
### Javascript
```markup
<script type="text/javascript" src="http://s1.qhimg.com/static/c8b7de8c67377042/widget.1.0.2.js"></script>
<script type="text/javascript" src="http://s2.qhimg.com/static/9f9ccc3da55619a4/sidebar.1.0.1.js"></script>
<script type="text/javascript">
    var sidebar = new Sidebar({
        element: '.side',
        contentSelector: '.cont'
    });

    $('.btn').on('tap', function() {
        sidebar.toggle();
    });
</script>
```
### CSS
```markup
<link rel="stylesheet" href="http://s4.qhimg.com/static/59be558196d5185c/sidebar.1.0.1.css" />
```
使用默认样式，请引入以上文件。若需自定义样式，仅复制未压缩版文件中/\* Required \*/注释下的样式即可。

## 配置

```javascript
var config = {
    element: '.side'                    // 侧边栏元素
    contentSelector: '.cont',           // 与侧边栏同级的内容元素

    duration_ms: 200,                   // 动画时长
    display: 'push',                    // 动画类型，可为'push','overlay','reveal'
    position: 'left',                   // sidebar位置，可为'left'或'right'

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
```

## 方法
```javascript
// 注意：当display, position未传入时，使用初始化时的配置
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

1.0.1 升级依赖widget.js版本为1.0.2

1.0.0 首次发布

