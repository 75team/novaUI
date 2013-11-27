(function() {
    var events = [];

    this.Widget = Class.extend({

        /* 默认配置 */
        defaultConfig: {
        },

        /* 初始化方法，确定组件创建时的基本流程 */
        init: function(ele, config) {
            // 组件实例的属性
            this.element = $(ele);

            // 组件配置写到this.config
            var defaultConf = {};
            var proto = this.constructor.prototype;
            while(proto) {
                defaultConf = $.extend(true, {}, proto.defaultConfig, defaultConf);
                proto = proto.constructor.superclass;
            }
            this.config = $.extend(true, {}, defaultConf, config);

            // 初始化组件
            this.setup();
        },


        /* 支持自定义事件 */
        on: function(event, handler) {
            this.element.on.apply(this.element, arguments);
            events.push(event);
            //this.element.on(event, $.proxy(handler, this));
            return this;
        },

        off: function(event, handler) {
            this.element.off.apply(this.element, arguments);
            //this.element.off(event, handler);
            return this;
        },

        trigger: function(ev, data) {
            this.element.trigger.apply(this.element, arguments);
            //this.root.trigger(ev, data);
            return this;
        },

        /* 提供给子类定义的方法 */
        // 子类初始化方法
        setup: function() {},

        // 将widget渲染到页面上
        render: function() {},

        // 销毁组件实例
        destroy: function() {},

        /* 支持Plugin */
        plug: function(plugin) {
            var me = this;
            var fnTest = /\b_host\b/;
            var hostFn;

            for(var key in plugin) {
                // If function
                if(typeof plugin[key] == "function" && typeof me[key] == "function" && fnTest.test(plugin[key]) && (hostFn = me[key])) {
                    me[key] = (function() {
                        var pluginFn = plugin[key];
                        return function() {
                            var tmp = me._host;

                            // Add _host method that is the same method
                            // but on the host widget
                            me._host = hostFn;

                            var ret = pluginFn.apply(me, arguments);

                            // unbound _host when we're done executing
                            me._host = tmp;

                            return ret
                        }
                    })();
                }
                else {
                    if(key === 'defaultConfig') {
                        me.config = $.extend({}, plugin[key], me.config);
                    }
                    else {
                        me[key] = plugin[key];
                    }
                }
            }
            plugin.setupPlugin && plugin.setupPlugin.call(me);
        }
    });

})();

