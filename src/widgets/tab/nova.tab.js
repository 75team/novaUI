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
