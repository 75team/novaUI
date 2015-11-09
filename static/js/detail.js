(function() {

    var tmplData = {
        urls: {
            'nova_polyfills': 'http://s0.qhimg.com/static/c194ef77618ac141/nova_polyfills.1.0.1.js' ,
            'nova': 'http://s1.qhimg.com/static/c70d46df1c829566/nova.1.0.1.js' ,
            'nova_dev': 'http://s1.qhimg.com/static/8a4094068d25f2cc/nova_dev.1.0.1.js',
            'tab': 'http://s4.qhimg.com/static/2e45ebbde894b2dc/nova-tab.1.0.5.js',
            'carousel': 'http://s2.qhimg.com/static/ea413575de2fdb2c/nova-carousel.1.0.5.js',
            'swipable': 'http://s1.qhimg.com/static/43608e95b76f0a28/nova-swipable.1.0.1.js',
            'loadmore': 'http://s0.qhimg.com/static/ff2eed1b9bae4541/nova-loadmore.1.0.1.js',
            'dialog': 'http://s3.qhimg.com/static/13f40ce77e06f7ed/nova-dialog.1.0.1.js',
            'scratchTicket': 'http://s3.qhimg.com/static/1334c0a33c1f2e13/nova-scratch-ticket.1.0.1.js',
            'sidebar': 'http://s1.qhimg.com/static/3b6d33f29e07bbbd/nova-sidebar.1.0.1.js',
        }
    };

    var deps = 'nova_polyfills nova'.split(' ');
    deps.forEach(function(dep) {
        _loader.add(dep, tmplData.urls[dep]);
    });

    _loader.use(deps.join(','), function() {
        var doc = queryUrl(window.location.search, 'doc');
        $.get('docs/' + doc + '.md', function(response) {
            var docHtml = replaceAnnotation(response, tmplData);
            docHtml = marked(docHtml);
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
                // 若发现tocOffset值不合理，重新取
                if(tocOffset.top == 0) {
                    tocOffset = tocWrap.offset();
                    console.log(1);
                    return;
                }

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
    })

    function replaceAnnotation(docHtml, data) {
        return Nova.Utils.tmpl(docHtml, data);
    }

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
