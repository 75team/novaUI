(function() {
    var tmpl = nova.utils.tmpl;

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

    function constructor(ele, config) {
        var me = this;

        me.history = {};    // 搜索和suggest记录
        me._preprocess = config.preprocessFun;
        me.$suggest = null;
        me.$form = me.config.formID ? $('#' + me.config.formID) : this.root.closest('form'), 
        me.storageData = {}; 
        
        if(config.renderSuggestListFun) me._renderList = config.renderSuggestListFun;
        if(config.getSuggestHtmlFun) me._getSuggestHtml = config.getSuggestHtmlFun;
        
        me.controlTemplate = '<div data-role="suggest"><span data-role="close">' + config.closeText + '</span></div>'; 
        me.historyControlTemplate = '<div data-role="suggest"><span data-role="clear-history">' + config.clearHistoryText + '</span><span data-role="close">' + config.closeText + '</span></div>', 

        me._initStorageData();
        me._bindInputEvent();
        me._bindSubmitEvent();
    }

    var prototype = {
        _defaultConf: {
            // 必填
            url: '', 
            param: {}, 
            preprocessFun: null, 

            // 可选
            method: 'jsonp',    // 请求方法，支持jsonp和ajax
            listCount: 5,       // 最多显示suggestions个数 
            formID: undefined,  // 表单ID, 默认为input框最近的外层Form元素 
            isStorable: true,   // 是否通过localStorage保存搜索记录 
            storageKeyName: 'nova-search-history',      // 通过localStorage保存历史记录的key
            lazySuggestInterval_ms: 100,       // 每次input出suggest的延迟 
            showClose: true,    // 是否显示关闭按钮
            showClearHistory: true,     // 是否显示清理历史按钮
            closeText: '关闭', 
            clearHistoryText: '清空历史记录', 

            renderSuggestListFun: null, 
            getSuggestHtmlFun: null, 

            suggestTemplate: '<div data-role="suggest"><span data-role="content" data-cont="{$suggest}">{$suggest}</span><span data-role="copy-control" data-cont="{$suggest}">!</span></div>',

            className: {
                container: 'nova-suggest', 
                suggest: 'sugg-item', 
                content: 'sugg-cont', 
                copyControl: 'sugg-copy', 
                closeControl: 'sugg-close', 
                historyClearControl: 'history-clear'
            }
        }, 


        _bindInputEvent: function() {
            var me = this;
            me.root.on('input', debounce(function() {
                // get value
                var query = me._getInput().trim();
                
                // request
                if(query == '') {
                    me._renderStorageHistory();
                }
                else if(me._inHistory(query)) {
                    me._renderList(me._getHistoryData(query));
                } 
                else {
                    me._requestSugg(query);
                }
            }), me.config.lazySuggestInterval_ms);

            me.root.on('focus', function() {
                var query = me._getInput().trim();
                if(query == '') {
                    me._renderStorageHistory();
                }
                else if(me._inHistory(query)) {
                    me._renderList(me._getHistoryData(query));
                } 
                else {
                    me._requestSugg(query);
                }
            });
        },

        _bindTouchEvent: function() {
            var me = this;
            me.$suggest.delegate('.' + me.config.className.content, 'tap', function(e) {
                var $sugg = $(this), 
                    query = $sugg.data('cont');
                me._setInput(query);    
                me._submit();
            });

            me.$suggest.delegate('.' + me.config.className.copyControl, 'tap', function(e) {
                var $sugg = $(this), 
                    query = $sugg.data('cont');
                me._setInput(query);
                me.root.trigger('input');
            });

            me.$suggest.delegate('.' + me.config.className.historyClearControl, 'tap', function(e) {
                me.storageData.length = 0;
                localStorage.removeItem(me.config.storageKeyName); 
                me.$suggest.html('');
            });

            me.$suggest.delegate('.' + me.config.className.closeControl, 'tap', function(e) {
                me.$suggest.html(''); 
            });
        }, 

        _bindSubmitEvent: function() {
            var me = this;
            me.$form.on('submit', function() {
                var query = me._getInput().trim();
               if(me.config.isStorable && me.storageData.indexOf(query) == -1) {
                    me.storageData.push(query);
                    localStorage.setItem(me.config.storageKeyName, JSON.stringify(me.storageData));
                }
            });
        }, 

        _getInput: function() {
            return this.root.val(); 
        }, 

        _setInput: function(value) {
           this.root.val(value);        
        }, 

        _inHistory: function(query) {
            return !!this.history[query];
        }, 

        _getHistoryData: function(query) {
            return this.history[query]; 
        }, 

        _requestSugg: function(query) {
            var me = this, 
                param = me.config.param;
            param.word = query;
            $.ajax({
                method: 'GET',  
                url: me.config.url, 
                data: param, 
                dataType: me.config.method, 
                success: function(data, status, xhr) {
                    me._processSuggests(query, data);
                } 
            }); 
        }, 

        _processSuggests: function(query, data) {
            if(this._preprocess) {
                data = this._preprocess(data);
            }
            this._renderList(data);
            this.history[query] = data;
        }, 

        // data: ['s1', 's2', 's3']
        _renderList: function(data) {
            var me = this, 
                containerClass = me.config.className.container, 
                count = me.config.listCount, 
                html = '';
            // 第一次调用
            if(!me.$suggest) {
                // 添加suggest dom
                me.$form.append('<div class="' + containerClass + '"></div>');
                me.$suggest = me.$form.find('.' + containerClass);
                me._bindTouchEvent();
            }
            for(var i = 0, len = data.length; i < len && i < count; i++) {
                html += me._getSuggestHtml(data[i]);
            }
            if(data.length > 0) {
                html += me.controlTemplate;
            }
            me.$suggest.html(html);
            me._parse();
        }, 


        _renderStorageHistory: function() {
            var me = this;
            me._renderList(me.storageData);  
            if(me.storageData.length > 0) {
                me.$suggest.append(me.historyControlTemplate);
            }
            me._parse();
        }, 

        _getSuggestHtml: function(data) {
            //var template = this.suggestTemplate;
            //return tmpl(template, {'suggest': data}); 
            var tpl = tmpl(this.config.suggestTemplate);
            var html = tpl({suggest: data});
            return html;
        }, 

        _parse: function() {
            $('[data-role=suggest]').addClass(this.config.className.suggest);
            $('[data-role=content]').addClass(this.config.className.content);
            $('[data-role=copy-control]').addClass(this.config.className.copyControl);
            if(this.config.showClose) {
                $('[data-role=close]').addClass(this.config.className.closeControl);
            }
            if(this.config.showClearHistory) {
                $('[data-role=clear-history]').addClass(this.config.className.historyClearControl);
            }
        }, 

        _initStorageData: function() {
            var list = JSON.parse(localStorage.getItem(this.config.storageKeyName)) || [];                  
            this.storageData = list;
        }, 

        _submit: function(query) {
            this.$form.submit();
        }
    };

    var Suggest = nova.ui.define(constructor, prototype);    
    window.Suggest = window.Suggest || Suggest;
})();
