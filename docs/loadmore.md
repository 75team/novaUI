#Loadmore

Loadmore组件。基于Swipable组件实现仿原生应用的拖拽加载效果，拖拽加载提示可配置，支持替换与拼接两种模式。

## Demo
**注意：**PC用户请使用开发者工具模拟Touch行为
<link rel="stylesheet" href="http://s7.qhimg.com/!0a229d59/loadmore.css" />

<style type="text/css">
    li{
        height: 40px;
        line-height: 40px;
        font-family: '微软雅黑';
        text-align: center;
        color: #fff;
    }
</style>

<div class="load-wrap">
    <ul class="load-cont"  style="background-color:#f5574b">
        <li>第一首</li>
        <li>你是人间的四月天</li>
        <li>我说你是人间的四月天；</li>
        <li>笑响点亮了四面风；</li>
        <li>轻灵在春的光艳中交舞着变。</li>
        <li>你是四月早天里的云烟，</li>
        <li>黄昏吹着风的软，</li>
        <li>星子在无意中闪，</li>
        <li>细雨点洒在花前。</li>
        <li>那轻，那娉婷,你是，</li>
        <li>鲜妍百花的冠冕你戴着，</li>
        <li>你是天真，庄严，</li>
        <li>你是夜夜的月圆。</li>
        <li>雪化后那篇鹅黄，你像；</li>
        <li>新鲜初放芽的绿，你是；</li>
        <li>柔嫩喜悦，</li>
        <li>水光浮动着你梦期待中白莲。</li>
        <li>你是一树一树的花开，</li>
        <li>是燕在梁间呢喃，</li>
        <li>——你是爱，是暖，是希望，</li>
        <li>你是人间的四月天！</li>
    </ul>
</div>

<script src="http://s0.qhimg.com/static/24fee17ef5eeefee/zepto_touch_fx.112.js"></script>
<script src="http://s1.qhimg.com/static/c8b7de8c67377042/widget.1.0.2.js"></script>
<script src="http://s2.qhimg.com/!6c098979/swipable.1.0.1.js"></script>
<script src="http://s4.qhimg.com/!05c82cc7/loadmore.js"></script>
<script type="text/poem" id="poem0">
    <li>第一首</li>
    <li>你是人间的四月天</li>
    <li>我说你是人间的四月天；</li>
    <li>笑响点亮了四面风；</li>
    <li>轻灵在春的光艳中交舞着变。</li>
    <li>你是四月早天里的云烟，</li>
    <li>黄昏吹着风的软，</li>
    <li>星子在无意中闪，</li>
    <li>细雨点洒在花前。</li>
    <li>那轻，那娉婷,你是，</li>
    <li>鲜妍百花的冠冕你戴着，</li>
    <li>你是天真，庄严，</li>
    <li>你是夜夜的月圆。</li>
    <li>雪化后那篇鹅黄，你像；</li>
    <li>新鲜初放芽的绿，你是；</li>
    <li>柔嫩喜悦，</li>
    <li>水光浮动着你梦期待中白莲。</li>
    <li>你是一树一树的花开，</li>
    <li>是燕在梁间呢喃，</li>
    <li>——你是爱，是暖，是希望，</li>
    <li>你是人间的四月天！</li>
</script>
<script type="text/poem" id="poem1">
    <li>第二首</li>
    <li>国风·周南·关雎</li>
    <li>关关雎鸠，在河之洲。</li>
    <li>窈窕淑女，君子好逑。</li>
    <li>参差荇菜，左右流之。</li>
    <li>窈窕淑女，寤寐求之。</li>
    <li>求之不得，寤寐思服。</li>
    <li>悠哉悠哉，辗转反侧。</li>
    <li>参差荇菜，左右采之。</li>
    <li>窈窕淑女，琴瑟友之。</li>
    <li>参差荇菜，左右芼之。</li>
    <li>窈窕淑女，钟鼓乐之。</li>
    <li></li>
    <li>雎鸠相对鸣唱，双栖在黄河的小岛之上。</li>
    <li>雎鸟相向合鸣，相依相恋，兴起淑女陪君子的联想。</li>
    <li>文静秀丽的姑娘，是我心中所想追求的对象。</li>
</script>
<script type="text/poem" id="poem2">
    <li>第三首</li>
    <li>蒹葭</li>
    <li>蒹葭苍苍，白露为霜。</li>
    <li>所谓伊人，在水一方。</li>
    <li>溯洄从之，道阻且长。</li>
    <li>溯游从之，宛在水中央。</li>
    <li>蒹葭萋萋，白露未晞。</li>
    <li>所谓伊人，在水之湄。</li>
    <li>溯洄从之，道阻且跻。</li>
    <li>溯游从之，宛在水中坻。</li>
    <li>蒹葭采采，白露未已。</li>
    <li>所谓伊人，在水之涘。</li>
    <li>溯洄从之，道阻且右。</li>
    <li>溯游从之，宛在水中沚。</li>
    <li></li>
    <li>《蒹葭》，出自《诗经·国风·秦风》</li>
    <li>《诗经·国风·秦风》蒹葭是一种植物，指芦苇。</li>
    <li>在秦国这个好战乐斗的尚武之邦，</li>
    <li>竟有这等玲珑剔透、缠绵悱恻之作，</li>
    <li>实乃一大奇事。</li>
