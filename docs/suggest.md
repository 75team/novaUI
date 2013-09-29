---
layout: widget
---

# Suggest 

## Example

<link rel="stylesheet" href="{{site.baseurl}}stylesheets/nova/nova.suggest.css?t={{site.time | date: "%H%M%S"}}" />
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
<script type="text/javascript" src="{{site.baseurl}}/javascripts/nova/nova.ui.js?t={{site.time | date: "%H%M%S"}}"></script>
<script type="text/javascript" src="{{site.baseurl}}/javascripts/nova/nova.suggest.js?t={{site.time | date: "%H%M%S"}}"></script>
<script type="text/javascript">
    var input = $('#search_input');    

    var suggest = new Suggest('#search_input', {
        url: 'http://sug.so.360.cn/suggest/word', 
        param: {encodeout: 'utf-8', encodein: 'utf-8'}, 
        method: 'jsonp', 
        preprocessFun: function(data) {
            var suggestlist = data['s']; 
            return suggestlist;
        }
    });
</script>


### CSS

    <link rel="stylesheet" href="nova.slide.css">

Include nova.suggest.css or copy the required styles from it.

### Javascript

    <script src="zepto.js"></script>
    <script src="zepto.touch.js"></script>
    <script src="nova.ui.js"></script>
    <script src="nova.suggest.js"></script>

### Usage

    <!-- include nova.slide.css -->
    <link rel="stylesheet" href="nova.suggest.css" />

    <form action="http://www.so.com/s" id="search_form" charset="gbk">
        <div class="search">
            <div class="input-container">
                <input type="text" name="q" id="search_input" autocomplete="off"/>
            </div>
            <input class="submit-btn" type="submit" value="Go"/>
        </div>
    </form>
    <script type="text/javascript" src="{{site.baseurl}}/javascripts/nova/nova.ui.js?t={{site.time | date: "%H%M%S"}}"></script>
    <script type="text/javascript" src="{{site.baseurl}}/javascripts/nova/nova.suggest.js?t={{site.time | date: "%H%M%S"}}"></script>
    <script type="text/javascript">
        var input = $('#search_input');    

        var suggest = new Suggest('#search_input', {
            url: 'http://sug.so.360.cn/suggest/word', 
            param: {encodeout: 'utf-8', encodein: 'utf-8'}, 
            method: 'jsonp', 
            preprocessFun: function(data) {
                var suggestlist = data['s']; 
                return suggestlist;
            }
        });
    </script>

### Configuration

     var config = {
            // 必填
            url: '',                                    // Suggest请求的url
            param: {},                                  // 请求的参数
            preprocessFun: null,                        // 服务端返回数据的预处理方法

            // 可选
            method: 'jsonp',                            // 请求方法，支持jsonp和ajax
            listCount: 5,                               // 最多显示suggestions个数 
            formID: undefined,                          // 表单ID, 默认为input框最近的外层Form元素 
            isStorable: true,                           // 是否通过localStorage保存搜索记录 
            storageKeyName: 'nova-search-history',      // 通过localStorage保存历史记录的key
            lazySuggestInterval_ms: 100,                // 每次input出suggest的延迟 
            showClose: true,                            // 是否显示关闭按钮
            showClearHistory: true,                     // 是否显示清理历史按钮
            closeText: 'Close',                         // 关闭按钮的文字
            clearHistoryText: 'Clear history',          // 清除历史记录的文字

            renderSuggestListFun: null,                 // 渲染Suggest列表的方法
            getSuggestTemplateFun: null,                // 获得单条Suggest模板的方法


            className: {
                container: 'nova-suggest',              // Suggest列表
                visible: 'nova-is-visible',             // 状态类，可视
                suggest: 'sugg-item',                   // 单条Suggest
                content: 'sugg-cont',                   // 单条Suggest的内容
                copyControl: 'sugg-copy',               // 单条Suggest的复制按钮
                control: 'sugg-control',                // Suggest列表下方的控制栏
                closeControl: 'sugg-close',             // 关闭按钮
                historyClearControl: 'sugg-clear'       // 清楚历史按钮
            }
        },

### Configuration - preprocessFun **Required**

Parse the data from server and return an Array of suggest strings.

    /*
     * @method preprocessFun 预处理服务端返回数据
     * @param {Object} data 服务端返回数据
     * @return {Array} 如['real time pcr', 'real time ling']
     * */
     function preprocessFun(data) {//...}

### Configuration - renderSuggestListFun **Optional**

Render the suggestion list in your own way.

    /*
     * @method renderSuggestListFun 渲染Suggest列表
     * @param {Array} data Suggest数据
     * */
     function renderSuggestListFun(data) {//...}

### Configuration - getSuggestTemplateFun **Optional**

Define your template of single suggest

This template support if, else, for, while, etc.   
See template documents [here](http://360.75team.com/~quguangyu/qwrap/js/_docs/_qiwu/index.htm#/qw/stringh/s.tmpl_.htm)

    /*
     * @method getSuggestTemplateFun
     * @return {String} template of single suggest
     **/
     function getSuggestTemplate() {//...}


#### template restrictions

1. You need to add attribute *data-role* to DOM elements to support functionalities.
2. Use {$suggest} as a placeholder for suggestion string

| Data-role         |  DOM  |
|-------------------|---------|
| suggest           | Single suggest element   |
| content           | Suggest content element    |
| copy-control      | Copy control element   |

See example:

    <div data-role="suggest">
        <span data-role="content">{$suggest}</span>
        <span data-role="copy-control"></span>
    </div>

