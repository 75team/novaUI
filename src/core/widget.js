(function() {
    this.Widget = Class.extend({

        /* 默认配置 */
        defaultConfig: {
        },

        /* 初始化方法，确定组件创建时的基本流程 */
        init: function(ele, config) {
            this._super(ele, config);

            // 组件实例的属性
            this.element = $(ele);
            this.config = this.config || {};
            $.extend(this.config, this.defaultConfig, config);
            //this.config = $.extend(true, this.defaultConf, config);

            // 初始化组件
            this.setup();
        },


        /* 支持自定义事件 */
        on: function(event, handler) {
            this.element.on.call(this.element, arguments);
            //this.element.on(event, $.proxy(handler, this));
            return this;
        },

        off: function(event, handler) {
            this.element.off.call(this.element, arguments);
            //this.element.off(event, handler);
            return this;
        },

        trigger: function(ev, data) {
            this.element.trigger.call(this.element, arguments);
            //this.root.trigger(ev, data);
            return this;
        },

        /* 提供给子类定义的方法 */
        // 子类初始化方法
        setup: function() {},

        // 将widget渲染到页面上
        render: function() {},

        // 销毁组件实例
        destroy: function() {
        }
    });
})();

