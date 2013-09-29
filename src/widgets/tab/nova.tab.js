// TODO: 切换后设置高度

;(function($) {
    /*
     * Switcher类实例化时的初始化函数
     * @method init
     * @param {DOM} ele 组件对应的DOM元素
     * @param {JSON} config 组件配置
     *
     * */
    function init(ele, config) {
        this.index = config.index;  // 初始选项
        this.count = config.count;  // 选项个数
    }

    /*
     * Switcher类的原型属性和方法
     * */
    var prototype = {
        /* 默认配置 */
        _defaultConf: {
            index: -1,          // 初始选项
            count: 0,           // 选项个数
            recursive: false    // 是否可循环
        },

        /*
         * 切换到下一个
         * @method next
         * @return {Boolean} 是否切换成功 成功:true 失败: false
         * */
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

        /*
         * 切换到上一个
         * @method prev
         * @return {Boolean} 是否切换成功 成功:true 失败: false
         * */
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
        /*
         * 切换到指定项
         * @method switchTo
         * @param {Integer} to 切换到项的索引
         * @return {Boolean} 是否切换成功 成功:true 失败: false
         * */
        switchTo: function(to) {
            var from = this.index;
            if(from != to) {
                this.index = to;
                this.trigger('switch', [from, to]);
                return true;
            }
            return false;
        }
    };

    /*
     * 控制选项之间的切换
     * @class Switcher
     * @param {DOM} ele 组件对应的DOM元素
     * @param {JSON} config 组件配置
     * */
    var Switcher = nova.ui.define(init, prototype);
    window.Switcher = Switcher;

})($);

function constructor(ele, config) {
    var me = this, 
        $ele = $(ele);
        count = -1;

    // Zepto elements
    me.$content = $ele.find(config.selectors.content);
    me.$contItems = $ele.find(config.selectors.contentItem);
    me.$control = $ele.find(config.selectors.control);
    me.$controlItems = $ele.find(config.selectors.controlItem);

    count = me.$contItems.length;

    me.width = me.$contItems.width();
    // Switcher
    me.switcher = new Switcher(ele, {
        index: config.index, 
        count: count
    });

    // bind events
    me._bindEvents_controlTap();
    me._bindEvents_switch();
    me._bindEvents_swipe();

    // 选中第一项
    me.$content.css(me._getCssObj());
    me.$controlItems.eq(me.switcher.index).addClass(me.config.selectors.active_class);
}

var prototype = {
    _defaultConf: {
        openAnimate: true, 
        duration_ms: 200, 
        index: 0, 
        selectors: {
            content: '.tab-cont', 
            contentItem: '.cont-item', 
            control: '.tab-control', 
            controlItem: '.control-item',
            active_class: 'active'
        }
    },

    next: function() {
         this.switcher.next();
    },

    prev: function() {
        this.switcher.prev();
    },

    go: function(index) {
        this.switcher.switchTo(index);
    },

    _bindEvents_controlTap: function() {
        var me = this;
        me.$control.delegate(me.config.selectors.controlItem, 'tap', function(ev) {
            var index = me.$controlItems.indexOf(this);
            me.go(index);
        });
    },

    _bindEvents_switch: function() {
        var me = this;
        me.switcher.on('switch', function(ev, from, to) {
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
            activeClassname = me.config.selectors.active_class;

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
            offsetX = me.switcher.index * me.width;

        cssObj['-webkit-transform'] = 'translate3d(' + -offsetX + 'px, 0, 0)';
        return cssObj;
    }
}

var Tab = nova.ui.define(constructor, prototype);
window.Tab = Tab;
