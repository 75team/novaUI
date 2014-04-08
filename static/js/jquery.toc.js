/*!
* toc - $ Table of Contents Plugin
* v0.1.2
* http://projects.jga.me/toc/
* copyright Greg Allen 2013
* MIT License
*/
(function($) {
    $.fn.toc = function(options) {
        var self = this;
        var opts = $.extend({}, $.fn.toc.defaults, options);

        var container = $(opts.container);
        var headings = $(opts.selectors, container);
        var headingOffsets = [];
        var activeClassName = opts.prefix+'-active';

        function smoothScroll(el, to, duration) {
            if (duration < 0) {
                return;
            }
            var difference = to - $(window).scrollTop();
            var perTick = difference / duration * 10;
            this.scrollToTimerCache = setTimeout(function() {
                if (!isNaN(parseInt(perTick, 10))) {
                    window.scrollTo(0, $(window).scrollTop() + perTick);
                    smoothScroll(el, to, duration - 10);
                }
            }.bind(this), 10);
        }

        var scrollTo = function(e) {
            if (opts.smoothScrolling) {
                e.preventDefault();
                var elScrollTo = $(e.target).attr('href');
                var $el = $(elScrollTo);
                var offset = $el.offset();

                smoothScroll($('body, html'), offset.top, 300);
                /*
                $('body,html').animate({ scrollTop: offset.top }, 400, 'swing', function() {
                    location.hash = elScrollTo;
                });
                */
            }
            $('li', self).removeClass(activeClassName);
            $(e.target).parent().addClass(activeClassName);
        };

        //highlight on scroll
        var timeout;
        var highlightOnScroll = function(e) {
            if (timeout) {
                clearTimeout(timeout);
            }
            timeout = setTimeout(function() {
                var top = $(window).scrollTop(),
                highlighted;
                for (var i = 0, c = headingOffsets.length; i < c; i++) {
                    if (headingOffsets[i] >= top) {
                        $('li', self).removeClass(activeClassName);
                        highlighted = $('li:eq('+(i-1)+')', self).addClass(activeClassName);
                        opts.onHighlight(highlighted);
                        break;
                    }
                }
            }, 50);
        };
        if (opts.highlightOnScroll) {
            $(window).bind('scroll', highlightOnScroll);
            highlightOnScroll();
        }

        return this.each(function() {
            //build TOC
            var el = $(this);
            var ul = $('<ul/>');
            headings.each(function(i, heading) {
                var $h = $(heading);
                headingOffsets.push($h.offset().top - opts.highlightOffset);

                //add anchor
                var anchor = $('<span/>').attr('id', opts.anchorName(i, heading, opts.prefix)).insertBefore($h);

                //build TOC item
                var a = $('<a/>')
                .text(opts.headerText(i, heading, $h))
                .attr('href', '#' + opts.anchorName(i, heading, opts.prefix))
                .bind('click', function(e) { 
                    scrollTo(e);
                    el.trigger('selected', $(this).attr('href'));
                });

                var li = $('<li/>')
                .addClass(opts.itemClass(i, heading, $h, opts.prefix))
                .append(a);

                ul.append(li);
            });
            el.html(ul);
        });
    };


    $.fn.toc.defaults = {
        container: 'body',
        selectors: 'h1,h2,h3',
        smoothScrolling: true,
        prefix: 'toc',
        onHighlight: function() {},
        highlightOnScroll: true,
        highlightOffset: 100,
        anchorName: function(i, heading, prefix) {
            return prefix+i;
        },
        headerText: function(i, heading, $heading) {
            return $heading.text();
        },
        itemClass: function(i, heading, $heading, prefix) {
            return prefix + '-' + $heading[0].tagName.toLowerCase();
        }

    };

})($);
