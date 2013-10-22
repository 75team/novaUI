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
    this.nova = this.nova || {};
    this.nova.utils = this.nova.utils || {};

    this.nova.utils.prefix = (function () {
      var styles = window.getComputedStyle(document.documentElement, ''),
        pre = (Array.prototype.slice
          .call(styles)
          .join('') 
          .match(/-(moz|webkit|ms)-/) || (styles.OLink === '' && ['', 'o'])
        )[1],
        dom = ('WebKit|Moz|MS|O').match(new RegExp('(' + pre + ')', 'i'))[1];
      return {
        dom: dom,
        lowercase: pre,
        css: '-' + pre + '-',
        js: pre[0].toUpperCase() + pre.substr(1)
      };
    })();
})();

(function() {
    var prefix = nova.utils.prefix;

    this.Tab = Switchable.extend({
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

            me.plug($swipe);

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

})();

(function() {
    var SWIPE_DISTANCE_MAX = 35;

    this.$swipe = {
        defaultConfig: {
            enableSwipe: true
        },

        setupPlugin: function() {
            if(!this.config.enableSwipe) {
                return;
            }

            var me = this;
            var ele = this.$content;

            ele.on('touchstart', touchstartHandler);


            function touchstartHandler(ev) {
                var body = $(document.body);
                var touch = ev.touches[0];
                var startX = touch.pageX;
                var deltaX = 0;

                var startOffsetX = parseInt(ele.css('-webkit-transform').match(/-?\d+px/));

                body.on('touchmove', touchmoveHandler);
                body.on('touchend', touchendHandler);

                function touchmoveHandler(ev) {
                     var curTouch = ev.touches[0];
                     var curX = curTouch.pageX;

                     deltaX = curX - startX;

                     if(me.index == 0 || me.index == me.count - 1) {
                         ele.css(me._getXCssObj(startOffsetX + deltaX / 3));
                     } else {
                         ele.css(me._getXCssObj(startOffsetX + deltaX));
                     }
                }

                function touchendHandler(ev) {
                    if(Math.abs(deltaX) < SWIPE_DISTANCE_MAX || me.index == 0 && deltaX > 0|| me.index == me.count - 1 && deltaX < 0) {
                        // Rebound
                        var cssObj = me._getXCssObj(startOffsetX);
                        //cssObj['-webkit-transition-timing-function'] = 'ease';
                        ele.animate(cssObj, 200, 'ease');
                    }
                    else if(deltaX > 0) {
                        me.prev();
                    } else {
                        me.next();
                    }

                    body.off('touchmove', touchmoveHandler);
                    body.off('touchend', touchendHandler);
                }
            }
        }
    }
})();
