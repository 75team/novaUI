$(function() {
    var firstClick = false;
    function noTouchEvent() {
        return !('ontouchstart' in window);
    }
    
    function triggerEvt(e, type) {
        var target = $('tagName' in e.target ?
          e.target : e.target.parentNode)
        var touchs = [];
        var touch = {};
        for(var k in e) {
            touch[k] = e[k];
        }
        touch['type'] = type;
        touchs.push(touch);
        touchs[0].radiusX = 12;
        touchs[0].radiusY = 12;
        touchs[0].identifier = 0;
        touchs[0].force = 1;
        try{
            target.trigger($.Event(type, {touches : touchs, changedTouches : touchs}));
        } catch(ex) {
            //console.log(ex);
        }
    }
    
    if(noTouchEvent()) {
        $(document).on('mousedown', function(e) {
            firstClick = true;
            triggerEvt(e, 'touchstart');
        }).on('mousemove', function(e) {
            if(!firstClick) return;
            triggerEvt(e, 'touchmove');
        }).on('mouseup mouseout', function(e) {
            firstClick = false;
            triggerEvt(e, 'touchend');
        });
    }
});
