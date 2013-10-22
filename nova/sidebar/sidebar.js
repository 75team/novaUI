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

    this.Sidebar = Widget.extend({
        defaultConfig: {
            scrollMode: 'follow',
            animate: true,
            duration_ms: 200,
            display: 'push',
            position: 'left',
            dismissible: true,
            prefix: 'nova-',

            // Required
            contentWrap: '',
        },


        classNames: {
            sidebar: 'sidebar',
            content: 'content',
            sidebarLeft: 'left',
            sidebarRight: 'right',
            push: 'push',
            overlay: 'overlay',
            reveal: 'reveal',
            mask: 'mask'
        },

        setup: function() {
            var me = this,
                ele = me.element,
                config = me.config;


            // 添加前缀
            me._addClassPrefix();

            // 内容DOM
            me.content = $(config.contentWrap);
            me.mask = $('<div class="' + me.classNames.mask + '"></div>');

            // 为sidebar和content添加class
            me.element.addClass(me.classNames.sidebar);
            me.content.addClass(me.classNames.content);

            me.width = me.element.width();
            me.isOpen = false;
            me.duration = me.config.duration_ms;

            // 初始化class
            me._switchPosClass(me.config.position);
            me._switchD
            me.position = config.position;
            me.display = config.display;

            // 添加push, overlay, reveal等显示方法
            me._initDisplayFun();

            // 初始化位置
            me._initPos(me._getDisplaysPos(config.position)[config.display]);

            // 添加mask
            me.mask.width(me.element.parent().width() - me.width).appendTo(me.element.parent()).hide();

            me.mask.on('tap', function() {
                me.close();
            });

            $(window).on('resize', function() {
                me.mask.width(me.element.parent().width() - me.width);
            });
        },

        toggle: function(display, position) {
            var me = this;
            if(me.isOpen) {
                me.close();
            }
            else {
                me.open(display, position);
            }
        },

        // 打开
        open: function(display, position) {
            var me = this;

            if(me.isOpen) return;

            position = position || me.config.position;
            display = display || me.config.display;

            // position发生更改,切换class，和me.position标志表示当前position
            if(position != me.position) {
                me._switchPosClass(position);
                me.position = position;
            }

            // Display方式发生更改，切换class，和me.display标志表示当前display方式
            if(display != me.display) {
                me._switchDisplayClass(display);
                me.display = display;
            }

            // 标志打开状态
            me.isOpen = true;

            // 获得动画向量, 开始动画
            var displayPos = this._getDisplaysPos(me.position)[me.display];
            this._initPos(displayPos);
            this._animateOpen(displayPos);

            // 开启Dismissible
            this.mask.show();
        },

        // 关闭
        close: function() {
            if(!this.isOpen) return;

            this.isOpen = false;
            var displayPos = this._getDisplaysPos(this.position)[this.display];

            this._animateClose(displayPos);
            this.mask.hide();
        },

        // 定义了push, overlay, reveal 等方法
        _initDisplayFun: function() {
            var me = this;
            var displaysPos = me._getDisplaysPos(this.config.position);

            $.each(displaysPos, function(funName, display) {
                me[funName] = function(position) {
                    me.toggle(funName, position);
                }
            });
        },

        _addClassPrefix: function() {
            var me = this;
            var prefix = me.config.prefix;
            $.each(me.classNames, function(key, classname) {
                me.classNames[key] = prefix + classname;
            });
        },

        _switchPosClass: function(position) {
            var me = this;
            var className = {
                'left': me.classNames.sidebarLeft,
                'right': me.classNames.sidebarRight
            };

            me.element.addClass(className[position]);
            me.position && me.element.removeClass(className[me.position]);

            me.mask.addClass(className[position]);
            me.position && me.mask.removeClass(className[me.position]);
        },

        _switchDisplayClass: function(display) {
            var me = this;
            var className = {
                'push': me.classNames.push,
                'overlay': me.classNames.overlay,
                'reveal': me.classNames.reveal
            };

            me.element.addClass(className[display]);
            me.display && me.element.removeClass(className[me.display]);
            me.content.addClass(className[display]);
            me.display && me.content.removeClass(className[me.display]);
        },

        _initPos: function(displayPos) {
            this.element.css(prefix.css + 'transition', 'none');
            this.element.css(this._getXCssObj(displayPos['sidebar'][0]));
            this.content.css(this._getXCssObj(displayPos['cont'][0]));
        },

        _animateOpen: function(displayPos) {
            this.element.animate(this._getXCssObj(displayPos['sidebar'][1]), this.duration);
            this.content.animate(this._getXCssObj(displayPos['cont'][1]), this.duration);
        },

        _animateClose: function(displayPos) {
            this.element.animate(this._getXCssObj(displayPos['sidebar'][0]), this.duration);
            this.content.animate(this._getXCssObj(displayPos['cont'][0]), this.duration);
        },

        _getXCssObj: function(offsetX) {
            var cssObj = {};
            cssObj[prefix.css + 'transform'] = 'translate3d(' + offsetX + 'px, 0, 0)';

            return cssObj
        },

        _getDisplaysPos: function(position) {
            var me = this;
            var width = me.width;
            var dir = position == 'left' ? 1 : -1;

            return {
                push: {
                    sidebar: [-dir * width, 0],         // [from, to]
                    cont: [0, dir * width]
                },
                overlay: {
                    sidebar: [-dir * width, 0],
                    cont: [0, 0]
                },
                reveal: {
                    sidebar: [0, 0],
                    cont: [0, dir * width]
                }
            }
        }
    });
})()
