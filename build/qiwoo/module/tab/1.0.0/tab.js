(function(define, global) { 
define(['module/carousel/1.0.0/carousel'], function(Carousel) {
Carousel = Carousel || this.Carousel;



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

    return Tab;

}); 
}) ( typeof define === 'function' && define.amd ? define : function (name, requires, factory) { if(typeof name === 'function') { factory = name; } else if(typeof requires === 'function') { factory = requires; } if(typeof module != 'undefined'){ module.exports = factory(require); }else if(typeof window != 'undefined'){ window.Tab= factory(); } }, this);