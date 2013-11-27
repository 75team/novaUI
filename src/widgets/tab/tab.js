(function() {
    var prefix = nova.utils.prefix;

    var Tab = Switchable.extend({
        defaultConfig: {
            index: 0,
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
            me._bindEvents_resize();

            // 选中第一项
            me.$content.css(me._getCssObj());
            me.$content.css('height', me.$contItems.eq(me.index).height() + 'px');
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
                me.trigger('beforeSwitch');
                me._switchUI(from, to);
            });
        },

        _bindEvents_resize: function() {
            var me = this;
            $(window).on('resize', function() {
                me.width = me.$contItems.width();
                me.$content.css(me._getCssObj());
                me.$content.css('height', me.$contItems.eq(me.index).height() + 'px');
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
                me.$content.animate(me._getCssObj(), me.config.duration_ms, 'linear', function() {
                    me.$content.animate({'height': me.$contItems.eq(me.index).height() + 'px'}, 100);
                    me.trigger('afterSwitch', from, to);
                });
            }
            else {
                me.$content.css(me._getCssObj());
                me.trigger('afterSwitch', from, to);
            }
        },

        _getCssObj: function() {
            var me = this, 
                cssObj = {},
                offsetX = me.index * me.width;

            cssObj[prefix.css + 'transform'] = 'translate3d(' + -offsetX + 'px, 0, 0)';
            return cssObj;
        },

        _getXCssObj: function(offsetX) {
            var cssObj = {};
            cssObj[prefix.css + 'transform'] = 'translate3d(' + offsetX + 'px, 0, 0)';

            return cssObj
        }
    });

    if (typeof define === 'function' && define.amd) {
        define(['widget'], function(){
            return Tab;
        });
    } else {
        this.Tab = Tab;
    }

})();