</script>
<script type="text/poem" id="poem3">
    <li>最后一首</li>
    <li>静夜思</li>
    <li>床前明月光，疑是地上霜。</li>
    <li>举头望明月，低头思故乡。</li>
</script>
<script type="text/javascript">
    var colors = ['#f5574b','#fdab40','#31b16c','#c8717c'];
    var page = 0;

    var loadmore = new Loadmore({
        element: '.load-wrap',
        mode: 'replace'
    });
    loadmore.after('prePage',function(){
        page--;
        $('.load-wrap .load-cont').html($("#poem"+page).html());
        $('.load-wrap .load-cont').css("background-color",colors[(Math.round(Math.random()*10)%4)]);
        loadmore.refresh();
    });
    loadmore.after('nextPage',function(){
        page++
        $('.load-wrap .load-cont').html($("#poem"+page).html());
        $('.load-wrap .load-cont').css("background-color",colors[(Math.round(Math.random()*10)%4)]);
        loadmore.refresh();
        if(page == 3){
            loadmore.set('isLastPage',true);
        }
    });
</script>

## 使用方法

### HTML

```markup
<div class="load-wrap">
    <ul class="load-cont"  style="background-color:#f5574b">
        <li>第一首</li>
        <li>你是人间的四月天</li>
        <li>我说你是人间的四月天；</li>
        <li>笑响点亮了四面风；</li>
        <li>轻灵在春的光艳中交舞着变。</li>
        <li>你是四月早天里的云烟，</li>
        <li>黄昏吹着风的软，</li>
        <li>星子在无意中闪，</li>
        <li>细雨点洒在花前。</li>
        <li>那轻，那娉婷,你是，</li>
        <li>鲜妍百花的冠冕你戴着，</li>
        <li>你是天真，庄严，</li>
        <li>你是夜夜的月圆。</li>
        <li>雪化后那篇鹅黄，你像；</li>
        <li>新鲜初放芽的绿，你是；</li>
        <li>柔嫩喜悦，</li>
        <li>水光浮动着你梦期待中白莲。</li>
        <li>你是一树一树的花开，</li>
        <li>是燕在梁间呢喃，</li>
        <li>——你是爱，是暖，是希望，</li>
        <li>你是人间的四月天！</li>
    </ul>
</div>
```

