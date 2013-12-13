(function() {
    var prefix = (function () {
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

    var Sidebar = Widget.extend({
        attrs: {
            // 可配置项
            duration_ms: 200,       // 动画时长
            display: 'push',        // 显示方式，有push, overlay, reveal
            position: 'left',       // sidebar 位置，有left, right
            contentSelector: '',       // div main选择器
            
            classNames: {
                sidebar: 'sidebar',
                content: 'content',
                left: 'sidebar-left',
                right: 'sidebar-right',
                push: 'sidebar-push',
                overlay: 'sidebar-overlay',
                reveal: 'sidebar-reveal',
                mask: 'sidebar-mask'
            },

            // 内部属性
            status: 0,              // 0: off, 1: on
        },

        setup: function() {
            var ele = this.$element;
            var config = this.get();

            // 保存display, position初始值 
            this.defaultDisplay = this.get('display');
            this.defaultPosition = this.get('position');

            this.content = $(config.contentSelector).addClass(config.classNames.content);
            this.mask = $('<div></div>').addClass(config.classNames.mask).appendTo(ele.parent()).hide();
            this.delegateEvents(this.mask, 'tap', function() {
                this.hide();
            });
            this.delegateEvents(window, 'resize', function() {
                //alert(ele.parent().width() - ele.width());
                this.mask.width(ele.parent().width() - ele.width());
            });

            // 初始化class  
            ele.addClass(this.get('classNames.sidebar'));

            this._initDisplayFun();

            // 初始化位置
            var pos = this._getDisplayPos();

            // 初始化位置 
            ele.css(this._getXCssObj(pos['sidebar'][0]));
            this.content.css(this._getXCssObj(pos['cont'][0]));

            this.render();
        },

        /*
        * function toggle([display], [position])
        * @param {String} display 显示方式
        * @param {String} position 位置
        *
        * toggle()  传入为空时使用默认值
        * */
        toggle: function(display, position) {
            var curStatus = this.get('status');
            if(curStatus == 0) {
                display = display || this.defaultDisplay;
                position = position || this.defaultPosition;
                this.show(display, position);
            } else {
                this.hide();
            }
        },

        show: function(display, position) {
            this.set('display', display);
            this.set('position', position);
            this.set('status', 1);
        },

        hide: function() {
            this.set('status', 0);
        },

        // 定义了push, overlay, reveal 等方法
        _initDisplayFun: function() {
            var me = this;
            var displayMethods = ['push', 'overlay', 'reveal']; 

            $.each(displayMethods, function(index, method) {
                me[method] = function(position) {
                    me.toggle(method, position);
                }
            });
        },

        _onChangeStatus: function(ev, status) {
            if(status == 1) {
                this._show();
            } else {
                this._hide();
            }
        },

        _onRenderDisplay: function(ev, val, prev) {
            var ele = this.$element;
            var classNames = this.get('classNames');
            classNames[prev] && ele.removeClass(classNames[prev]);
            classNames[val] && ele.addClass(classNames[val]);
        },

        _onRenderPosition: function(ev, val, prev) {
            var ele = this.$element;
            var classNames = this.get('classNames');
            classNames[prev] && ele.removeClass(classNames[prev]) && this.mask.removeClass(classNames[prev]);
            classNames[val] && ele.addClass(classNames[val]) && this.mask.addClass(classNames[val]);
        },

        _show: function() {
            var ele = this.$element;
            var pos = this._getDisplayPos();
            var duration = this.get('duration_ms');

            // 初始化位置 
            ele.css(prefix.css + 'transition', 'none');
            this.content.css(prefix.css + 'transition', 'none');
            ele.css(this._getXCssObj(pos['sidebar'][0]));
            this.content.css(this._getXCssObj(pos['cont'][0]));
            
            // 开始动画
            ele.animate(this._getXCssObj(pos['sidebar'][1]), duration, 'ease');
            this.content.animate(this._getXCssObj(pos['cont'][1]), duration, 'ease');

            // 显示mask
            this.mask.width(ele.parent().width() - ele.width());
            this.mask.show();
        },

        _hide: function() {
            var ele = this.$element;
            var pos = this._getDisplayPos();
            var duration = this.get('duration_ms');
            
            // 开始动画
            ele.animate(this._getXCssObj(pos['sidebar'][0]), duration, 'ease');
            this.content.animate(this._getXCssObj(pos['cont'][0]), duration, 'ease');

            // 隐藏mask
            this.mask.hide();
        },

        _getDisplayPos: function() {
            var width = this.$element.width(); 
            var dir = this.get('position') == 'left' ? 1 : -1;
            var display = this.get('display');

            var pos = {
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
            };

            return pos[display];
        },
        _getXCssObj: function(offsetX) {
            var cssObj = {};
            cssObj[prefix.css + 'transform'] = 'translate3d(' + offsetX + 'px, 0, 0)';

            return cssObj
        },
        
    });

    this.Sidebar = Sidebar;
})();
