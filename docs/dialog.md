# Dialog

Dialog组件。提供alert, confirm, toast等移动端常见的弹窗形式。同时支持完全自定义弹窗模板的高级定制。

## Demo
<link rel="stylesheet" href="http://s4.qhimg.com/static/070116687c5a871f/dialog.1.0.0.css" />

<style type="text/css">
    .dialog .bd {
        min-height: auto;
    }
    .btn {
        -webkit-appearance: none;
        background-color: #FF4D51;
        border: 0;
        color: #FFF;
        font-size: 14px;
        padding: 10px 15px;
        border-radius: 8px;
        outline: none;
        cursor: pointer;
        margin-bottom: 10px;
    }
    .my-dialog .btn+.btn {
        margin-left: 20px;
    }
    .my-dialog .ft {
        //display: none;
    }

    .hidden {
        display: none;
    }

    .dialog-bd-inner {
        text-align: center;
    }
</style>


<div class="hidden">
    <div class="dialog-bd-inner">
        <h3>来点铜锣烧吧！</h3>
        <img src="http://p5.qhimg.com/t01e9f08beb6e4a5c67.png" alt="" />
        <div>
            <button class="dialog-confirm btn">好哒</button>
            <button class="dialog-cancel btn">不用啦</button>
        </div>
    </div>
</div>
<button class="btn js-alert">打开alert弹窗</button>
<button class="btn js-confirm">打开confirm弹窗</button>
<button class="btn js-toast">打开toast弹窗</button>
<button class="btn js-custom">打开自定义弹窗</button>

<script type="text/javascript">
    _loader.add('callback', 'http://s2.qhimg.com/static/18201c173c4fe77e/zepto.callback.js');
    _loader.add('deferred', 'http://s3.qhimg.com/static/67ad7468a751dfb3/zepto.deferred.js');
    _loader.add('widget', 'http://s1.qhimg.com/static/c8b7de8c67377042/widget.1.0.2.js');
    _loader.add('dialog', 'http://s4.qhimg.com/static/d127b1d58f7b4b3d/dialog.1.0.0.js');
    _loader.use('callback,deferred,widget, dialog', function() { 
        var dialog = new Dialog({
            body: '.dialog-bd-inner',
            className: 'my-dialog'
        });

        $('.js-alert').on('click', function() {
            Dialog.alert('Welcome to novaUI');
        });

        $('.js-confirm').on('click', function() {
            Dialog.confirm('Are you sure?');
        });

        $('.js-toast').on('click', function() {
            Dialog.toast('Welcome');
        });

        $('.js-custom').on('click', function() {
            dialog.show().then(function(result) {
                if(result) {
                    alert('人家只是客气一下，别当真~');
                } else {
                    alert('嘻嘻，太好啦，铜锣烧都是我的咯！');
                }
            });
        });
    });
</script>

## 使用方法

| 默认类名          |  作用  |
|-------------------|---------|
| dialog-confirm | 确认触发元素 |
| dialog-cancel | 关闭触发元素 |
| dialog-mask | 浮层 |

### html

```markup
<!-- 可自定义弹窗HTMl -->
<div class="hidden">
    <div class="dialog-bd-inner">
        <h3>来点铜锣烧吧！</h3>
        <img src="http://p5.qhimg.com/t01e9f08beb6e4a5c67.png" alt="" />
        <div>
            <!-- 通过添加dialog-confirm和dialog-cancel的类，给元素添加点击后确认或取消的功能 -->
            <button class="dialog-confirm btn">好哒</button>
            <button class="dialog-cancel btn">不用啦</button>
        </div>
    </div>
</div>
```

### javascript
需先引入依赖的文件：Zepto基础库，Zepto callback模块, Zepto deferred模块
```markup
<script src="http://s1.qhimg.com/static/c8b7de8c67377042/widget.1.0.2.js"></script>
<script src="http://s4.qhimg.com/static/d127b1d58f7b4b3d/dialog.1.0.0.js"></script>
<script>
    /* 简单用法 */
    Dialog.alert('Welcome').then(function() {
        // Do something after the dialog is closed
    });

    Dialog.confirm('Do you like some water').then(function(result) {
        if(result) {
            // Fetch some water
        }
    });

    Dialog.toast('提交成功');

    /* 高级定制 */
    var dialog = new Dialog({
        body: '.dialog-bd-inner',
        className: 'my-dialog'
    });

    dialog.show().then(function(result) {
        if(result) {
            // ...
        } else {
            // ...
        }
    });
</script>

```

### CSS
```markup
<link rel="stylesheet" href="http://s4.qhimg.com/static/070116687c5a871f/dialog.1.0.0.css" />
```

## 配置

```javascript
var config = {
    body: '',                               // 弹窗内容，可以是DOM元素或html
    selectors: {
        confirmBtn: '.dialog-confirm',      // 确认按钮选择器
        cancelBtn: '.dialog-cancel'         // 关闭按钮选择器
    },
    className: ''                           // 给dialog添加的类名
};
```

## 方法
```javascript

/********************** 静态方法 ***********************/
Dialog.alert('Welcome').then(function() {
    // Do something after the dialog is closed
});

Dialog.confirm('Do you like some water').then(function(result) {
    if(result) {
        // Fetch some water
    }
});

Dialog.toast('提交成功');

/********************** 自定义弹窗的方法 ***********************/
var dialog = new Dialog({
    body: '.dialog-bd-inner',
    className: 'my-dialog'
});

dialog.show().then(function(result) { // ... });    // 显示弹窗
dialog.hide();                                      // 隐藏弹窗
dialog.refresh();                                   // 刷新弹窗(未支持2.3部分不支持使用transform居中的手机，弹窗的居中是使用js实现的。当弹窗大小改变时，可通过refresh方法，使弹窗重新居中)
```

## 扩展
```javascript
// 1. 在show()方法前或后执行一段代码, 回调函数的参数为show方法的参数
sidebar.before('show', function(ev) {
    // ....
});
sidebar.after('show', function(ev) {
    // ....
});

// 2. 在hide()方法前或后执行一段代码
sidebar.before('hide', function(ev) {
    // ....
});
sidebar.after('hide', function(ev) {
    // ....
});
```

## 日志

### 1.0.0 
首次发布


