---
layout: widget
---

# Suggest 

## 例子
### 注意：请使用开发者工具模拟Touch事件

<link rel="stylesheet" href="{{site.baseurl}}nova/suggest/suggest.css?t={{site.time | date: "%H%M%S"}}" />
<div>
    <style>
        #search_form {
            position: relative;
            width: 100%;
            margin: auto;
            margin-bottom: 100px;
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
        }
    </style>
</div>
<form action="http://www.so.com/s" id="search_form" charset="gbk">
<div class="search">
    <div class="input-container">
        <input type="text" name="q" id="search_input" autocomplete="off"/>
    </div>
    <input class="submit-btn" type="submit" value="Go"/>
</div>
</form>
<script type="text/javascript" src="{{site.baseurl}}nova/widget.js?t={{site.time | date: "%H%M%S"}}"></script>
<script type="text/javascript" src="{{site.baseurl}}nova/suggest/suggest.js?t={{site.time | date: "%H%M%S"}}"></script>
<script type="text/javascript">
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
</script>


## 文件
### CSS

    <link rel="stylesheet" href="link[suggest.css]({{site.baseurl}}nova/suggest/suggest.css?t={{site.time | date: "%H%M%S"}})">

引入carousel.css，或者拷贝carousel.css中的必备(Required)样式。

### Javascript

    <script src="zepto.js"></script>
    <script src="zepto.touch.js"></script>
    <script src="link[widget.js]({{site.baseurl}}nova/widget.js?t={{site.time | date: "%H%M%S"}})"></script>
    <script src="link[suggest.js]({{site.baseurl}}nova/suggest/suggest.js?t={{site.time | date: "%H%M%S"}})"></script>

## 使用方法

    <!-- HTML 结构 -->
    <form action="http://www.so.com/s" id="search_form" charset="gbk">
        <div class="search">
            <input type="text" name="q" id="search_input" autocomplete="off"/>
            <input class="submit-btn" type="submit" value="Go"/>
        </div>
    </form>

    <!-- Javascript -->
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

## 配置

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

### preprocess 预处理方法
必须定义此方法，保证返回格式为Suggest数组。

    /*
     * 服务端返回数据预处理方法
     * @param {Object} data 服务端返回数据
     * @return {Array} 处理后的Suggest list, eg. ['阿拉蕾', '阿拉蕾帽子']
     */
    function preprocess(data) { 
        // Dealing with data
        return data;
    }

### renderList 渲染Suggest列表
如果需要自定义渲染方法，可以在config中传入renderList方法

    /*
     * 渲染列表, 生成html插入到list中
     * @param {Array} data Suggest数组
     */
    function renderList(data) {
        // ...
        this.$list.html(html);
    }

### getData 获取Suggest data 
如果需要自定义获取查询数据的方法，可以在config中传入getData方法  

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

### 自定义模板

    // 当前模板
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

1. 模板中可通过{$attrName}获得配置属性
2. \{\{suggest\}\}为模板中的内容占位符。eg. 当第i条内容data[i]为{suggest: '叮当'}时，\{\{suggest\}\}会被替换为"叮当"
3. 如不需要Close, Clear History等按钮，可在模板中删除


