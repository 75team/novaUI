(function(define, global) {
    define(['module/Nova.switchable/1.0.0/carousel'], function(Carousel) {

        Carousel = Carousel || global.Carousel;

        Tab = Carousel.extend({
            attrs: {
                recursive: false,
                autoplay: false,

                selectors: {
                    content: '.tab-cont',
                    contItem: '.cont-item',
                    control: '.tab-control',
                    controlItem: '.control-item',
                    active: '.active'
                },
            }
        });

        return Tab;
    });
}) (
    typeof define === 'function' && define.amd ? define : function (name, requires, factory) { 
    	if(typeof name === 'function') {
    		factory = name;
    	} else if(typeof requires === 'function') {
    		factory = requires;
    	}

        if(typeof module != 'undefined'){
            module.exports = factory(require); 
        }else if(typeof window != 'undefined'){
            window.Tab = factory();
        }
    },
    this
);

