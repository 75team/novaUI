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
                  js: pre 
              };
    })(); 

    var throttle = function (func, threshold, alt) { 
        var last = Date.now(); 
        threshold = threshold || 100; 
        return function () { 
            var now = Date.now(); 
            if (now - last < threshold) { 
                if (alt) { 
                    alt.apply(this, arguments); 
                } 
                return; 
            } 
            last = now; 
            func.apply(this, arguments); 
        }; 
    }; 

    var xForm = prefix['css'] + 'transform';

    var reqAnimFrame = window.requestAnimationFrame || window[prefix['js'] + 'requestAnimationFrame'] || function(callback) {
        setTimeout(callback, 1000/60);
    };

    var timeConstant = 325;     // 越大动画越快 425
    var smoothConstant = 0.5;   // 越大越光滑

    var Swipable = Widget.extend({
        /* 默认配置 */
        attrs: {
            dir: 'vertical'   // 可取值vertical, horizontal
        },

        /* 初始化 */
        setup: function() {
            this._initEvents();

            // 滑动方向
            this.isVertical = this.get('dir') === 'vertical' ? 1 : 0;

            // 滑动范围
            this.$view = this.$element.children();   // view是滑动区域中的内容
            this.min = this.isVertical ? this.$element.height() - this.$view.height() : this.$element.width() - this.$view.width();
            this.max = 0;
        },

        _initEvents: function() {
            var me = this,
                $ele = me.$element,
                $body = $('body'),
                dir,                    // 用户试图滑动的方向，1垂直，0水平
                offset = 0,             // 初始偏移量
                pressed,
                velocity,
                ticker,
                frame,
                timeStamp,
                amplitude,
                reference,
                referenceX,
                referenceY,
                touch;

            $ele.on('touchstart', tap);

            var throttleDrag = throttle(drag, 1000/70);

            function tap(e) {
                if(!pressed) {
                    pressed = true;
                    dir = undefined;

                    reference = me._pos(e);
                    referenceX = e.targetTouches[0].clientX;
                    referenceY = e.targetTouches[0].clientY;
                    touch = e.targetTouches[0];

                    $body.on('touchmove', throttleDrag);
                    $body.on('touchend', release);

                    frame = offset;
                    timeStamp = (new Date()).getTime();
                    velocity = 0;
                    amplitude = 0;
                    //ticker = setInterval(track, 80);
                }
            }

            function drag(e) {
                var x, y, pos, delta;

                if(e.targetTouches[0] != touch) {
                    return;
                }

                if(me.isVertical) {
                    e.preventDefault();
                } 
                else {
                    if(dir === undefined) {
                        x = e.targetTouches[0].clientX;
                        y = e.targetTouches[0].clientY;
                        dir = Math.abs(y - referenceY) > Math.abs(x - referenceX) ? 1 : 0;
                    }

                    if(dir === 1) {
                        return;
                    }

                    e.preventDefault();
                }

                pos = me._pos(e);

                delta = pos - reference;
                reference = pos;
                if(offset < me.min || offset > me.max) {
                    delta /= 4;
                }
                scroll(offset + delta);
                track();
            }
            
            function release(e) {
                pressed = false;
                var bound;

                if(e.changedTouches[0] != touch) {
                    alert();
                    return;
                }

                $body.off('touchmove', throttleDrag);
                $body.off('touchend', release);

                //clearInterval(ticker);

                if(offset < me.min ||  offset > me.max) {
                    target = offset < me.min ? me.min : me.max;
                    amplitude = target - offset;
                    timeStamp = (new Date).getTime();
                    reqAnimFrame(rebound);
                }
                
                else if(Math.abs(velocity) > 80) {
                    amplitude = smoothConstant * velocity;
                    target = Math.round(offset + amplitude);
                    timeStamp = (new Date).getTime();
                    reqAnimFrame(autoScroll);

                    if(target < me.min || target > me.max) {
                        bound = target < me.min ? me.min : me.max; 
                    }
                }

            }

            function track() {
                var d = (new Date()).getTime();

                var delta = offset - frame;
                var t = d - timeStamp;
                var v = 1000 * delta / (1 + t);


                //velocity = 0.2 * velocity + 0.8 * v;
                velocity = 0.05 * velocity + 0.95 * v;

                frame = offset;
                timeStamp = d;
            }

            function autoScroll() {
                var elapsed, delta, bound, boundTarget;
                if(amplitude) {
                    elapsed = (new Date()).getTime() - timeStamp;
                    delta = -amplitude * Math.exp(-elapsed / timeConstant);
                    if(Math.abs(delta) > 0.5) {

                        // rebound
                        if(offset > me.max || offset < me.min) {
                            bound = target < me.min ? me.min : me.max;
                            boundTarget = Math.round(bound + (target - bound) / 8);
                            if(Math.abs(target + delta) > Math.abs(boundTarget)) {
                            //if(Math.abs(delta) < Math.abs(amplitude) / 2) {
                                target = offset < me.min ? me.min : me.max;
                                amplitude = target - offset;
                                timeStamp = (new Date).getTime();
                                reqAnimFrame(rebound);
                                return;
                            }
                        }
                        scroll(target + delta);
                        reqAnimFrame(autoScroll);
                    } else {
                        scroll(target);
                    }
                }
            }

            function rebound() {
                //me.$view.animate({'-webkit-transform': 'translateX(0)'}, 1000, 'ease', function() {offset=0;});
                var elapsed, delta;
                if(amplitude) {
                    elapsed = (new Date()).getTime() - timeStamp;
                    delta = -amplitude * Math.exp(-elapsed / 100);
                    if(Math.abs(delta) > 0.5) {
                        scroll(target + delta);
                        reqAnimFrame(rebound);
                    } else {
                        scroll(target);
                    }
                }
            }

            function scroll(pos) {
                //offset = pos > me.max ? me.max : (pos < me.min) ? me.min : pos;
                offset = pos;
                //var translate = me.isVertical ? 'translateY' : 'translateX';
                //me.$view.css(xForm, translate + '(' + offset +'px)');
                var translate = me.isVertical ? 'translate3d(0, ' + offset + 'px, 0)': 'translate3d(' + offset + 'px, 0, 0)';
                me.$view.css({'-webkit-transform': translate});

            }

        },

        _pos: function(e) {
            return this.isVertical ? e.targetTouches[0].clientY : e.targetTouches[0].clientX;
        },

    });

    this.Swipable = Swipable;
})();
