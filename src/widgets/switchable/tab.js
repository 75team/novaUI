(function() {

    Tab = Carousel.extend({
        attrs: {
            animate: true,
            recursive: false,
            autoplay: false,

            selectors: {
                content: '.tab-cont',
                contItem: '.cont-item',
                control: '.tab-control',
                controlItem: '.control-item',
                active: '.active'
            },
        },
        setup: function() {
            if(!this.get('animate')) {
                this.set('swipable', false);
                this.set('duration_ms', 0);
            }
            Tab.superclass.setup.call(this);
        }
    });

    this.Tab = Tab;

})();