### Javascript
需先引入依赖的文件：Zepto基础库，Zepto touch模块, Zepto fx模块, Widget模块, Swipable模块
```markup
<script src="http://s0.qhimg.com/static/24fee17ef5eeefee/zepto_touch_fx.112.js"></script>
<script src="http://s1.qhimg.com/static/c8b7de8c67377042/widget.1.0.2.js"></script>
<script src="http://s2.qhimg.com/!6c098979/swipable.1.0.1.js"></script>
<script src="http://s4.qhimg.com/!05c82cc7/loadmore.js"></script>
<script type="text/poem" id="poem0">
    <li>第一首</li>
    <li>你是人间的四月天</li>
    <li>我说你是人间的四月天；</li>
    <li>笑响点亮了四面风；</li>
    <li>轻灵在春的光艳中交舞着变。</li>
    <li>你是四月早天里的云烟，</li>
    <li>黄昏吹着风的软，</li>
    <li>星子在无意中闪，</li>
    <li>细雨点洒在花前。</li>
    <li>那轻，那娉婷,你是，</li>
    <li>鲜妍百花的冠冕你戴着，</li>
    <li>你是天真，庄严，</li>
    <li>你是夜夜的月圆。</li>
    <li>雪化后那篇鹅黄，你像；</li>
    <li>新鲜初放芽的绿，你是；</li>
    <li>柔嫩喜悦，</li>
    <li>水光浮动着你梦期待中白莲。</li>
    <li>你是一树一树的花开，</li>
    <li>是燕在梁间呢喃，</li>
    <li>——你是爱，是暖，是希望，</li>
    <li>你是人间的四月天！</li>
</script>
<script type="text/poem" id="poem1">
    <li>第二首</li>
    <li>国风·周南·关雎</li>
    <li>关关雎鸠，在河之洲。</li>
    <li>窈窕淑女，君子好逑。</li>
    <li>参差荇菜，左右流之。</li>
    <li>窈窕淑女，寤寐求之。</li>
    <li>求之不得，寤寐思服。</li>
    <li>悠哉悠哉，辗转反侧。</li>
    <li>参差荇菜，左右采之。</li>
    <li>窈窕淑女，琴瑟友之。</li>
    <li>参差荇菜，左右芼之。</li>
    <li>窈窕淑女，钟鼓乐之。</li>
    <li></li>
    <li>雎鸠相对鸣唱，双栖在黄河的小岛之上。</li>
    <li>雎鸟相向合鸣，相依相恋，兴起淑女陪君子的联想。</li>
    <li>文静秀丽的姑娘，是我心中所想追求的对象。</li>
</script>
<script type="text/poem" id="poem2">
    <li>第三首</li>
    <li>蒹葭</li>
    <li>蒹葭苍苍，白露为霜。</li>
    <li>所谓伊人，在水一方。</li>
    <li>溯洄从之，道阻且长。</li>
    <li>溯游从之，宛在水中央。</li>
    <li>蒹葭萋萋，白露未晞。</li>
    <li>所谓伊人，在水之湄。</li>
    <li>溯洄从之，道阻且跻。</li>
    <li>溯游从之，宛在水中坻。</li>
    <li>蒹葭采采，白露未已。</li>
    <li>所谓伊人，在水之涘。</li>
    <li>溯洄从之，道阻且右。</li>
    <li>溯游从之，宛在水中沚。</li>
    <li></li>
    <li>《蒹葭》，出自《诗经·国风·秦风》</li>
    <li>《诗经·国风·秦风》蒹葭是一种植物，指芦苇。</li>
    <li>在秦国这个好战乐斗的尚武之邦，</li>
    <li>竟有这等玲珑剔透、缠绵悱恻之作，</li>
    <li>实乃一大奇事。</li>
</script>
<script type="text/poem" id="poem3">
    <li>最后一首</li>
    <li>静夜思</li>
    <li>床前明月光，疑是地上霜。</li>
    <li>举头望明月，低头思故乡。</li>
</script>
<script type="text/javascript">
    var colors = ['#f5574b','#fdab40','#31b16c','#c8717c'];
    var page = 0;

    var loadmore = new Loadmore({
        element: '.load-wrap',
        mode: 'replace'
    });
    loadmore.after('prePage',function(){
        page--;
        $('.load-wrap .load-cont').html($("#poem"+page).html());
        $('.load-wrap .load-cont').css("background-color",colors[(Math.round(Math.random()*10)%4)]);
        loadmore.refresh();
    });
    loadmore.after('nextPage',function(){
        page++
        $('.load-wrap .load-cont').html($("#poem"+page).html());
        $('.load-wrap .load-cont').css("background-color",colors[(Math.round(Math.random()*10)%4)]);
        loadmore.refresh();
        if(page == 3){
            loadmore.set('isLastPage',true);
        }
    });
</script>
```
### CSS
```markup
<link rel="stylesheet" href="http://s7.qhimg.com/!0a229d59/loadmore.css" />
```
使用默认样式，请引入以上文件。

## 配置

```javascript
var config = {
    dir: 'vertical',    // 可取值vertical, horizontal
    speed: 0.5,         // 滑动速度 
    threshold: 50,      // 拖动范围
    showNextHint: true,        //默认显示往后翻页的提示
    showPreHint: false,     //默认隐藏往前翻页的提示
    mode: 'replace',  //默认replace替换模式，还可取值append添加模式
    page: 1,            //默认页码从第一页开始
    isLastPage: false,  //当前是否最后一页
    hintContent:{
        firstPageText: '当前页为第一页',
        lastPageText: '当前页为最后一页',
        hintLoading: '加载中...',
        nextPageHintDefault: '上拉加载第{$pn}页',
        nextPageHintPrepare: '释放加载第{$pn}页',
        prePageHintDefault: '下拉加载第{$pn}页',
        prePageHintPrepare: '释放加载第{$pn}页'
    }
};  
```


## 方法
```javascript
tab.next();                        // 切换到下一个内容
tab.prev();                        // 切换到上一个内容
tab.switch(n);                     // 切换到第n个内容
tab.set('autoplay', false)         // 打开或关闭自动轮播
```

## 扩展
```javascript
// 1. 在切换前后执行代码
loadmore.on('prePage', function() {
    // ....     加载前一页的Ajax处理逻辑
    loadmore.refresh();//每次加载之后必须手动调用refresh函数
});

loadmore.on('nextPage', function() {
    // ....     加载下一页的Ajax处理逻辑
    loadmore.refresh();//每次加载之后必须手动调用refresh函数
});

// 2. 每次加载之后必须手动调用refresh函数
loadmore.refresh(); 

// 3. 设置当前页为后一页
loadmore.set('isLastPage',true);

```

## 日志

### 1.0.0 
首次发布
