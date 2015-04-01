(function() {
    var Switchable = Widget.extend({
        /* 默认配置 */
        attrs: {
            index: -1,          // 初始选项
            count: 0,           // 选项个数
            recursive: false    // 是否可循环
        },

        /* 初始化 */
        setup: function() {
        },

        /* 切换到下一个，成功返回true, 触发next事件 */
        next: function() {
            var index = this.get('index');
            var next= this.getNextIndex();
            if(next != -1) {
                this.switch(next);
                return true;
            }
            return false;
        },

        /* 切换到上一个，成功返回true, 触发prev事件 */
        prev: function() {
            var index = this.get('index');
            var prev = this.getPrevIndex();
            if( prev != -1) {
                this.switch(prev);
                return true;
            }
            return false;
        },

        getNextIndex: function() {
            var from = this.get('index'),
                to = -1, 
                count = this.get('count');
            if(this.get('recursive')) {
                to = (from + 1) % count;
            }
            // 不可循环，但未超出范围
            else if((from + 1) < count){
                to = from + 1;
            }

            return to;
        },

        getPrevIndex: function() {
            var from = this.get('index'),
                to = -1, 
                count = this.get('count');
            if(this.get('recursive')) {
                to = (from + count - 1) % count;
            }
            // 不可循环，但未超出范围
            else if((from - 1) >= 0){
                to = from - 1;
            }

            return to;

        },

        /* 切换到to, 成功返回true, 触发switch事件 */
        switch: function(to) {
            var from = this.get('index');
            if(from != to) {
                this.set('index', to)
                //this.trigger('switch', [from, to]);
                return true;
            }
            return false;
        },
    });    

    this.Switchable = Switchable;
})(); 

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

    var SWIPE_DISTANCE_MIN = 25,
        RECUR_DURATION = 200,
        TRANSFORM_PROPERTY_NAME = prefix['css'] + 'transform';
  


    /***************************** Class Carousel ******************************/

    var Carousel = Switchable.extend({
        attrs: {
            // 可配置项
            index: 0,                   // 初始选中项
            recursive: true,           // 是否可循环
            duration_ms: 200,           // 切换时长
            autoplay: false,            // 自动轮播
            autoplay_interval_ms: 10000,   // 自动轮播间隔
            swipable: true,             // 是否可滑动

            selectors: {
                content: '.carousel-cont',
                contItem: '.cont-item',
                control: '.carousel-control',
                controlItem: '.control-item',
                active: '.active'
            },

            events: {
                'tap {$selectors.controlItem}': '_controlTapHandler'
            },

            // 内部使用属性
            eles: {
                left: null,
                middle: null,
                right: null,
                control: null
            }
        },


        setup: function () {
            Carousel.superclass.setup && Carousel.superclass.setup.apply(this, arguments);

            var me = this;
            var selectors = me.get('selectors');
            
            // 初始化DOM
            me.contItems = me.$element.find(selectors.content + ' ' + selectors.contItem);
            me.controlItems = me.$element.find(selectors.control + ' ' + selectors.controlItem);
            me.width = me.contItems.width();

            // 设置index, count
            me.set('count', me.contItems.length);                

            // 选中第一个
            this.set('index', this.get('index'));

            this.get('swipable') && this._initSwipe(me.contItems.parent());

            this._bindResizeHandler();

            this.render();
        },

        _initSwipe: function(element) {
            var me = this;
            var body = $(document.body)
            var curTouch, startX, startY, deltaX, deltaY, dir;

            element.on('touchstart', function(ev) {
                curTouch = ev.touches[0];
                startX = curTouch.pageX;
                startY = curTouch.pageY;
                deltaX = 0;
                deltaY = 0;
                dir = undefined;

                body.on('touchmove', touchmoveHandler) 
                body.on('touchend', touchendHandler);

                me.trigger('swipestart');
            });

            function touchmoveHandler(ev) {
                var touch = ev.touches[0];
                deltaX = touch.pageX - startX;
                deltaY = touch.pageY - startY;

                // 1: 垂直方向 -1: 水平方向
                if(dir == undefined) {
                    dir = Math.abs(deltaY) > Math.abs(deltaX) ? 1 : -1;
                }

                // 垂直
                if(dir == 1) {
                    return;
                }

                ev.preventDefault();
                me.trigger('swipemove', [deltaX]);
            }

            function touchendHandler(ev) {
                if(dir == 1) { return; }
                me.trigger('swipeend', [deltaX]);
                body.off('touchmove', touchmoveHandler); 
                body.off('touchend', touchendHandler);
            }

            this.on('swipestart', function() {
                this.set('autoplay', false);
            })

            this.on('swipemove', function(ev, offset) {
                if(this.sliding) {return;}
                var prev = offset > 0 ? this.get('eles.right') : this.get('eles.left');
                var next = offset > 0 ? this.get('eles.left') : this.get('eles.right');
                var prevOffset = offset > 0 ? this.width: -this.width;
                var nextOffset = offset > 0 ? -this.width: this.width;

                if(!next[0] && offset != 0) {
                    offset /= 3; 
                }

                next.css(this._getOffsetXCss(offset + nextOffset));
                prev.css(this._getOffsetXCss(prevOffset));
                this.get('eles.middle').css(this._getOffsetXCss(offset));
            });
            this.on('swipeend', function(ev, offset) {
                if(this.sliding) {return;}
                var goback = false;
                if(Math.abs(offset) > SWIPE_DISTANCE_MIN) {
                    goback = !(offset > 0 ? this.prev() : this.next());                     
                } else {
                    goback = true;
                }
                if(goback) {
                    var next = offset > 0 ? this.get('eles.left') : this.get('eles.right');
                    var nextOffset = offset > 0 ? -this.width: this.width;
                    me.get('eles.middle').animate(me._getOffsetXCss(0), RECUR_DURATION, 'ease');
                    next.animate(me._getOffsetXCss(nextOffset), RECUR_DURATION, 'ease');
                }
                this.set('autoplay', true);
            });
        },

        _bindResizeHandler: function() {
            this.delegateEvents(window, 'resize', function() {
                this.width = this.contItems.parent().width();
                this._placeTo(this.get('eles.left'), -this.width);
                this._placeTo(this.get('eles.right'), this.width);
            });
        },

        _controlTapHandler: function(ev) {
            if(this.sliding) {return;}
            
            var index = this.get('index');
            var to = this.controlItems.indexOf(ev.currentTarget);

            if(to != index) {
                this.dir = to > index ? 1 : -1;
            }

            this.switch(to);

        },

        _beforePrev: function() {
            this.dir = -1;
        },

        _beforeNext: function() {
            this.dir = 1;
        },

        _onChangeIndex: function(ev, cur, prev) {
            this.trigger('beforeSwitch', [cur, prev]);
            var prevIndex = this.getPrevIndex();
            var nextIndex = this.getNextIndex();
            this.set('eles', {
                left: prevIndex != -1 ? this.contItems.eq(prevIndex) : $(),
                middle: this.contItems.eq(cur),
                right: nextIndex != -1 ? this.contItems.eq(nextIndex): $(),
                control: this.controlItems.eq(cur)
            }); 
            this.trigger('afterSwitch', [cur, prev]);
        },

        _onChangeEles: function(ev, curEles, prevEles) {
            var width = this.width;
            var duration = this.get('duration_ms');
            var activeClass = this.get('selectors.active').slice(1);
            var me = this;

            // dir = 1: 从右往左，  dir = -1: 从左往右
            var next = this.dir == 1 ? prevEles.right : prevEles.left;
            if(next && next[0] != curEles.middle[0]) {
                this._placeTo(curEles.middle, this.dir * width);
            }

            // 开始滑动
            this.sliding = true;

            // 触发reflow, 清除原来的transition遗留
            prevEles.middle && prevEles.middle.size() && prevEles.middle[0].clientLeft; 
            curEles.middle && curEles.middle.size() && curEles.middle[0].clientLeft; 
            this._slideTo(prevEles.middle, -this.dir * width, duration);
            this._slideTo(curEles.middle, 0, duration, animateCallback);

            function animateCallback() {

                // 将prevEles中，不在curEles的element去掉active
                $.each(prevEles, function(name, ele) {
                    ele && ele.removeClass(activeClass);
                });

                // 为curEles, 加上active
                $.each(curEles, function(name, ele) {
                    ele && ele.addClass(activeClass).css(prefix['css'] + 'transition-duration', '0');
                });

                // 设置好curEles的left, middle, right位置
                me._getElesPosReady(curEles);

                me.sliding = false;
            }
        },

        _onRenderAutoplay: function(ev, autoplay, prevAutoplay) {
            if(autoplay == prevAutoplay) { return; }
            var me = this;
            if(autoplay) {
                this.autoplayTimer = setInterval(function() {
                    if(!me.sliding) {
                        me.next(); 
                    }
                }, this.get('autoplay_interval_ms'));
            } else {
                clearInterval(this.autoplayTimer);
                this.autoplayTimer = undefined;
            } 
        },

        _getElesPosReady: function(eles) {
            this._placeTo(eles.middle, 0);
            this._placeTo(eles.left, -this.width);
            this._placeTo(eles.right, this.width);
        },

        _placeTo: function(ele, offsetX) {
            if(!ele) return;
            var cssObj = this._getOffsetXCss(offsetX);                
            ele.css(cssObj);
        },

        _slideTo: function(ele, offsetX, duration, callback) {
            if(!ele || !ele[0]) {return;}

            var style = ele[0].style;
            var cssPrefix = prefix['css'];

            if ( !style ) {
                return;
            }

            // animate
            style.cssText += cssPrefix + 'transition:' + duration + 
                    'ms ease;' + cssPrefix + 'transform: translate3d(' + 
                    offsetX + 'px, 0, 0);';
            // callback
            setTimeout(function() {
                callback && callback();
            }, duration);
        },

        _getOffsetXCss: function(offsetX) {
            var cssObj = {};
            cssObj[TRANSFORM_PROPERTY_NAME] = 'translate3d(' + offsetX + 'px, 0, 0)';
            return cssObj;
        } 

    });

    /***************************** End of Class Carousel ******************************/

    this.Carousel = Carousel;
})();
