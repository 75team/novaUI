# &lt;nova-dialog&gt;

弹窗组件。提供alert, confirm, toast等移动端常见的弹窗形式。同时支持自定义弹窗模板。

## Demo

<style type="text/css">
    nova-dialog[unresolved] {
        display: none;
    }
    nova-dialog {
        text-align: center;
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
    nova-dialog .btn {
        display: inline-block;
    }
    nova-dialog .btn+.btn {
        margin-left: 20px;
    }
    nova-dialog .ft {
        //display: none;
    }

    .hidden {
        display: none;
    }

    .dialog-bd-inner {
        text-align: center;
    }
</style>

<div>
    <nova-dialog class="my-dialog" unresolved>
        <h3>来点铜锣烧吧！</h3>
        <img src="http://p5.qhimg.com/t01e9f08beb6e4a5c67.png" alt="" />
        <div>
            <button data-value="yes" class="dialog-btn btn">好哒</button>
            <button class="dialog-btn btn">不用啦</button>
        </div>
    </nova-dialog>
</div>

<button class="btn js-alert">打开alert弹窗</button>
<button class="btn js-confirm">打开confirm弹窗</button>
<button class="btn js-toast">打开toast弹窗</button>
<button class="btn js-custom">打开自定义弹窗</button>

<script>
    _loader.add('callback', 'http://s2.qhimg.com/static/18201c173c4fe77e/zepto.callback.js');
    _loader.add('deferred', 'http://s3.qhimg.com/static/67ad7468a751dfb3/zepto.deferred.js');
    _loader.add('customEle', '{{urls.dialog}}');
    _loader.use('callback, deferred, customEle', function() {
        var dialog = document.querySelector('nova-dialog');
        var Dialog = Nova.Components.NovaDialog;

        $('.js-alert').on('click', function() {
            Dialog.alert('Welcome to novaUI');
        });

        $('.js-confirm').on('click', function() {
            Dialog.confirm('Are you sure?').then(function(result) {
                console.log(result);
            });
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
| dialog-btn | 触发关闭弹窗的元素选择器 |
| dialog-mask | 浮层 |

### HTML

```markup
<!-- 可自定义弹窗HTMl -->
<nova-dialog>
    <h3>来点铜锣烧吧！</h3>
    <img src="http://p5.qhimg.com/t01e9f08beb6e4a5c67.png" alt="" />
    <div>
        <!-- 通过添加dialog-btn, 使button为关闭弹窗的触发器。通过data-value，定义关闭弹窗后传递给处理函数的值 -->
        <button data-value="yes" class="dialog-btn">好哒</button>
        <button class="dialog-btn">不用啦</button>
    </div>
</nova-dialog>
```

### Javascript
需先引入依赖的文件：Zepto基础库，Zepto callback模块, Zepto deferred模块
```markup
<script src="{{urls.nova_polyfills}}"></script>
<script src="{{urls.nova}}"></script>
<script src="{{urls.dialog}}"></script>
<script>
    var Dialog = Nova.Components.NovaDialog;

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

    /* 操作自定义弹窗 */
    var dialog = document.querySelector('nova-dialog');

    dialog.show().then(function(result) {
        if(result) {
            // ...
        } else {
            // ...
        }
    });
</script>

```

## 方法
```javascript

var Dialog = Nova.Components.NovaDialog;

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
var dialog = document.querySelector('nova-dialog');

dialog.show().then(function(result) { // ... });    // 显示弹窗
dialog.hide();                                      // 隐藏弹窗
dialog.refresh();                                   // 刷新弹窗(未支持2.3部分不支持使用transform居中的手机，弹窗的居中是使用js实现的。当弹窗大小改变时，可通过refresh方法，使弹窗重新居中)
```

## 扩展
```javascript
// 1. 在show()方法前或后执行一段代码, 回调函数的参数为show方法的参数
dialog.before('show', function(ev) {
    // ....
});
dialog.after('show', function(ev) {
    // ....
});

// 2. 在hide()方法前或后执行一段代码
dialog.before('hide', function(ev) {
    // ....
});
dialog.after('hide', function(ev) {
    // ....
});
```

## 日志

### 1.0.1
1. 使用Nova.1.0.0.js作为底层框架

### 1.0.0 
首次发布


