(function() {
    var $body = $(document.body);

    // hover效果
    var hoverEle;
    var activeEle;
    var isUp = true;

    var form = $('#animate_form');
    var generatedCssContainer = $('.generated-css');
    var generatedStyleSheet = $('.generated-style-sheet');
    var animList = {};

    $body.on('keypress', function(e) {
        if(e.keyCode != 99) {
            return;
        }
        if(!isUp) {
            return;
        }
        console.log('key');
        hoverEle = null;
        activeEle && activeEle.removeClass('active') && (activeEle = null);
        isUp = false;
        // 检测是否快捷键c

        $body.on('mouseover', mouseoverHandler);
        $body.one('mousemove', mouseoverHandler);
        function mouseoverHandler(e) {
            hoverEle && hoverEle.removeClass('active');
            hoverEle = $(e.target);
            hoverEle.addClass('active');
        }

        $body.on('click', clickHandler);
        function clickHandler(e) {
            activeEle = hoverEle;
            className = getClassName(activeEle);
            if(animList[className]) {
                //form.fillFromJson(animList[className]);
            }
        }

        $body.on('keyup', function() {
            isUp = true;
            $body.off('mouseover', mouseoverHandler);
            hoverEle && hoverEle.removeClass('active');
            activeEle && activeEle.addClass('active');
        })

    });

    // 监听form变化，随时生成动画
    form.find('input,select').on('change', function() {

        if(!activeEle) {
            return;
        }
        var className = getClassName(activeEle);
        if(!className) {
            return;
        }

        var data = form.toJSON();

        if(data.animate_name == 'none') {
            delete animList[className];
        } else {
            animList[className] = data;
        }

        var generatedCss = getCss();

        generatedCssContainer.html(generatedCss);
        generatedStyleSheet.html(generatedCss);
    });

    $('.play').on('click', function() {
        generatedStyleSheet.html('');
        setTimeout(function() {
            generatedStyleSheet.html(getCss());
        });
    });

    function getClassName(ele) {
        var className = ele[0].className.match(/anim-\S+/);
        return className ? className[0] : '';
    }

    function getCss() {
        var generatedCss = '';
        for(var cName in animList) {
            generatedCss += '.' + cName + '{-webkit-animation: ' + animList[cName].animate_name + ' ' + animList[cName].animate_period + 'ms ' + animList[cName].animate_delay + 'ms;}\n';
        }
        return generatedCss;
    }
})();
