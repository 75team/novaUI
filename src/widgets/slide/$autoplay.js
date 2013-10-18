(function() {
    this.$autoplay = {
        defaultConfig: {
            autoplay: true,
            interval_ms: 10000,     // 自动轮播间隔
        },

        setupPlugin: function() {
            var me = this,
                $body = $(document.body);

            me.autoplay = me.config.autoplay,
            me.interval = me.config.interval_ms;
            me.autoplayTimerID = null;

            // 自动轮播
            if(me.autoplay) {
                me.startAutoplay();
            }

            me.$items.parent().on('touchstart', function(ev) {
                me.stopAutoplay();
                $body.on('touchend', touchendHandler);

                function touchendHandler() {
                    if(me.autoplay) {
                        me.startAutoplay();
                    }
                    $body.off('touchend', touchendHandler);
                }
            });

        },

        /*
         * 开始自动轮播
         * @method startAutoplay
         * */
        startAutoplay: function() {
            var me = this;

            me.autoplayTimerID = setInterval(function() {
               me.next();
            }, me.interval);
        },
        /*
         * 关闭自动轮播
         * @method stopAutoplay
         * */
        stopAutoplay: function() {
            var me = this;

            clearInterval(me.autoplayTimerID);
            me.autoplayTimerID = null;
        },
    }
})();
