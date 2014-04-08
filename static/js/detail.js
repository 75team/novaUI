(function() {
    var doc = queryUrl(window.location.search, 'doc');
    $.get('docs/' + doc + '.md', function(response) {
        var docHtml = marked(response);
        $('.doc').html(docHtml);

        // 代码高亮
        Prism.highlightAll();

        // 生成目录
        var toc = $('.toc'),
            tocWrap = $('.toc-wrap');
        toc.toc({
            container: '.doc',
            selector: 'h1, h2, h3, h4'
        });

        // 监听滚动
        var tocOffset = tocWrap.offset();
        $(window).on('scroll', debounce(function(e) {
            var scrollTop = $(window).scrollTop();
            if(scrollTop - tocOffset.top >= 0) {
                tocWrap.addClass('toc-fixed'); 
            }
            else {
                tocWrap.removeClass('toc-fixed'); 
            }
        }, 1000/60));

        function debounce(func, wait, immediate) {
            var timeout;
            return function() {
                var context = this, args = arguments;
                clearTimeout(timeout);
                timeout = setTimeout(function() {
                    timeout = null;
                    if (!immediate) func.apply(context, args);
                }, wait);
                if (immediate && !timeout) func.apply(context, args);
            };
        };
    }); 

    // Helpers
    function queryUrl(url, key) {
        url = url.replace(/^[^?=]*\?/ig, '').split('#')[0]; //去除网址与hash信息
        var json = {};
        //考虑到key中可能有特殊符号如“[].”等，而[]却有是否被编码的可能，所以，牺牲效率以求严谨，就算传了key参数，也是全部解析url。
        url.replace(/(^|&)([^&=]+)=([^&]*)/g, function (a, b, key , value){
            //对url这样不可信的内容进行decode，可能会抛异常，try一下；另外为了得到最合适的结果，这里要分别try
            try {
                key = decodeURIComponent(key);
            } catch(e) {}

            try {
                value = decodeURIComponent(value);
            } catch(e) {}

            if (!(key in json)) {
                json[key] = /\[\]$/.test(key) ? [value] : value; //如果参数名以[]结尾，则当作数组
            }
            else if (json[key] instanceof Array) {
                json[key].push(value);
            }
            else {
                json[key] = [json[key], value];
            }
        });
        return key ? json[key] : json;
    } 
})();
