# &lt;nova-loadmore&gt;

基于`<nova-swipable>`组件实现仿原生应用的拖拽加载效果，拖拽加载提示可配置，支持替换(replace)与拼接(append)两种模式。

## Demo

**注意：**PC用户请使用开发者工具模拟Touch行为

<style type="text/css">
    .phone {
        width:327px;
        height:667px;
        position:relative;
        margin:40px;
        background:url(novaui/img/iphone.png) no-repeat 0px 0px;
        background-size: 100% 100%;
    }
    node-loadmore[unresolved] {
        opacity: 0;
    }
    nova-loadmore .load-cont{
        padding: 0;
        margin: 0;
    }
    nova-loadmore .load-cont li{
        height: 40px;
        line-height: 40px;
        font-family: '微软雅黑';
        text-align: center;
        color: #fff;
        list-style:none;
    }

    nova-loadmore {
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

    nova-loadmore .load-cont{
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

<div class="phone">
<nova-loadmore unresolved mode="replace">
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
</nova-loadmore>
</div>

<script>
    _loader.add('customEle', '{{urls.loadmore}}');
    _loader.use('customEle', function() {
        $('.phone').on('touchmove',function(e){
            e.preventDefault();
        });

        var loadmore = document.querySelector('nova-loadmore');
        Nova.ready(loadmore, function() {
            loadmore.after('prePage',function(){
                //$('nova-loadmore .load-cont').append($("#poem"+(loadmore.page - 1)).html());
                $('nova-loadmore .load-cont').html($("#poem"+(loadmore.page - 1)).html());
                loadmore.refresh();
            });
            loadmore.after('nextPage',function(){
                //$('nova-loadmore .load-cont').append($("#poem"+(loadmore.page - 1)).html());
                $('nova-loadmore .load-cont').html($("#poem"+(loadmore.page - 1)).html());
                loadmore.refresh();
                if(loadmore.page == 4){
                    loadmore.set('isLastPage',true);
                }
            });
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
<nova-loadmore>
    <ul class="load-cont">
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
</nova-loadmore>
```

### Javascript

需先引入依赖的文件：Zepto基础库，Zepto touch模块, Zepto fx模块

```markup
<script src="{{urls.nova_polyfills}}"></script>
<script src="{{urls.nova}}"></script>
<script src="{{urls.loadmore}}"></script>
<script>
    var loadmore = document.querySelector('nova-loadmore');
    var loadCont = loadmore.querySelector('.load-cont');
    loadmore.after('prePage',function(){
        // 渲染上一页的内容
        loadCont.html(getPoem(loadCont.page));

        loadmore.refresh();
    });
    loadmore.after('nextPage',function(){
        // 渲染下一页的内容
        loadCont.html(getPoem(loadCont.page));

        loadmore.refresh();

        // 标识最后一页
        if(loadmore.page == 3){//如果当前为最后一页
            loadmore.set('isLastPage',true);
        }
    });
</script>
```

## 配置


```markup
<nova-loadmore></nova-loadmore>
<!-- 可配置如下attributes, 以下均为默认值
    direction="vertical"                // 滑动方向。默认vertical，可取vertical或horizontal
    speed="0.5"                         // 滑动速度。范围(0,1)，数值越大速度越快
    threshold="50"                      // 形成翻页的拖动临界值
    show-next-hint                      // 拖到底部松手后是否保持显示往后翻页的提示。默认为true，可通过show-next-hint="false"关闭
    show-pre-hint                       // 拖到顶部松手后是否保持显示往前翻页的提示。默认为false
    mode="replace"                      // 翻页模式，可取replace替换模式或append添加模式
    page="1"                            // 开始页码

    hint-content.first-page-text="当前页为第一页"
    hint-content.last-page-text="当前页为最后一页"
    hint-content.hint-loading="加载中..."
    hint-content.next-page-hint-default="上拉加载第{$pn}页"
    hint-content.next-page-hint-prepare="释放加载第{$pn}页"
    hint-content.pre-page-hint-default="下拉加载第{$pn}页"
    hint-content.pre-page-hint-prepare="释放加载第{$pn}页"
-->
```


## 属性和方法

```javascript

// 1. 每次加载之后必须手动调用refresh函数
loadmore.refresh();

// 2. 设置当前页为后一页，从而在拖动时不再提示上拉
loadmore.isLastPage = true;

// 3. 当前页码
loadmore.page;

```

## 扩展

```javascript
// 1. 在发生拉动到上一页的行为时执行代码
loadmore.after('prePage', function() {
    // 渲染上一页内容
    loadmore.refresh(); //每次加载之后必须手动调用refresh函数
});

// 2. 在发生拉动到下一页的行为时执行代码
loadmore.after('nextPage', function() {
    // 渲染下一页内容
    loadmore.refresh(); //每次加载之后必须手动调用refresh函数
});

```

## 日志

### 1.0.1
1. 使用Nova.1.0.0.js作为底层框架

### 1.0.0

首次发布
