#Suggest

搜索提示组件。

## Demo
**注意：**PC用户请使用开发者工具模拟Touch行为
<link rel="stylesheet" href="http://s4.qhimg.com/static/4959c856835b8d01/suggest.1.0.2.css" />

<style type="text/css">
    #search_form {
        position: relative;
        width: 100%;
        margin: auto;
        padding: 0;
    }

    .search {
        position: relative;
    }

    .input-container {
        margin-right: 50px;
    }

    #search_input {
        height: 30px;
        width: 100%;
        box-sizing: border-box;
        -webkit-box-sizing: border-box;
        -webkit-appearance: none;
        border: 1px solid #b4b4b4;
        border-radius: 0;
        padding-left: 5px;
    }

    .submit-btn {
        text-align: center;
        background-color: #ececec;
        position: absolute;
        height: 30px;
        line-height: 30px;
        width: 50px;
        top: 0;
        right: 0;
        border: 1px solid #b4b4b4;
        border-left: 0;
        border-radius: 0;
        -webkit-appearance: none;
    }

    .suggest {
        top: 30px;
        z-index: 1;
    }
</style>

<form action="http://www.so.com/s" id="search_form" charset="gbk">
<div class="search">
    <div class="input-container">
        <input type="text" name="q" id="search_input" autocomplete="off"/>
    </div>
    <input class="submit-btn" type="submit" value="Go"/>
</div>
</form>

<script type="text/javascript">
    _loader.add('widget', 'http://s1.qhimg.com/static/c8b7de8c67377042/widget.1.0.2.js');
    _loader.add('tab', 'http://s4.qhimg.com/static/61188253d0733195/suggest.1.0.2.js');
    _loader.use('widget, tab', function() { 
        var input = $('#search_input');    

        var suggest = new Suggest({
            element: '#search_input',
            keyName: 'word',
            url: 'http://sug.so.360.cn/suggest/word', 
            param: {encodeout: 'utf-8', encodein: 'utf-8'}, 
            method: 'jsonp', 
            preprocess: function(data) {
                var suggestlist = data['s']; 
                return suggestlist;
            }
        });
    });
</script>

## 使用方法

### HTML
| 默认类名          |  作用  |
|-------------------|---------|
| suggest           | suggest容器 |
| sugg-list         | suggest列表 |
| sugg-item         | 单条suggest |
| sugg-item-cont    | 单条suggest的内容 |
| sugg-item-copy    | 单条suggest复制到输入框按钮 |
| sugg-control      | suggest列表下方控制栏 |
| sugg-clear        | 清除历史按钮 |
| sugg-close        | 关闭按钮 |

```markup
<form action="http://www.so.com/s" id="search_form" charset="gbk">
    <div class="search">
        <input type="text" name="q" id="search_input" autocomplete="off"/>
        <input class="submit-btn" type="submit" value="Go"/>
    </div>
</form>
```

### Javascript
需先引入依赖的文件：Zepto基础库，Zepto touch模块 
```markup
<script type="text/javascript" src="http://s1.qhimg.com/static/c8b7de8c67377042/widget.1.0.2.js"></script>
<script type="text/javascript" src="http://s4.qhimg.com/static/61188253d0733195/suggest.1.0.2.js"></script>
<script type="text/javascript">
    var input = $('#search_input');    

    var suggest = new Suggest({
        element: '#search_input',
        keyName: 'word';
        url: 'http://sug.so.360.cn/suggest/word', 
        param: {encodeout: 'utf-8', encodein: 'utf-8'}, 
        method: 'jsonp', 
        preprocess: function(data) {
            var suggestlist = data['s']; 
            return suggestlist;
        }
    });
</script>
```
### CSS
```markup
<link rel="stylesheet" href="http://s4.qhimg.com/static/4959c856835b8d01/suggest.1.0.2.css" />
```
使用默认样式，请引入以上文件。若需自定义样式，仅复制未压缩版文件中/\* Required \*/注释下的样式即可。

## 配置

