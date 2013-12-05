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

        .nova-suggest {
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

    <link rel="stylesheet" href="link[slide.css]({{site.baseurl}}nova/suggest/suggest.css?t={{site.time | date: "%H%M%S"}})">

Include nova.suggest.css or copy the required styles from it.

### Javascript

    <script src="zepto.js"></script>
    <script src="zepto.touch.js"></script>
    <script src="link[widget.js]({{site.baseurl}}nova/widget.js?t={{site.time | date: "%H%M%S"}})"></script>
    <script src="link[suggest.js]({{site.baseurl}}nova/suggest/suggest.js?t={{site.time | date: "%H%M%S"}})"></script>

### Usage

    <form action="http://www.so.com/s" id="search_form" charset="gbk">
        <div class="search">
            <input type="text" name="q" id="search_input" autocomplete="off"/>
            <input class="submit-btn" type="submit" value="Go"/>
        </div>
    </form>

    <script type="text/javascript">
        var input = $('#search_input');    

        var suggest = new Suggest({
            element: '#search_input',
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
            // Required
            url: '',                                    // request URL
            param: {},                                  // request parameters
            preprocessFun: null,                        // proprocess the return data from server

            // Optional
            method: 'jsonp',                            // request method
            listCount: 5,                               // max number of listed suggestions
            formID: undefined,                          // identify which form the input belongs to, defaultly its closet parent form
            isStorable: true,                           // whether enable local storage of search history
            storageKeyName: 'nova-search-history',      // local storage key of search history 
            lazySuggestInterval_ms: 100,                // decounce interval
            showClose: true,                            // whether to show close button
            showClearHistory: true,                     // whether to show clear history button
            closeText: 'Close',                         // close button text
            clearHistoryText: 'Clear history',          // clear history button text

            renderSuggestListFun: null,                 // method to render suggestion list
            getSuggestTemplateFun: null,                // method to get template of single suggestion


            className: {
                container: 'nova-suggest',              // suggestion list
                visible: 'nova-is-visible',             // status visible
                suggest: 'sugg-item',                   // single suggestion
                content: 'sugg-cont',                   // content of single suggestion
                copyControl: 'sugg-copy',               // copy button of single suggestion
                control: 'sugg-control',                // control bar
                closeControl: 'sugg-close',             // close button
                historyClearControl: 'sugg-clear'       // clear history button
            }
        },

### Configuration - preprocessFun **Required**

Parse the data from server and return an Array of suggest strings.

    /*
     * @method preprocessFun Proprocess the return data from server
     * @param {Object} data Return data from server
     * @return {Array} eg: ['real time pcr', 'real time ling']
     * */
     function preprocessFun(data) {//...}

### Configuration - renderSuggestListFun **Optional**

Render the suggestion list in your own way.

    /*
     * @method renderSuggestListFun Render suggestion list
     * @param {Array} data Suggestion data
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

