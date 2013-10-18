// Inspired by base2 and Prototype
(function(){
  var initializing = false, fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;
 
  // The base Class implementation (does nothing)
  this.Class = function(){};

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
      // Check if we're overwriting an existing function
      prototype[name] = typeof prop[name] == "function" &&
        typeof _super[name] == "function" && fnTest.test(prop[name]) ?
        (function(name, fn){
          return function() {
            var tmp = this._super;

            // Add a new ._super() method that is the same method
            // but on the super-class
            this._super = _super[name];

            // The method only need to be bound temporarily, so we
            // remove it when we're done executing
            var ret = fn.apply(this, arguments);        
            this._super = tmp;

            return ret;
          };
        })(name, prop[name]) :
        prop[name];
    }

    // The dummy class constructor
    function Class() {
      // All construction is actually done in the init method
      if ( !initializing && this.init )
        this.init.apply(this, arguments);
    }

    Class.superclass = _super;

    // Populate our constructed prototype object
    Class.prototype = prototype;

    // Enforce the constructor to be what we expect
    Class.prototype.constructor = Class;

    // And make this class extendable
    Class.extend = arguments.callee;

    return Class;
  };
})();

(function() {
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
                        return function() {
                            var tmp = me._host;

                            // Add _host method that is the same method
                            // but on the host widget
                            me._host = hostFn;

                            var ret = plugin[key].apply(me, arguments);

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
            plugin.setupPlugin.call(me);
        }
    });

})();


(function($) {

    this.Switchable = Widget.extend({
        /* 默认配置 */
        defaultConfig: {
            index: -1,          // 初始选项
            count: 0,           // 选项个数
            recursive: false    // 是否可循环
        },

        /* 初始化 */
        setup: function() {
            this.index = this.config.index;
            this.count = this.config.count;
        },

        /* 切换到下一个，成功返回true, 触发next事件 */
        next: function() {
            var from = this.index,
                to;
            // 可循环
            if(this.config.recursive) {
                to = (from + 1) % this.count;
                this.switchTo(to);
                this.trigger('next', [from, to]);
                return true;
            }
            // 不可循环，但未超出范围
            else if((to = from + 1) < this.count){
                this.switchTo(to);
                this.trigger('next', [from, to]);
                return true;
            }

            return false;
        },

        /* 切换到上一个，成功返回true, 触发prev事件 */
        prev: function() {
            var from = this.index,
                to;
            // 可循环
            if(this.config.recursive) {
                to = (from + this.count - 1) % this.count;
                this.switchTo(to);
                this.trigger('prev', [from, to]);
                return true;
            }
            // 不可循环，但未超出范围
            else if((to = from - 1) >= 0){
                this.switchTo(to);
                this.trigger('prev', [from, to]);
                return true;
            }

            return false;
        },

        /* 切换到to, 成功返回true, 触发switch事件 */
        switchTo: function(to) {
            var from = this.index;
            if(from != to) {
                this.index = to;
                this.trigger('switch', [from, to]);
                return true;
            }
            return false;
        }
    });
})($);

(function() {

    this.Tab = Switchable.extend({
        defaultConfig: {
            openAnimate: true,
            duration_ms: 200
        },

        selectors: {
            content: '.tab-cont',
            contentItem: '.cont-item',
            control: '.tab-control',
            controlItem: '.control-item',
            active_class: 'active'
        },

        setup: function() {
            this._super(arguments);

            var me = this,
                $ele = this.element;

            // Dom元素
            me.$content = $ele.find(me.selectors.content);
            me.$contItems = $ele.find(me.selectors.contentItem);
            me.$control = $ele.find(me.selectors.control);
            me.$controlItems = $ele.find(me.selectors.controlItem);

            // 设置tab数
            this.count = me.$contItems.length;

            // 设置宽度
            me.width = me.$contItems.width();

            // 绑定事件
            me._bindEvents_controlTap();
            me._bindEvents_switch();
            me._bindEvents_swipe();

            // 选中第一项
            me.$content.css(me._getCssObj());
            me.$controlItems.eq(me.index).addClass(me.selectors.active_class);

        },

        _bindEvents_controlTap: function() {
            var me = this;
            me.$control.delegate(me.selectors.controlItem, 'tap', function(ev) {
                var index = me.$controlItems.indexOf(this);
                me.switchTo(index);
            });
        },

        _bindEvents_switch: function() {
            var me = this;
            me.on('switch', function(ev, from, to) {
                me._switchUI(from, to);
            });
        },

        _bindEvents_swipe: function() {
            var me = this;
            me.$content.on('swipeLeft', function(ev) {
                me.next();
            });
            me.$content.on('swipeRight', function(ev) {
                me.prev();
            });
        },

        _switchUI: function(from, to) {
            var me = this;
                $fromControl = me.$controlItems.eq(from),
                $toControl = me.$controlItems.eq(to),
                $from = me.$contItems.eq(from),
                $to = me.$contItems.eq(to),
                activeClassname = me.selectors.active_class;

            // Change control appearance
            $fromControl.removeClass(activeClassname);
            $toControl.addClass(activeClassname);

            // Change content appearance
            if(me.config.openAnimate) {
                me.$content.animate(me._getCssObj(), me.config.duration_ms);
            }
            else {
                me.$content.css(me._getCssObj());
            }
        },

        _getCssObj: function() {
            var me = this, 
                cssObj = {},
                offsetX = me.index * me.width;

            cssObj['-webkit-transform'] = 'translate3d(' + -offsetX + 'px, 0, 0)';
            return cssObj;
        }
    });

})();
