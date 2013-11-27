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
