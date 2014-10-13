#ScratchTicket

刮刮乐组件

## Demo
**注意：**PC用户请使用开发者工具模拟Touch行为

<style type="text/css">
.scratch {
    width: 266px;
    height: 100px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    background: #ebebeb;
    position: relative;
}

.scratch-ticket {
    background: url(http://p9.qhimg.com/d/inn/7fd309ad/win.png);
    background-size: 246px 80px;
    position: absolute;
    top: 10px;
    left: 10px;
}
</style>

<div class="scratch">
    <canvas class="scratch-ticket" width="246" height="80"></canvas>
</div>

<script type="text/javascript">
    _loader.add('scratchTicket', 'http://s0.qhimg.com/static/a51685405c918137/scratchTicket.1.0.0.js');
    _loader.use('scratchTicket', function() { 
        var scratchTicket = new ScratchTicket({
            element: '.scratch-ticket'
        });
        scratchTicket.$ele.on('scratchoff', function() {
            alert('恭喜你，中奖啦！');
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
<canvas class="scratch-ticket" width="246" height="80"></canvas>
```

### Javascript
需先引入依赖的文件：Zepto基础库
```markup
<script type="text/javascript" src="http://s0.qhimg.com/static/a51685405c918137/scratchTicket.1.0.0.js"></script>
<script type="text/javascript">
    var scratchTicket = new ScratchTicket({
        element: '.scratch-ticket'
    });
    scratchTicket.$ele.on('scratchoff', function() {
        alert('恭喜你，中奖啦！');
    });
</script>
```

## 配置

```javascript
var config = {
    element: '#scratch_canvas',         // 刮奖canvas元素或选择器
    img: '',                            // 刮奖区域图片, 可传图片地址或dom对象
    color: '#7d838b',                   // 如无图片，可设置刮奖区域颜色
    fingerWidth: '30',                  // 手指宽(肥)度
    threshold: 0.5                      // 刮开面积到达此阈值时视为刮开。会在ele元素上触发scratchoff事件
};
```

## 方法
```javascript
scratchTicket.getScratchRatio();        // 获得刮开面积的比例
```

## 扩展
```javascript
// 当刮奖区域达到配置项threshold的比例时，会触发此事件
scratchTicket.$ele.on('scratchoff', function() {
    alert('恭喜你，中奖啦！');
});
```

## 日志

### 1.0.0 
首次发布


