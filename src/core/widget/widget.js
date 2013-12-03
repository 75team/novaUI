/*
*
* Authored by: MelonHuang 
*
* Email: <melonh0327@gmail.com>
* Github: https://github.com/melonHuang 
*
* */
(function(define, global) {
    define('module/widget/1.0.0/widget', ['module/base/1.0.0/base'], function(Base) {
        Base = Base || global.Base;

        var cachedWidgets = {};
        var DATA_WIDGET_ID = 'data-widget-id';
        var ON_RENDER_PATTERN = /^_onRender([A-Z](.)*)/;
        var EVENT_NS = '.widget-';
        var ATTR_IN_EVENTS = /{{(.*)}}/;

        /*
        * Class Widget
        * 
        * Extend: Base
        * 继承自Base的功能：Event, Attribute, Aspect
        * 
        * Widget干的事儿：
        *
        * 1. 约定组件生命周期:
        * initialize: 各种初始化 + 调用组件自定义的setup
        * render: 将element渲染并添加到DOM中
        * destroy: 解除所有事件, 删除引用, 将由模板生成的element从DOM中删除
        *
        *
        * 2. 提供事件代理
        * this.delegateEvents([element], 'click .control', callback) 
        * this.undelegateEvents([element], 'click .control');
        *
        * 为什么使用delegateEvents而不是this.$element.delegate：
        *   1. callback的context为组件实例
        *   2. 支持在attrs中传入事件代理
        * 
        *
        * 3. 支持data api
        * Widget支持从DOM element的data属性中读取配置
        *
        * <div class="tab" data-api="on" data-swipable="true" data-index="2">...</div>
        * var tab = new Tab({element: '.tab'});
        * 等价于
        * <div class="tab">...</div>
        * var tab = new Tab({element: '.tab', swipable: true, index: 2});
        *
        * 
        * 4. 缓存组件实例
        * 可通过Widget.query(selector)获得组件实例
        *
        * 5. 结合Attribute提供onRenderAttr
        * onRenderAttr与onChangeAttr唯一的不同是，onRenderAttr在初始化时也会触发
        *
        *
        * 未来打算支持的功能：
        * 1. 结合Handlerbars模板引擎
        * 2. 提供autoRender功能
        *
        * */
        var Widget = Base.extend({

            element: null,          // Dom element 
            $element: null,         // JQuery or Zepto包装的Dom element

            attrs: {
                // Dom element的id，className, style
                id: null, 
                className: null, 
                style: null,

                // 事件代理
                events: null,

                // 渲染模式使用
                template: '<div></div>',        // 根据template生成this.element
                parentNode: 'body'              // render时，将this.element插入到parentNode中
            },
            initialize: function(config) {
                config = this._parseConfig(config);

                Widget.superclass.initialize.call(this, config);

                // 初始化element
                this._parseElement();
                
                // 生成wid, 保存widget实例
                this._stamp();

                // 初始化events
                this.delegateEvents();

                // 调用子类初始化方法
                this.setup();
            },

            _parseConfig: function(config) {
                config = config || {};

                // 将element放到this上，不作为Attribute
                this.element = config.element;
                delete config.element;

                // 解析获得this.element上的data api
                var dataApi = parseDataApi(this.element);
                config = $.extend({}, dataApi, config);

                return config;
            },

            _parseElement: function() {
                if(!this.element) {
                    this._isTemplate = true;
                }
                this.$element = this.element ? $(this.element) : $(this.get('template'));
                this.element = this.$element[0];
            },

            _stamp: function() {
                var wid = this.wid = generateWid();
                cachedWidgets[wid] = this;
                this.$element.attr(DATA_WIDGET_ID, wid);
            },

            /*************************** 组件生命周期 ********************************/

            // 供子类重载的初始化方法
            setup: function() {},

            /*
            * 1. 渲染thie.element, 调用prototype上定义的_onRenderAttr
            * 2. 若this.element是由模板生成, 则将其添加到parentNode中
            * 如果希望组件初始化时渲染，可在setup中调用render
            * */
            render: function() {
                // 初次render时调用onRender
                if(!this.rendered) {
                    this._renderAndBindAttrs();
                    this.rendered = true;
                }

                // 若element不在DOM中，插入到parentNode
                var parentNode = this.get('parentNode');
                if(parentNode && !contains(document.documentElement, this.element)) {
                    this.$element.appendTo(parentNode);
                }

                return this;
                
            },

            /*
            * 注销事件，清除缓存，将模板生成的element从DOM中删除
            * */
            destroy: function() {
                // 注销事件代理
                this.undelegateEvents();

                // 清除组件缓存
                delete cachedWidgets[this.cid];

                // 如果是通过模板生成element, 则从DOM中删除 
                if(this.$element && this._isTemplate) {
                    this.$element.off();
                    this.$element.remove();
                }

                this.element = null;
                Widget.superclass.destroy.call(this);
            },

            _renderAndBindAttrs: function() {
                var me = this;
                $.each(me, function(name, fun) {
                    var match = name.match(ON_RENDER_PATTERN);
                    if(!match) return;

                    // 将onRenderAttr方法绑定到change:attr事件上
                    var attrName = firstLetterLc(match[1]); 
                    me.on('change:' + attrName, fun); 

                    // 若attr有合法初始值(非null, undefined), 则触发onRenderAttr
                    var val = me.get(attrName);
                    if(!isEmptyAttrValue(val)) {
                        me.trigger('change:' + attrName, [val, undefined, attrName]); 
                    }
                });
            },

            _onRenderId: function(ev, val) {
                this.$element.attr('id', val);
            },

            _onRenderClassName: function(ev, val, prev) {
                prev && this.$element.removeClass(prev);
                this.$element.addClass(val);
            },

            _onRenderStyle: function(ev, val, prev) {
                this.$element.css(val);
            },


            /*************************** 事件代理 ********************************/
            
            /*
            * 代理事件, callback中的context将指向组件实例
            * @param {DOM/$(DOM)/Selector} element optional 事件代理到的Dom element
            * @param {String} events    事件类型和selector, 如'click .btn'
            * @param {Function/String} handler 处理函数
            *
            * 支持写法：
            * this.delegateEvents(ele, 'click .btn', 'clickHandler')                 当传入字符串时，处理函数为this.clickHandler
            * this.delegateEvents('click .btn', handler)                             当未传入element时，将代理到this.$element上
            * this.delegateEvents({ 'click .btn': handler, 'tap .btn': handler });   支持传入对象，将绑定到this.$element上
            *
            * */
            delegateEvents: function(element, events, handler) {
                var me = this;

                // 参数为空，绑定this.get('events')
                if(arguments.length == 0) {
                    events = me.get('events');
                    element = me.element;
                } 
                // 写法delegateEvents({'click .btn': handler})
                else if(arguments.length == 1) {
                    events = element;
                    element = me.element;
                }
                // 写法delegateEvents('click .btn', handler);
                // 写法delegateEvents(element, {'click .btn': handler}); 
                else if(arguments.length == 2) {
                    if(!$.isPlainObject(events)) {
                        var obj = {};
                        obj[element] = events;
                        events = obj;
                        element = me.element;
                    }
                }
                // 写法delegateEvents(element, 'click .btn', handler);
                else if(arguments.length == 3) {
                    var obj = {};
                    obj[events] = handler;
                    events = obj;
                }

                if(element != this.element) {
                    if(!this.delegateElements) this.delegateElements = [];
                    this.delegateElements.push($(element));
                }
                element = $(element);

                events && $.each(events, function(eventKey, handler) {
                    var event = parseEventKey(me, eventKey);
                    var callback;
                    if($.type(handler) == 'string') {
                        callback = function(ev) {
                            me[handler](ev);
                        }
                    } else if($.type(handler) == 'function') {
                        callback = function(ev) {
                            handler.call(me, ev);
                        }
                    }
                    element.on(event.type, event.selector, callback);
                })

                return this;
            },

            /*
            * 解除事件代理
            * @param {DOM/$(DOM)/Selector} element 解除绑定的Dom element
            * @param {String} eventKey  事件类型和Selector, 如'click .btn'
            *
            * 支持写法：
            * this.undelegateEvents(element, eventKey)      解除element上关于eventKey的代理函数
            * this.undelegateEvents(eventKey)               element为空时，解除this.element上关于eventKey的代理函数
            * this.undelegateEvents()                       eventKey为空时，解除所有事件代理 
            *
            * */
            undelegateEvents: function(element, eventKey) {
                // 写法undelegateEvents() 
                if(arguments.length == 0) {
                    var wid = this.wid;
                    this.$element.off(EVENT_NS + wid);
                    this.delegateElements && $.each(this.delegateElements, function(index, element) {
                        element.off(EVENT_NS + wid);
                    });
                }
                // 写法undelegateEvents('click .btn')
                // 写法undelegateEvents(element)
                // 写法undelegateEvents(element, 'click .btn')
                else {
                    if(arguments.length == 1) {
                        if(!contains(document.documentElement, $(element)[0])) {
                            eventKey = element;
                            element = this.element;
                        }
                    }

                    element = $(element);
                    var event = eventKey && parseEventKey(this, eventKey);
                    if(event) {
                        element.off(event.type, event.selector);
                    }
                    else {
                        element.off(EVENT_NS + this.wid);
                    }
                }
                return this;
            }
        });

        // 根据selector获取widget实例
        Widget.query = function(selector) {
            var wid = parseInt($(selector).attr(DATA_WIDGET_ID));
            return cachedWidgets[wid];
        }

        /***************************** Widget Helpers ******************************/

        var widCounter = 0;
        // 生成widget id
        function generateWid() {
            return widCounter++;
        }

        // 检测element b是否在element a文档流中
        function contains(a, b) {
            return !!(a.compareDocumentPosition(b) & 16);
        }

        // 首字母大写
        function firstLetterUc(str) {
            return str.charAt(0).toUpperCase() + str.substring(1);
        }

        // 首字母小写
        function firstLetterLc(str) {
            return str.charAt(0).toLowerCase() + str.substring(1);
        }

        // 是否为有效属性值
        function isEmptyAttrValue(val) {
            return val == undefined || val == null;
        }

        // 解析_onRenderAttr
        function parseEventKey(widget, eventKey) {
            var event = {};
            var m = eventKey.match(/^(\S+)\s*(.*)$/);
            event.type = m[1] + EVENT_NS + widget.wid;
            event.selector = m[2].replace(ATTR_IN_EVENTS, function() { return widget.get(arguments[1])});
            return event;
        }

        /*************************** Data-api parser Helpers ********************************/

        var RE_DASH_WORD = /-([a-z])/g;
        var JSON_LITERAL_PATTERN = /^\s*[\[{].*[\]}]\s*$/;
        // 解析element中得data属性
        function parseDataApi(element) {
            var api = {};
            var element = $(element);
            if(!element[0] || element.data('api') != 'on') {return;}
            // 若开启了data-api, 则将解析element上的data-attrname, 转为驼峰命名
            // zepto不支持element.data()获取全部data-attr
            var dataset = element[0].dataset || element.data(); 
            for(var attrName in dataset) {
                // 通过data()获得可自动转换string为boolean, number类型
                var val = element.data(attrName);       
                attrName = toCamelCase(attrName); 
                api[attrName] = normalizeDataValue(val);
            }

            return api;
        }

        // 将dash命名的字符串转为驼峰命名
        function toCamelCase(str) {
            var reg = RE_DASH_WORD;
            str = str.replace(reg, function() {
                return (arguments[1]).toUpperCase();
            });
            return str;
        }

        // 将字符串转为Object/array
        function normalizeDataValue(val) {
            if(JSON_LITERAL_PATTERN.test(val)) {
                val = val.replace(/'/g, '"');
                val = JSON.parse(val);
            }
            return val;
        }


        return Widget;
    });

}) (
    typeof define === 'function' && define.amd ? define : function (name, requires, factory) { 
        if(typeof name === 'function') {
            factory = name;
        } else if(typeof requires === 'function') {
            factory = requires;
        }

        if(typeof module != 'undefined'){
            module.exports = factory(require); 
        }else if(typeof window != 'undefined'){
            window.Widget = factory();
        }
    },
    this
);
