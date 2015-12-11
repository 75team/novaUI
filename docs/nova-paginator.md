# &lt;nova-paginator&gt;

分页组件

## Demo

<script>
    _loader.add('customEle', '{{urls.paginator}}');
    _loader.use('customEle', function() { });
</script>

<nova-paginator default-style total-items="101" page-span="5" show-first-and-last>
</nova-paginator>

## 使用方法

### HTML

```markup
<nova-paginator default-style total-items="101" page-span="5" show-first-and-last>
</nova-paginator>
```

### Javascript
需先引入依赖的文件：Zepto基础库，Zepto touch模块, Zepto fx模块
```markup
<script src="{{urls.nova_polyfills}}"></script>
<script src="{{urls.nova}}"></script>
<script src="{{urls.paginator}}"></script>
```

## 配置

```markup
<nova-paginator></nova-paginator>
<!-- 可配置如下attributes
    default-style="false"               // 是否使用默认样式
    total-items="0"                     // 总数目
    items-per-page="10"                 // 每页显示多少个
    page-span="10"                      // 最多同时显示多少个页码
    show-prev-and-next                  // 是否显示上一页和下一页
    show-first-and-last="false"         // 是否显示首页和末页
    first-text="首页"                   // 首页文字
    last-text="末页"                    // 末页文字
    prev-text="上一页"                  // 上一页文字
    next-text="下一页"                  // 下一页文字
-->
```

## 方法
```javascript
var paginator = document.querySelector('nova-paginator');

paginator.totalItems = 100;             // 设置总数目
paginator.itemsPerPage = 20;            // 设置每一页显示个数
paginator.page = 3;                     // 设置当前页码
```

## 扩展
```javascript

// 监听选中页码变化
paginator.on('_pageChanged', function(ev, oldPage, curPage) {
    console.log('当前页码', curPage);
});

```

## 日志

### 1.0.0
首次发布