```javascript
var config = {
    // 请求数据
    url: '',                                    // Suggest请求的url
    param: {},                                  // 请求的参数
    keyName: null,                              // 查询关键词在请求中的字段名, 默认为input的name属性
    method: 'jsonp',                            // 请求方法，支持jsonp和ajax
    jsonp: 'callback',                          // jsonp callback字段名 
    
    // 自定义方法
    preprocess: null,                           // 服务端返回数据的预处理方法
    renderList: null,                           // 渲染Suggest的方法
    getData: null,                              // 获取Suggest data list的方法

    // 功能
    lazy_ms: 100,                               // 当输入框内容超过n秒未改变，才发送请求 
    isStorable: true,                           // 是否通过localStorage保存搜索记录 
    storageKeyName: 'nova-search-history',      // 通过localStorage保存历史记录的key
    autocommit: true,                           // 点击内容区域是否自动submit

    // 显示
    formId: null,                               // 若为空，则默认为input所在的form
    parentNode: null,                           // 若parentNode不为空，则将suggest插入到parentNode. 否则插入到所属的form中
    listCount: 5,                               // 最多显示suggestions个数 
    closeText: 'Close',                         // 关闭按钮的文字
    clearHistoryText: 'Clear history',          // 清除历史记录的文字

    // 类名
    classNames: {
        container: 'suggest',                   // Suggest Wrap

        list: 'sugg-list',                      // Suggest列表
        item: 'sugg-item',                      // 单条Suggest
        content: 'sugg-item-cont',              // 单条Suggest的内容
        copy: 'sugg-item-copy',                 // 单条Suggest的复制到输入框按钮

        control: 'sugg-control',                // Suggest列表下方的控制栏
        clearHistory: 'sugg-clear',             // 清除历史按钮
        close: 'sugg-close'                     // 关闭按钮
    },

    // 完整模板
    // 也可传dom或jquery/zepto dom对象。但此方式不支持{$attrName}占位符
    template: '<div class="{$classNames.container}">' 
                + '<div class="{$classNames.list}">'
                    // 单条suggest模板
                    + '<div class="{$classNames.item}">' 
                        + '<span class="{$classNames.content}">{{suggest}}</span>'
                        + '<span class="{$classNames.copy}"></span>'
                    + '</div>'
                + '</div>'
                + '<div class="{$classNames.control}">'
                    + '<span class="{$classNames.clearHistory}">{$clearHistoryText}</span>'
                    + '<span class="{$classNames.close}">{$closeText}</span>'
                + '</div>'
            + '</div>'
};
```

## 方法
无

## 扩展

### 预处理数据
配置中传入preprocess方法，转换服务端数据为Suggest规定格式
```javascript
/*
 * 预处理服务端返回数据
 * @param {Object} data 服务端返回数据
 * @return {Array} 处理后的Suggest list, eg. ['阿拉蕾', '阿拉蕾帽子']
 */
function preprocess(data) { 
    // Dealing with data
    return data;
}
```

### 自定义渲染
配置中传入renderList方法，可自定义渲染
```javascript
/*
 * 渲染列表, 生成html插入到list中
 * @param {Array} data Suggest数组
 */
function renderList(data) {
    // ...
    this.$list.html(html);
}
```

### 自定义数据获取方式
配置中传入getData方法，可自定义获取提示的方法
```javascript
/*
 * 获取Suggest内容 
 * @param {String} query 用户输入查询内容 
 *
 * getData方法职责：
 * 1. 获取Suggest data
 * 2. 调用this.updateSuggestData(data)来更新Suggest
 *
 * @method this.updateSuggestData(data)
 * @param {Array} data
 * data格式
 * 1. [{channel: 'youku', suggest: '叮当'}, {channel: '56', suggest: '叮当'}] 
 *    模板中的双大括号占位符会根据data[n]对象解析
 * 2. 简写['cont1', 'cont2'], 相当于[{suggest: 'cont1', suggest: 'cont2'}]
 *
 * helpers：
 * this.getStorageData(data)        获得localStorage中存储的查询历史记录
 * this.request(query)              由suggest根据配置来请求数据和更新列表
 * this.cache(query) = data         缓存Suggest内容
 * 
 */
// Example
function getData(query) {
    var me = this;
    var data [];
    if(query == '') {
        data = this.getStorageData();       // 获取本地查询记录
        this.updateSuggest(data, {showClear: true});    
    }

    else if(query.indexOf('spiderman') != '-1') {
        data = staticData[query];
        me.updateSuggest(data);             // 刷新Suggest列表
        me.cache[query] = data;             // 缓存查询结果, 那么会避免重复请求
    }

    else {
        this.request(query);                // 由suggest根据url等配置来请求和更新数据
    }
}
```

### 自定义模板

```javascript
/*
以下为默认模板
1. 模板中可通过{$attrName}获得配置属性
2. {{suggest}}为模板中的内容占位符。eg. 当第i条内容data[i]为{suggest: '叮当'}时，{{suggest}}会被替换为"叮当"
3. 如不需要Close, Clear History等按钮，可在模板中删除
*/
template: '<div class="{$classNames.container}">' 
            + '<div class="{$classNames.list}">'
                // 单条suggest模板
                + '<div class="{$classNames.item}">' 
                    + '<span class="{$classNames.content}">\{\{suggest\}\}</span>'
                    + '<span class="{$classNames.copy}"></span>'
                + '</div>'
            + '</div>'
            + '<div class="{$classNames.control}">'
                + '<span class="{$classNames.clearHistory}">{$clearHistoryText}</span>'
                + '<span class="{$classNames.close}">{$closeText}</span>'
            + '</div>'
        + '</div>'

/* template配置也可传入dom或jquery/zepto dom对象, 但此方式不支持{$attrName}占位符 */
template: $('.suggest-template')

```




## 日志

### 1.0.2 
配置项template支持传dom元素

### 1.0.1 
升级依赖widget.js版本为1.0.2

### 1.0.0 
首次发布


