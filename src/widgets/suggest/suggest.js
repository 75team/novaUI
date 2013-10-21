(function() {
    // Helpers
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

    this.Suggest = Widget.extend({
        defaultConfig: {
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

        setup: function() {
            var me = this;
            var config = this.config;

            me.history = {};                        // 搜索和suggest记录
            me._preprocess = config.preprocessFun;  // Suggest数据预处理方法
            me.$suggest = null;                     // Suggest的Zepto对象
            me.$form = me.config.formID ? $('#' + me.config.formID) : this.element.closest('form'),    // Suggest的表单的Zepto对象
            me.storageData = [];                    // 本地存储的查询记录

            if(config.renderSuggestListFun) me._renderList = config.renderSuggestListFun;   // 渲染Suggest列表的方法
            if(config.getSuggestTemplateFun) me._getSuggestTempFun = config.getSuggestTemplateFun;     // 获得单条Suggest模板的方法

            // 控制条模板
            me.controlTemplate = '<div data-role="control"><span data-role="close">' + config.closeText + '</span></div>';
            // 历史记录控制条模板
            me.historyControlTemplate = '<div data-role="control"><span data-role="clear-history">' + config.clearHistoryText + '</span><span data-role="close">' + config.closeText + '</span></div>', 
            // 单条suggest的模板
            me.suggestTemplate = '<div data-role="suggest"><span data-role="content" data-cont="{$suggest}">{$suggest}</span><span data-role="copy-control" data-cont="{$suggest}"></span></div>',

            // 初始化历史查询数据
            me._initStorageData();

            // 添加输入和提交时间监听
            me._bindInputEvent();
            me._bindSubmitEvent();
        },

        // 绑定Input事件
        _bindInputEvent: function() {
            var me = this;
            me.element.on('input focus', debounce(function() {
                // 获得Input输入
                var query = me._getInput().trim();

                // 解析输入并显示结果
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
        },

        // 绑定Touch事件
        _bindTouchEvent: function() {
            var me = this;

            // 点击内容，Submit
            me.$suggest.delegate('.' + me.config.className.content, 'tap', function(e) {
                var $sugg = $(this), 
                    query = $sugg.data('cont');
                me._setInput(query);    

                /* Hide suggest */
                me.$suggest.removeClass(me.config.className.visible);

                me._submit();
            });

            // 点击复制，将Suggest内容复制到Input
            me.$suggest.delegate('.' + me.config.className.copyControl, 'tap', function(e) {
                var $sugg = $(this), 
                    query = $sugg.data('cont');
                me._setInput(query);

                /* Hide suggest */
                me.$suggest.removeClass(me.config.className.visible);

                me.element.trigger('input');
            });

            // 点击清理历史记录
            me.$suggest.delegate('.' + me.config.className.historyClearControl, 'tap', function(e) {
                me.storageData.length = 0;
                localStorage.removeItem(me.config.storageKeyName); 

                /* Hide suggest */
                me.$suggest.removeClass(me.config.className.visible);
            });

            // 点击关闭
            me.$suggest.delegate('.' + me.config.className.closeControl, 'tap', function(e) {
                /* Hide suggest */
                me.$suggest.removeClass(me.config.className.visible);
            });

            $(document.body).on('tap', function(ev) {
                var target = ev.target;
                //alert('@');
                if(me.element[0] != target && me.$suggest[0] != target && !$.contains(me.$suggest[0], target)) {
                    me.$suggest.removeClass(me.config.className.visible);
                    console.log(Math.random());
                }
            });
        },

        // 绑定提交事件
        _bindSubmitEvent: function() {
            var me = this;
            me.$form.on('submit', function() {
                // 保存查询记录
                var query = me._getInput().trim();
                if(me.config.isStorable && query.trim() && me.storageData.indexOf(query) == -1) {
                    me.storageData.push(query);
                    localStorage.setItem(me.config.storageKeyName, JSON.stringify(me.storageData));
                }
            });
        }, 

        // 向服务端请求数据
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

        // 处理服务端返回数据并渲染
        _processSuggests: function(query, data) {
            if(this._preprocess) {
                data = this._preprocess(data);
            }
            this._renderList(data);
            this.history[query] = data;
        },

        // 显示查询历史
        _renderStorageHistory: function() {
            var me = this;
            if(me.storageData.length > 0) {
                me._renderList(me.storageData);
                me.$suggest.find('.' + me.config.className.control).remove();
                me.$suggest.append(me.historyControlTemplate);
                me._parse();
            }
            else {
                me.$suggest && me.$suggest.removeClass(me.config.className.visible);
            }
        },

        /*
         * @method _renderList 渲染Suggest列表
         * @param {Array} data Suggest数据
         * */
        _renderList: function(data) {
            var me = this, 
                containerClass = me.config.className.container, 
                count = me.config.listCount, 
                html = '';

            /* 数据为空则隐藏list */
            if(data.length <= 0) {
                me.$suggest.removeClass(me.config.className.visible);
                return;
            }

            // 第一次调用，添加Suggest到Dom树中
            if(!me.$suggest) {
                // 添加suggest dom
                me.$form.append('<div class="' + containerClass + '"></div>');
                me.$suggest = me.$form.find('.' + containerClass);
                me._bindTouchEvent();
            }
            // 遍历data，读取suggest内容
            for(var i = 0, len = data.length; i < len && i < count; i++) {
                html += me._getSuggestHtml(data[i]);
            }

            html += me.controlTemplate;

            // 添加到Dom
            me.$suggest.html(html);
            me._parse();

            // 设置Suggest为可视
            me.$suggest.addClass(me.config.className.visible);
        },


        // 解析suggest html的data-role，添加对应class
        _parse: function() {
            $('[data-role=suggest]').addClass(this.config.className.suggest);
            $('[data-role=control]').addClass(this.config.className.control);
            $('[data-role=content]').addClass(this.config.className.content);
            $('[data-role=copy-control]').addClass(this.config.className.copyControl);
            if(this.config.showClose) {
                $('[data-role=close]').addClass(this.config.className.closeControl);
            }
            if(this.config.showClearHistory) {
                $('[data-role=clear-history]').addClass(this.config.className.historyClearControl);
            }
        },

        // 从localStorage获取查询历史
        _initStorageData: function() {
            var list = JSON.parse(localStorage.getItem(this.config.storageKeyName)) || [];
            this.storageData = list;
        },

        // 获得单条Suggest的html
        _getSuggestHtml: function(data) {
            var tpl = tmpl(this._getSuggestTempFun());
            var html = tpl({suggest: data});
            return html;
        },

        // 获得单条Suggest模板的方法
        _getSuggestTempFun: function() {
            return this.suggestTemplate;
        },

        // 获取查询字符串
        _getInput: function() {
            return this.element.val(); 
        }, 

        // 设置查询字符串
        _setInput: function(value) {
           this.element.val(value);        
        }, 

        // 提交表单
        _submit: function(query) {
            this.$form.submit();
        },

        // 检测是否缓存查询
        _inHistory: function(query) {
            return !!this.history[query];
        },

        // 获得缓存数据
        _getHistoryData: function(query) {
            return this.history[query]; 
        }
    });
})();







