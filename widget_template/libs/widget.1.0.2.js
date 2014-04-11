/* Version 1.0.2 */

// Inspired by base2 and Prototype
(function() {
    var initializing = false;

    // The base Class implementation (does nothing)
    var Class = function(){};

    // Create a new Class that inherits from this class
    Class.extend = function(prop) {
        var _super = this.prototype;

        // Instantiate a base class (but only create the instance,
        // don't run the init constructor)
        initializing = true;
        var prototype = new this();
        initializing = false;

        // Copy the properties over onto the new prototype
        for (var name in prop) {
            prototype[name] = prop[name];
        }

        // The dummy class constructor
        function SubClass() {
            // All construction is actually done in the initialize method
            if ( !initializing && this.initialize )
                this.initialize.apply(this, arguments);
        }

        SubClass.superclass = _super;

        // Populate our constructed prototype object
        SubClass.prototype = prototype;

        // Enforce the constructor to be what we expect
        SubClass.prototype.constructor = SubClass;

        // And make this class extendable
        SubClass.extend = arguments.callee;

        return SubClass;
    };

    this.Class = Class;

})();


/*
*
* Authored by: MelonHuang 
*
* Email: <melonh0327@gmail.com>
* Github: https://github.com/melonHuang 
*
* */

(function() {
    var EVENT_SPLITTER = /\s+/;
    var CONFIG_EVENT_PATTERN = /^(onChange|before|after)([A-Z](.)*)/;
    var INSTANCE_EVENT_PATTERN = /^_(onChange|before|after)([A-Z](.)*)/;

    var ATTRIBUTE = this.ATTRIBUTE = {};
    ATTRIBUTE.INVALID_VALUE = {};
    ATTRIBUTE.SPECIAL_KEYS = ['value', 'getter', 'setter', 'mergeOnInit'];

    /*
    * Class Base
    *
    * 功能：Event, Attribute, Aspect
    * 
    * Event:    支持自定义事件的绑定，解除，触发
    * this.on(eventType, callback, context)
    * this.off(eventType, callback)
    * this.trigger(evenType)
    *
    * Attriute: 支持设置和获取属性，并提供setter/getter, change:attrName时间监听属性更改等
    * this.set(name, val, options)
    * this.get(name)
    *
    * Aspect:   支持事件切片，可在指定方法前后执行代码
    * this.before(methodName, callback, context)
    * this.after(methodName, callback, context)
    *
    * */

    var CustEvent = Class.extend({
        initialize: function(target, type, eventArgs) {
            $.extend(this, {
                target: target,                   
                type: type, 
                timeStamp: new Date() - 0,
            }, eventArgs);
        },

        _defaultPrevented: false, 

        // 阻止任何该事件的处理函数被调用
        preventDefault: function() {
            this._defaultPrevented = true;
        }
    });

    var Base = Class.extend({
        // Base生命周期
        initialize: function(config) {
            config = config || {};
            this._initAttrs(config);
        },
        destroy: function() {
            this.off();
            for(var p in this) {
                if(this.hasOwnProperty(p)) {
                    delete this[p];
                }
            }
            this.destroy = function() {};
        },

        /***************************** Events ******************************/

        on: function(events, callback, context) {
            var cache, event;

            if(!callback) return this;
            
            cache = (this.__events = this.__events || {});
            events = events.split(EVENT_SPLITTER);
            while(event = events.shift()) {
                 cache[event] = cache[event] || [];
                 cache[event].push(callback, context);
            }
            return this;
        },

        // this.off() 清除全部
        // this.off('switch') 清除全部switch事件的处理函数
        // this.off('switch', 'fun1'); 清除switch事件的fun1处理函数
        off: function(events, callback) {
            var cache = this.__events, event;

            // 全部为空，则清除全部handler
            if(!(events || callback)) {
                delete this.__events;
                return this;
            }
            events = events.split(EVENT_SPLITTER);
            while(event = events.shift()) {
                var handlers = cache[event];
                // 若callback为空，则去除所有event的handler
                if(!callback) {
                    delete cache[event];
                }
                // 否则遍历event的handler，去除指定callback
                else if(handlers){
                    for(var i = 0, len = handlers.length; i < len - 1; i += 2) {
                        if(handlers[i] == callback) {
                            handlers.splice(i, 2);
                        }    
                    }
                }
            }
            return this; 
        },

        // this.trigger('switch', [args1, args2]);
        // this.trigger('switch change', [args1, args2]);
        // @return true/false
        trigger: function(events) {
            var cache = this.__events, event, 
                me = this, 
                returnValue = true;

            if(!cache) return me;

            events = events.split(EVENT_SPLITTER);
            while(event = events.shift()) {
                var handlers = cache[event];
                var ev = new CustEvent(me, event);
                if(handlers) {
                    for(var i = 0, len = handlers.length; i < len; i += 2) {
                        var ctx = handlers[i + 1] || me;
                        var args = arguments[1] ? arguments[1].slice() : [];
                        args.unshift(ev);

                        var ret = handlers[i].apply(ctx, args); 

                        // 当callback返回false时，阻止事件继续触发
                        if(ret === false) {
                            ev.preventDefault();
                        }

                        if(ev._defaultPrevented) {
                            returnValue = false;
                            break;
                        }

                    }
                }
            }
            return returnValue;
        },

        /**************************** Aspect *******************************/

        before: function(methodName, callback, context) {
            weaver.call(this, 'before', methodName, callback, context);
            return this;
        },

        after: function(methodName, callback, context) {
            weaver.call(this, 'after', methodName, callback, context);
            return this;
        },

        /**************************** Attribute *******************************/

        /*
        * 设置属性值
        * @param {String}   name 属性名称
        * @param {*}        val  属性值
        * @param {Object}   options 选项 
        *        {Boolean}  options.silent  是否触发change:name事件
        *        {Boolean}  options.merge   合并or覆盖
        *        {Object}   options.data    传递给setter和onChangeHandler的额外数据
        *
        * @return {Boolean} 是否设置成功
        *
        * 设置失败场景：
        * 1. 属性名不存在
        * 2. 属性的setter返回ATTRIBUTE.INVALID_VALUE
        *
        * 支持写法：       
        * 1. this.set('name', 'guagua')        
        * 2. this.set({ name: 'guagua' })      支持传入对象
        * 3. this.set('group.leader', 'mike')  支持设置子属性
        *
        * */
        set: function(name, val, options) {
            var me = this;
            var attrs = {}; 
            var now = this.attrs;
            var setStatus = true;    // true代表成功,false代表失败

            if(typeof(name) == 'string') {
                attrs[name] = val;
            }
            else {
                attrs = name;
                options = val;
            }

            options = options || {};

            $.each(attrs, function(name, val) {
                var path = name.split('.');
                var attrName = path[0];
                var isSubAttr = path.length > 1;
                var prevVal = now[attrName];

                // 若没有该属性，set返回false
                if(!prevVal) {
                    setStatus = false;
                    return;
                }

                // 设置子属性，如set('a.b.c') 
                if(isSubAttr) {
                    // 获得a.b，如果a.b为undefined，或者不是plain object。则set失败
                    var subAttr = getProperty(prevVal.value, path.slice(1, -1).join('.'));
                    if(subAttr == undefined || !$.isPlainObject(subAttr)) {
                        setStatus = false;
                        return;
                    }

                    var newValue = $.extend({}, prevVal.value);
                    subAttr = getProperty(newValue, path.slice(1, -1).join('.'));
                    subAttr[path[path.length - 1]] = val;
                    val = newValue;
                }


                // 若有定义setter，调用setter
                if(prevVal.setter) {
                    val = prevVal.setter.call(me, val, name, options.data);
                    // setter中检测val无效，则返回false
                    if(val == ATTRIBUTE.INVALID_VALUE) {
                        setStatus = false;
                        return;
                    }
                }

                if(options.merge) {
                    val = ($.extend(true, {}, prevVal, {value: val})).value;
                }

                prevVal = prevVal.value;
                now[attrName].value = val;
                if(!options.silent) {
                    me.trigger('change:' + attrName, [me.get(attrName), prevVal, name, options.data]); 
                    me.trigger('change:*', [me.get(attrName), prevVal, name, options.data]); 
                }
            });

            return setStatus;
        },

        /*
        * 获取属性值
        * @param {String}   name 属性名称
        *
        * @return {*} 通过getter获得的属性值
        *
        * 属性不存在时，返回undefined
        *
        * 支持写法：       
        * 1. this.get()                 获取全部属性
        * 2. this.get('name')           获取名为name的属性    
        * 3. this.get('group.leader')   获取子属性
        *
        * */
        get: function(name) {
            var me = this;
            // name为空，则返回全部属性
            if(!name) {
                var attrs = {};
                $.each(me.attrs, function(name, attr) {
                    attrs[name] = me.get(name);
                });
                return attrs;
            }
            else {
                var path = name.split('.');

                if(!me.attrs.hasOwnProperty(path[0])) return;

                var attr = me.attrs[path[0]];
                var val = attr.value;
                if(attr.getter) {
                    val = attr.getter.call(me, val, name);
                }

                // 根据path返回
                val = getProperty(val, path.slice(1).join('.'));
                return val == ATTRIBUTE.INVALID_VALUE ? undefined : val;
            }
        },

        _initAttrs: function(config) {

            /* 继承attr */

            var me = this;
            var curAttrs = {};
            var attrs; 

            // 获取原型链 
            var protochain = [],                            
                proto = me.constructor.prototype;            
            while(proto && !$.isEmptyObject(proto)) {
                protochain.push(proto);
                proto = proto.constructor.superclass;
            }

            // 继承原型链上的attrs
            while(proto = protochain.pop()) {
                attrs = normalizeAttr(proto.attrs || {});
                $.each(attrs, function(name, attr) {
                    if(attr.mergeOnInit) {
                        curAttrs[name] = $.extend(true, {}, curAttrs[name], attr);
                    } 
                    else {
                        curAttrs[name] = attr;
                    }
                }); 
            }

            // 合并config
            config = config || {}
            curAttrs = $.extend(true, {}, curAttrs, normalizeAttr(config));
            me.attrs = curAttrs;

            // 调用setter初始化value
            $.each(config, function(name, val) {
                if(curAttrs[name].setter) {
                    me.set(name, val, {silent: true});
                } 
            });
        }


    });


    /**************************** Attribute Helpers *******************************/

    // 将{ 'name': 'guagua' }转为 {'name': {value: 'guagua'}}
    function normalizeAttr(attrs) {
        var newAttrs = {};
        $.each(attrs, function(name, val) {
            // 若以name: 1方式定义，则需转换为name: {value: 1}
            if(!$.isPlainObject(val) || !hasOwnProperties(val, ATTRIBUTE.SPECIAL_KEYS)) {
                val = {value: val};
            }
            newAttrs[name] = val;
        });
        return newAttrs;
    }

    // 检测obj是否含有properties中得属性，若存在一个，则返回true
    function hasOwnProperties(obj, properties) {
        var result = false;
        $.each(properties, function(index, val) {
            if(obj.hasOwnProperty(val)) result = true;
        });
        return result;
    }

    // 获得子属性
    // eg. getSubproperty(obj, [a, b, c])会返回obj.a.b.c
    // 若obj.a.b.c不存在，则返回ATTRIBUTE.INVALID_VALUE
    function getSubproperty(obj, path) {
        var subAttr = obj;
        var i, len;
        for(i = 0, len = path.length; i < len - 1 && $.isPlainObject(subAttr); i++) {
            subAttr = subAttr[path[i]];
        }
        if(len == 0) {
            return obj;
        } else if(i == len - 1 && $.isPlainObject(subAttr) && subAttr.hasOwnProperty(path[len - 1])) {
            return subAttr[path[len - 1]];
        } else {
            return ATTRIBUTE.INVALID_VALUE;
        }
    }

    // eg. getProperty(obj, 'a.b.c')会返回obj.a.b.c
    function getProperty(obj, prop) {
        var keys = prop ? prop.split(".") : [];
        var ret = obj;

        for(var i = 0, len = keys.length; i < len; i++) {
            if(ret == undefined) {
                return;
            }
            ret = ret[keys[i]];
        }

        return ret;
    }


    /***************************** Apspect helpers ******************************/

    // 将callback绑定到methodName执行的前/后时触发
    function weaver(when, methodName, callback, context) {
        var names = methodName.split(EVENT_SPLITTER);      
        var name, method;
        while(name = names.shift()) {
            method = this[name];
            if(!method || !$.isFunction(method)) {break;}
            if(!method._isAspected) {
                wrap.call(this, name);
            }
            this.on(when + ':' + name, callback, context);
        }
    }

    function wrap(methodName) {
        var method = this[methodName];
        var ret, beforeFunRet;
        var me = this;
        this[methodName] = function() {
            beforeFunRet = this.trigger('before:' + methodName, Array.prototype.slice.call(arguments));
            if(beforeFunRet === false) { return; }
            ret = method.apply(this, arguments);
            this.trigger('after:' + methodName, Array.prototype.slice.call(arguments));
            return ret;
        };
        this[methodName]._isAspected = true;
    }

    // 将字符串转为首字母小写
    function firstLetterLc(str) {
        return str.charAt(0).toLowerCase() + str.substring(1);
    }

    this.Base = Base;
})();

/*
*
* Authored by: MelonHuang 
*
* Email: <melonh0327@gmail.com>
* Github: https://github.com/melonHuang 
*
* */
(function() {

    var cachedWidgets = {};
    var DATA_WIDGET_ID = 'data-widget-id';
    var ON_RENDER_PATTERN = /^_onRender([A-Z](.)*)/;
    var EVENT_NS = '.widget-';
    var ATTR_IN_CONFIG = /{\$(.*)}/;

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

            // 渲染模式使用
            template: '<div></div>',        // 根据template生成this.element
            parentNode: 'body'              // render时，将this.element插入到parentNode中
        },

        // 事件代理
        events: null,

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

            // 将events放到this上，不作为Attribue
            this.events = $.extend(this.events || {}, config.events);
            delete config.events;

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
                events = me.events;
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
        return a.contains ? a != b && a.contains(b) : !!(a.compareDocumentPosition(b) & 16);
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
        event.selector = m[2].replace(ATTR_IN_CONFIG, function() { return widget.get(arguments[1])});
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

    this.Widget = Widget;
})();

