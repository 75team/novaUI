# &lt;nova-scratch-ticket&gt;

刮刮乐组件

## Demo
**注意：**PC用户请使用开发者工具模拟Touch行为

<style type="text/css">
.scratch-ticket[unresolved] {
    opacity: 0;
}
.scratch-ticket {
    background: url(http://p9.qhimg.com/d/inn/7fd309ad/win.png);
    background-size: 246px 80px;
    border: 10px solid #ebebeb;
}
</style>

<div>
    <canvas unresolve is="nova-scratch-ticket" class="scratch-ticket" width="246" height="80"></canvas>
    <div>
        <button class="refresh">再来一次</button>
        <button class="clear">自动刮</button>
    </div>
</div>

<script type="text/javascript">
    _loader.add('customEle', '{{urls.scratchTicket}}');
    _loader.use('customEle', function() {
        var scratchTicket = document.querySelector('canvas[is="nova-scratch-ticket"]');
        scratchTicket.addEventListener('scratchoff', function() {
            alert('恭喜你，中奖啦！');
            scratchTicket.clear();
        });
        $('.refresh').on('tap', function() {
            scratchTicket.refresh();
        });
        $('.clear').on('tap', function() {
            scratchTicket.clear();
        });
    });
</script>

## 使用方法

### HTML

```markup
<style type="text/css">
    .scratch-ticket {
        background: url(http://p9.qhimg.com/d/inn/7fd309ad/win.png);
        background-size: 246px 80px;
    }
</style>
<canvas is="nova-scratch-ticket" class="scratch-ticket" width="246" height="80"></canvas>
```

### Javascript
需先引入依赖的文件：Zepto基础库，Zepto touch模块
```markup
<script src="{{urls.nova_polyfills}}"></script>
<script src="{{urls.nova}}"></script>
<script src="{{urls.scratchTicket}}"></script>
```

## 配置

```markup
<canvas is="nova-scratch-ticket"></canvas>
<!-- 可配置如下attributes
    img="skin.png"                      // 刮奖区域覆盖的图片
    color="#7d838b"                     // 如无图片，可设置刮奖区域颜色
    finger-width="30"                   // 手指宽(肥)度
    threshold="0.5"                     // 刮开面积到达此阈值时视为刮开。会在ele元素上触发scratchoff事件
-->
```

## 方法
```javascript
var scratchTicket = document.querySelector('canvas[is="nova-scratch-ticket"]');

scratchTicket.getScratchRatio();        // 获得刮开面积的比例

scratchTicket.refresh();                // 重新刮

scratchTicket.clear();                  // 刮干净

scratchTicket.on();                     // 绑定事件

scratchTicket.off();                    // 取消绑定事件

scratchTicket.trigger();                // 触发事件
```

## 扩展
```javascript
// Event: scratchoff
// 当刮奖区域达到配置项threshold的比例时，会触发此事件
scratchTicket.on('scratchoff', function() {
    alert('恭喜你，中奖啦！');
});
```

## 日志

### 1.0.1
1. 使用Nova.1.0.0.js作为底层框架

### 1.0.0 
首次发布


