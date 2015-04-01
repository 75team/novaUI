#Loadmore

Loadmore组件。基于Swipable组件实现仿原生应用的拖拽加载效果，拖拽加载提示可配置，支持替换(replace)与拼接(append)两种模式。

## Demo

**注意：**PC用户请使用开发者工具模拟Touch行为

<style type="text/css">
    .wrap{
        width:327px;
        height:667px;
        position:relative;
        margin:40px;
        background:url(../novaui/img/iphone.png) no-repeat 0px 0px;
        background-size: 100% 100%;
    }
    .load-wrap .load-cont{
        padding: 0;
        margin: 0;
    }
    .load-wrap .load-cont li{
        height: 40px;
        line-height: 40px;
        font-family: '微软雅黑';
        text-align: center;
        color: #fff;
        list-style:none;
    }

    .load-wrap {
  position: absolute;
  left: 17px;
  top: 62px;
  bottom: 77px;
  width: 292px;
  box-sizing: border-box;
  overflow: hidden;
  z-index: 1;
  border-radius: 4px;
  -webkit-user-select: none;
}

.load-wrap .load-cont{
    min-height: 100%;
}

.hint {
  color: #333;
  font-weight: 700;
  font-size: 14px;
  height: 40px;
  left: 50%;
  line-height: 40px;
  margin-left: -5px;
  text-align: center;
}
</style>

<div class='wrap'>
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
</div>

<script type="text/javascript">
    _loader.add('widget', 'http://s1.qhimg.com/static/c8b7de8c67377042/widget.1.0.2.js');
    _loader.add('swipable', 'http://s2.qhimg.com/!6c098979/swipable.1.0.1.js');
    _loader.add('loadmore', 'http://s5.qhimg.com/!2f9178e8/loadmore.js');
    _loader.use('widget, swipable, loadmore', function() {

    $('.load-wrap').on('touchmove',function(e){
        e.preventDefault();
    });
            var page = 0;

            var loadmore = new Loadmore({
element: '.load-wrap'
});
            loadmore.after('prePage',function(){
                page--;
                $('.load-wrap .load-cont').append($("#poem"+page).html());
                loadmore.refresh();
                });
            loadmore.after('nextPage',function(){
                page++
                $('.load-wrap .load-cont').append($("#poem"+page).html());
                loadmore.refresh();
                if(page == 3){
                loadmore.set('isLastPage',true);
                }
                });

    window.loadmore = loadmore;
});
</script>

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


## 使用方法

### HTML

```markup
<div style="width:300px;height:500px;position:relative;margin:40px;">
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
</div>
```

### Javascript
需先引入依赖的文件：Zepto基础库，Zepto touch模块, Zepto fx模块, Widget模块, Swipable模块
```markup
<script src="http://s0.qhimg.com/static/24fee17ef5eeefee/zepto_touch_fx.112.js"></script>
<script src="http://s1.qhimg.com/static/c8b7de8c67377042/widget.1.0.2.js"></script>
<script src="http://s2.qhimg.com/!6c098979/swipable.1.0.1.js"></script>
<script src="http://http://s5.qhimg.com/!2f9178e8/loadmore.js"></script>
<script type="text/javascript">
    var loadmore = new Loadmore({
        element: '.load-wrap'
    });
    loadmore.after('prePage',function(){
        // ....     加载上一页的Ajax处理逻辑
        loadmore.refresh();
    });
    loadmore.after('nextPage',function(){
        // ....     加载下一页的Ajax处理逻辑
        loadmore.refresh();
        if(page == 3){//如果当前为最后一页
            loadmore.set('isLastPage',true);
        }
    });
</script>
```
### CSS
容器的样式需符合如下规则
```css
.load-wrap {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 100%;
  box-sizing: border-box;
  overflow: hidden;
  z-index: 1;
}

.load-wrap .load-cont{
    min-height: 100%;
}

.hint {
  color: #333;
  font-weight: 700;
  font-size: 14px;
  height: 40px;
  left: 50%;
  line-height: 40px;
  margin-left: -5px;
  text-align: center;
}
```

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
    hintContent:{       //可赋值html片段
        firstPageText: '当前页为第一页',//若为append模式则可不初始化
        lastPageText: '当前页为最后一页',
        hintLoading: '加载中...',
        nextPageHintDefault: '上拉加载第{$pn}页',
        nextPageHintPrepare: '释放加载第{$pn}页',
        prePageHintDefault: '下拉加载第{$pn}页',//若为append模式则可不初始化
        prePageHintPrepare: '释放加载第{$pn}页' //若为append模式则可不初始化

    }
};
```


## 方法
```javascript

// 1. 每次加载之后必须手动调用refresh函数
loadmore.refresh();

// 2. 设置当前页为后一页
loadmore.set('isLastPage',true);

```

## 扩展
```javascript
// 1. 在加载前一页时执行代码
loadmore.after('prePage', function() {
    // ....     加载上一页的Ajax处理逻辑
    loadmore.refresh();//每次加载之后必须手动调用refresh函数
});

// 2. 在加载后一页时执行代码
loadmore.after('nextPage', function() {
    // ....     加载下一页的Ajax处理逻辑
    loadmore.refresh();//每次加载之后必须手动调用refresh函数
});

```

## 日志

### 1.0.0
首次发布
