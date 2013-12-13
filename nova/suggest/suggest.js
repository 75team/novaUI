(function() {

    // 功能
    // 1. 提供一套基础结构，支持复制，关闭，清除历史记录。同时可自定义模板，自定义渲染函数
    // 2. 监听input变化，实时请求suggest，并使用debounce和cache机制减少请求
    // 3. 提供本地存储查询记录功能 
    // 4. 检验suggest reponse顺序, 保证显示最新suggest内容
    var Suggest = Widget.extend({
        attrs: {
            // 请求数据
            url: '',                                    // Suggest请求的url
            param: {},                                  // 请求的参数
            keyName: null,                              // 查询关键词在请求中的字段名, 默认为input的name属性
            method: 'jsonp',                            // 请求方法，支持jsonp和ajax
            jsonp: 'callback',                          // jsonp callback字段名 
            
            // 自定义方法
            preprocess: null,                           // 服务端返回数据的预处理方法
            renderList: null,                           // 渲染Suggest的方法

            // 功能定制
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
        },

        setup: function() {

            var me = this;

            // suggest缓存
            this._history = {};         

            // 替换template中的{$className}占位符
            var template = this.get('template').replace(/{\$([^\})]*)}/g, function() {
                return me.get(arguments[1]);
            });

            // 生成Suggest DOM元素
            this.$suggest = $(template);
            this.$list = this.$suggest.find('.' + this.get('classNames.list'));

            // 获得单条suggest模板
            this.itemTpl = this.$list.html();

            // 将suggest插入到DOM
            this.$list.html('');
            this.$form = this.get('formId') ? $('#' + this.get('formId')) : this.$element.closest('form');
            var parentNode = this.get('parentNode') ? $(this.get('parentNode')) : this.$form;
            parentNode.append(this.$suggest);
            this.$suggest.hide();

            // 绑定事件
            this._bindInputEvent();             
            this._bindTapEvent();
            this._bindSubmitEvent();
        },


        _bindInputEvent: function() {
            var callback = debounce(function() {
                // 获得Input输入
                var query = this.$element.val().trim();
                if(query == '') {
                    var data = this._getStorageData();
                    this._updateSuggest(data, {showClear: true});
                }
            
                else if(this._history[query]){
                    var data = this._history[query]; 
                    this._updateSuggest(data);
                }

                // 输入不为空，且未缓存，则发送请求数据
                else {
                    this._request(query);
                }

            }, this.get('lazy_ms'));

            this.delegateEvents('input', callback); 
            this.delegateEvents('focus', callback); 
        },

        _bindTapEvent: function() {
            // 点击复制到输入框
            this.delegateEvents(this.$suggest, 'tap .' + this.get('classNames.copy'), function(ev) {
                this.$element.val($(ev.target).siblings('.' + this.get('classNames.content')).html()); 
                this.$element.trigger('input');
            });

            // 点击关闭
            this.delegateEvents(this.$suggest, 'tap .' + this.get('classNames.close'), function(ev) {
                this.$suggest.hide();
            });

            // 点击清除历史
            this.delegateEvents(this.$suggest, 'tap .' + this.get('classNames.clearHistory'), function(ev) {
                localStorage.removeItem(this.get('storageKeyName')); 
                this.$suggest.hide();
            });

            // 点击单条suggest
            this.delegateEvents(this.$suggest, 'tap .' + this.get('classNames.content'), function(ev) {
                this.$element.val($(ev.target).html()); 
                if(this.get('autocommit')) {
                    this.$form.submit();
                }
            });

            // 点击suggest以外，关闭suggest
            this.delegateEvents(document.body, 'tap', function(ev) {
                var target = ev.target;
                if(this.$element[0] != target && this.$suggest[0] != target && !$.contains(this.$suggest[0], target)) {
                    this.$suggest.hide();
                }
            });
        },

        _bindSubmitEvent: function() {
            this.delegateEvents(this.$form, 'submit', function(ev) {
                var query = this.$element.val().trim();
                // 将查询记录保存到localStorage
                if(query && this.get('isStorable')) {
                    var list = JSON.parse(localStorage.getItem(this.get('storageKeyName'))) || [];
                    if(list.indexOf(query) == -1) {
                        list.push(query);
                        localStorage.setItem(this.get('storageKeyName'), JSON.stringify(list));
                    }
                }
            });
        },

        _request: function(query) {
            var me = this, 
                param = me.get('param'), 
                requestId = -1;

            this.keyName = this.get('keyName') || this.$element.attr('name');

            param[this.keyName] = query;
            $.ajax({
                method: 'GET',  
                url: me.get('url'), 
                data: param, 
                dataType: me.get('method'), 
                jsonp: me.get('jsonp'),

                success: (function(rid) {
                    return function(data, status, xhr) {
                        // 若返回数据不是最新请求的suggest, 则不刷新sugget
                        if(rid != requestId) { return; }
                        me.get('preprocess') && (data = me.get('preprocess')(data));
                        me._updateSuggest(data);
                        me._history[query] = data;
                    } 
                })(++requestId)
            }); 
        },

        _getStorageData: function() {
            var list = JSON.parse(localStorage.getItem(this.get('storageKeyName'))) || [];
            return list;
        },

        _updateSuggest: function(data, options) {
            if(data.length == 0) {
                this.$suggest.hide();
                return;
            }
            this.renderSuggest(data, options);
            this.$suggest.show();
        },

        // 渲染Suggest
        renderSuggest: function(data, options) {
            // 将每一条suggest模板填充数据，添加到suggest list
            var html = '',
                count = this.get('listCount');
            for(var i = 0, len = data.length; i < len && i < count; i++) {
                html += template(this.itemTpl, {suggest: data[i]});
            }
            this.$list.html(html);

            this.$suggest.find('.' + this.get('classNames.clearHistory')).toggle(options && options.showClear || false);
        },

         
    });

    // Helpers
    function template(template, data) {
        var html = template.replace(/{{(\w*)}}/g, function(key) {
            return data[arguments[1]];
        });
        return html;
    }

    function debounce(func, threshold) {
        var timerId;
        return function() {
            var obj = this, args = arguments;
            function delayed() {
                func.apply(obj, args);
                timerId = undefined;    
            }

            // 如果上一个delay还没执行，则取消
            if(timerId) {
                clearTimeout(timerId);
            }
            // 重新计时
            timerId = setTimeout(delayed, threshold || 100);
        };
    }

    this.Suggest = Suggest;
})();
