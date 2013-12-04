/*
*
* Authored by: MelonHuang 
*
* Email: <melonh0327@gmail.com>
* Github: https://github.com/melonHuang 
*
* */

(function(define, global) {
    define('module/base/1.0.0/base', ['module/base/1.0.0/class'], function(Class) {
        // 推荐写法，使同时支持外链形式
        Class = Class || global.Class;

        var EVENT_SPLITTER = /\s+/;
        var CONFIG_EVENT_PATTERN = /^(onChange|before|after)([A-Z](.)*)/;
        var INSTANCE_EVENT_PATTERN = /^_(onChange|before|after)([A-Z](.)*)/;

        var ATTRIBUTE = global.ATTRIBUTE = {};
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
        var Base = Class.extend({
            // Base生命周期
            initialize: function(config) {
                config = config || {};
                this._parseEventsFromConfig(config);
                this._parseEventsFromInstance();
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

            // 解析prototype上得 _onChangeX, _beforeMethod, _afterMethod 
            _parseEventsFromInstance: function() {
                parseEvents(this, $.extend({}, this), INSTANCE_EVENT_PATTERN);
            },

            // 解析配置上的onChangeX, beforeMethod, afterMethod 
            _parseEventsFromConfig: function(config) {
                parseEvents(this, config, CONFIG_EVENT_PATTERN);
            },

            /***************************** Events ******************************/

            on: function(events, callback, context) {
                var cache, event;

                if(!callback) return this;
                
                cache = (this._events = this._events || {});
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
                var cache = this._events, event;

                // 全部为空，则清除全部handler
                if(!(events || callback)) {
                    delete this._events;
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
            trigger: function(events) {
                var cache = this._events, event, 
                    me = this;

                if(!cache) return me;

                events = events.split(EVENT_SPLITTER);
                while(event = events.shift()) {
                    var handlers = cache[event];
                    if(handlers) {
                        for(var len = handlers.length, i = len - 2; i >= 0; i -=2 ) {
                            var ctx = handlers[i + 1] || me;
                            var args = arguments[1] ? arguments[1].slice() : [];
                            args.unshift({type: event, target: me, timeStamp: (new Date()) - 0});
                            var ret = handlers[i].apply(ctx, args); 
                            if(ret == false) {me._preventDefault = true;}
                        }
                    }
                }
                return me;
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
                        var newValue = $.extend({}, prevVal.value);
                        var subAttr = getSubproperty(newValue, path.slice(1, -1));  
                        if(subAttr == ATTRIBUTE.INVALID_VALUE || !$.isPlainObject(subAttr)) {
                            setStatus = false;
                            return;
                        }
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
                    val =  getSubproperty(val, path.slice(1)) ;
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
                    proto = me.constructor.prototype,            
                    curProto = proto; 
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
                        me.set(name, val, null, true);
                    } 
                });
            }


        });

        /**************************** Events parser helpers *******************************/

        // 解析prototype和config中的onChangeAttr, beforeMethod, afterMethod等事件
        function parseEvents(widget, obj, pattern) {
            $.each(obj, function(name, fun) {
                var m = name.match(pattern);
                if(!m || !fun ||  $.type(fun) != 'function') return;
                if(m[1] == 'onChange') {
                    var attrName = firstLetterLc(m[2]);
                    widget.on('change:' + attrName, fun); 
                }
                else {
                    var when = m[1];        // before/after
                    var methodName = firstLetterLc(m[2]);

                    if($.type(widget[methodName] == 'function')) {
                        widget[when](methodName, fun);
                    }
                }
                delete obj[name];
            }); 
        }


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
            var me = this;
            var method = me[methodName];
            var ret;
            me[methodName] = function() {
                me._preventDefault = false;  
                // trigger时，如果回调函数返回false, 回将me._preventDefault置为true
                me.trigger('before:' + methodName);
                if(me._preventDefault) {return;}
                ret = method.apply(me, arguments);
                me.trigger('after:' + methodName);
                return ret;
            };
            me[methodName]._isAspected = true;
        }

        // 将字符串转为首字母大写
        function firstLetterUc(str) {
            return str.charAt(0).toUpperCase() + str.substring(1);
        }

        // 将字符串转为首字母小写
        function firstLetterLc(str) {
            return str.charAt(0).toLowerCase() + str.substring(1);
        }

        return Base;
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
            window.Base = factory();
        }
    },
    this
);
