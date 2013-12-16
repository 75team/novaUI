(function($) {
    var monthNames = ["01月", "02月", "03月", "04月", "05月", "06月",
        "07月", "08月", "09月", "10月", "11月", "12月"],

        dayNames = ["日", "一", "二", "三", "四", "五", "六"],
        offsetRE = /^(\+|\-)?(\d+)(M|Y)$/i,

        //获取月份的天数
        getDaysInMonth = function(year, month) {
            return 32 - new Date(year, month, 32).getDate();
        },

        //获取月份中的第一天是所在星期的第几天
        getFirstDayOfMonth = function(year, month) {
            return new Date(year, month, 1).getDay();
        },

        //格式化数字，不足补零.
        formatNumber = function(val, len) {
            var num = "" + val;
            while (num.length < len) {
                num = "0" + num;
            }
            return num;
        },

        getVal = function(elem) {
            return elem.is('select, input') ? elem.val() : elem.attr('data-value');
        },

        prototype;

    this.Calendar = Widget.extend({
        attrs: {
            _drawDate: null,
            /**
             * @property {Date|String} [date=null] 初始化日期
             */
            date: {
                value: null,
                setter: function(val){
                    this.set('selectedDate', val);
                    return this.get('selectedDate');
                }
            },
            /**
             * @property {Date|String} [selectedDate=null] 当前选中的日期
             */
            selectedDate: {
                value: {
                    year: null,
                    month: null,
                    day: null
                },
                getter: function(val){
                    return new Date(val.year, val.month, val.day);
                },
                setter: function(val){
                    var opts = this.get(),
                        date, minDate, maxDate;

                    minDate = opts.minDate;
                    maxDate = opts.maxDate;
                    val = $.calendar.parseDate(val);
                    val = minDate && minDate > val ? minDate : maxDate && maxDate < val ? maxDate : val;

                    date = {
                        year: val.getFullYear(),
                        month: val.getMonth(),
                        day: val.getDate()
                    };

                    this.set('_drawDate', date);

                    return date;
                }
            },
            /**
             * @property {Number} [firstDay=1] 设置新的一周从星期几开始，星期天用0表示, 星期一用1表示, 以此类推.
             */
            firstDay: 1,
            /**
             * @property {Date|String} [maxDate=null] 设置可以选择的最大日期
             */
            maxDate: {
                value: null,
                setter: function(val){
                    return val ? $.calendar.parseDate(val) : null;
                }
            },
            /**
             * @property {Date|String} [minDate=null] 设置可以选择的最小日期
             */
            minDate: {
                value: null,
                setter: function(val){
                    return val ? $.calendar.parseDate(val) : null;
                }
            },
            /**
             * @property {Boolean} [swipeable=false] 设置是否可以通过左右滑动手势来切换日历
             */
            swipeable: false,
            /**
             * @property {Boolean} [monthChangeable=false] 设置是否让月份可选择
             */
            monthChangeable: false,
            /**
             * @property {Boolean} [yearChangeable=false] 设置是否让年份可选择
             */
            yearChangeable: false,
            /**
             * @property {Boolean} [container=null] 生成的日历元素的父元素
             */
            container: null,
            /**
             * @property {Boolean} [template='<div>'] 日历元素的模板
             */
            template: '<div>'
        },

        setup: function() {
            var opts = this.get(),
                el = this.$element,
                eventHandler = $.proxy(this._eventHandler, this);

            this.on('change:_drawDate change:firstDay change:maxDate change:minDate change:monthChangeable change:yearChangeable', function(ev, val, prev, data){
                //标记为true, 则表示下次refresh的时候要重绘所有内容。
                this._invalid = true;
            });

            this.minDate(opts.minDate)
                .maxDate(opts.maxDate)
                .date(opts.date || new Date())
                .refresh();

            el.addClass('ui-calendar')
                .on('click', eventHandler)
                .highlight();

            opts.swipeable && el.on('swipeLeft swipeRight', eventHandler);

            this.render();
        },

        render: function() {
            var opts = this.get();
            var ele = this.$element;

            ele.appendTo(opts['container'] || (ele.parent().length ? '' : document.body));
        },

        _eventHandler: function(e) {
            var opts = this.get(),
                root = this.element,
                match,
                target,
                cell,
                date,
                elems;

            switch (e.type) {
                case 'swipeLeft':
                case 'swipeRight':
                    return this.switchMonthTo((e.type == 'swipeRight' ? '-' : '+') + '1M');

                case 'change':
                    elems = $('.ui-calendar-header .ui-calendar-year, ' +
                        '.ui-calendar-header .ui-calendar-month', this._el);

                    return this.switchMonthTo(getVal(elems.eq(1)), getVal(elems.eq(0)));

                default:
                    //click

                    target = e.target;

                    if ((match = $(target).closest('.ui-calendar-calendar tbody a', root)) && match.length) {

                        e.preventDefault();
                        cell = match.parent();

                        this.set('selectedDate',
                        date = new Date(cell.attr('data-year'), cell.attr('data-month'), match.text()));

                        this.trigger('select', date, $.calendar.formatDate(date), this);
                        this.refresh();
                    } else if ((match = $(target).closest('.ui-calendar-prev, .ui-calendar-next', root)) && match.length) {

                        e.preventDefault();
                        this.switchMonthTo((match.is('.ui-calendar-prev') ? '-' : '+') + '1M');
                    }
            }
        },

        /**
         * 切换到今天所在月份
         * @method switchToToday
         */
        switchToToday: function() {
            var today = new Date();
            return this.switchMonthTo(today.getMonth(), today.getFullYear());
        },

        /**
         * 切换月份
         * @method switchMonthTo
         * @param {String|Number} month 目标月份，值可以为+1M, +4M, -5Y, +1Y等等。+1M表示在显示的月的基础上显示下一个月，+4m表示下4个月，-5Y表示5年前
         * @param {String|Number} year 目标年份
         * @return {self} 返回本身
         */
        switchMonthTo: function(month, year) {
            var opts = this.get(),
                _drawDate = this.get('_drawDate'),
                minDate = this.minDate(),
                maxDate = this.maxDate(),
                offset,
                period,
                tmpDate;

            if (Object.prototype.toString.call(month) === '[object String]' && offsetRE.test(month)) {
                offset = RegExp.$1 == '-' ? -parseInt(RegExp.$2, 10) : parseInt(RegExp.$2, 10);
                period = RegExp.$3.toLowerCase();
                month = _drawDate.month + (period == 'm' ? offset : 0);
                year = _drawDate.year + (period == 'y' ? offset : 0);
            } else {
                month = parseInt(month, 10);
                year = parseInt(year, 10);
            }

            //Date有一定的容错能力，如果传入2012年13月，它会变成2013年1月
            tmpDate = new Date(year, month, 1);

            //不能跳到不可选的月份
            tmpDate = minDate && minDate > tmpDate ? minDate : maxDate && maxDate < tmpDate ? maxDate : tmpDate;

            month = tmpDate.getMonth();
            year = tmpDate.getFullYear();

            if (month != _drawDate.month || year != _drawDate.year) {
                this.trigger('monthchange', month, year, this);

                this.set('_drawDate', {month: month, year: year});

                this.refresh();
            }

            return this;
        },

        /**
         * 刷新日历，当修改option后需要调用此方法
         * @method refresh
         * @return {self} 返回本身
         */
        refresh: function() {
            var opts = this.get(),
                el = this.$element,
                eventHandler = $.proxy(this._eventHandler, this);

            //如果数据没有变化厕不重绘了
            if (!this._invalid) {
                return;
            }

            $('.ui-calendar-calendar td:not(.ui-state-disabled), .ui-calendar-header a', el).highlight();
            $('.ui-calendar-header select', el).off('change', eventHandler);
            el.empty().append(this._generateHTML());
            $('.ui-calendar-calendar td:not(.ui-state-disabled), .ui-calendar-header a', el).highlight('ui-state-hover');
            $('.ui-calendar-header select', el).on('change', eventHandler);
            this._invalid = false;
            return this;
        },

        /**
         * 销毁组件
         * @method destroy
         */
        destroy: function() {
            var el = this.$element,
                eventHandler = this._eventHandler;

            $('.ui-calendar-calendar td:not(.ui-state-disabled)', el).highlight();
            $('.ui-calendar-header select', el).off('change', eventHandler);
            el.remove();
            return this.$super('destroy');
        },

        /**
         * 重绘表格
         */
        _generateHTML: function() {
            var opts = this.get(),
                _drawDate = this.get('_drawDate'),
                drawYear = _drawDate.year,
                drawMonth = _drawDate.month,
                tempDate = new Date(),
                today = new Date(tempDate.getFullYear(), tempDate.getMonth(),
                tempDate.getDate()),

                minDate = this.minDate(),
                maxDate = this.maxDate(),
                selectedDate = this.selectedDate(),
                html = '',
                i,
                j,
                firstDay,
                day,
                leadDays,
                daysInMonth,
                rows,
                printDate;

            firstDay = (isNaN(firstDay = parseInt(opts.firstDay, 10)) ? 0 : firstDay);

            html += this._renderHead(opts, drawYear, drawMonth, minDate, maxDate) +
                '<table  class="ui-calendar-calendar"><thead><tr>';

            for (i = 0; i < 7; i++) {
                day = (i + firstDay) % 7;

                html += '<th' + ((i + firstDay + 6) % 7 >= 5 ?

                //如果是周末则加上ui-calendar-week-end的class给th
                ' class="ui-calendar-week-end"' : '') + '>' +
                    '<span>' + dayNames[day] + '</span></th>';
            }

            //添加一个间隙，样式需求
            html += '</thead></tr><tbody><tr class="ui-calendar-gap">' +
                '<td colspan="7">&#xa0;</td></tr>';

            daysInMonth = getDaysInMonth(drawYear, drawMonth);
            leadDays = (getFirstDayOfMonth(drawYear, drawMonth) - firstDay + 7) % 7;
            rows = Math.ceil((leadDays + daysInMonth) / 7);
            printDate = new Date(drawYear, drawMonth, 1 - leadDays);

            for (i = 0; i < rows; i++) {
                html += '<tr>';

                for (j = 0; j < 7; j++) {
                    html += this._renderDay(j, printDate, firstDay, drawMonth, selectedDate, today, minDate, maxDate);
                    printDate.setDate(printDate.getDate() + 1);
                }
                html += '</tr>';
            }
            html += '</tbody></table>';
            return html;
        },

        _renderHead: function(data, drawYear, drawMonth, minDate, maxDate) {
            var html = '<div class="ui-calendar-header">',

                //上一个月的最后一天
                lpd = new Date(drawYear, drawMonth, -1),

                //下一个月的第一天
                fnd = new Date(drawYear, drawMonth + 1, 1),
                i,
                max;

            html += '<a class="ui-calendar-prev' + (minDate && minDate > lpd ?
                ' ui-state-disable' : '') + '" href="#">&lt;&lt;</a><div class="ui-calendar-title">';

            if (data.yearChangeable) {
                html += '<select class="ui-calendar-year">';

                for (i = Math.max(1970, drawYear - 10), max = i + 20; i < max; i++) {
                    html += '<option value="' + i + '" ' + (i == drawYear ?
                        'selected="selected"' : '') + '>' + i + '年</option>';
                }
                html += '</select>';
            } else {
                html += '<span class="ui-calendar-year" data-value="' + drawYear + '">' + drawYear + '年' + '</span>';
            }

            if (data.monthChangeable) {
                html += '<select class="ui-calendar-month">';

                for (i = 0; i < 12; i++) {
                    html += '<option value="' + i + '" ' + (i == drawMonth ?
                        'selected="selected"' : '') + '>' + monthNames[i] + '</option>';
                }
                html += '</select>';
            } else {
                html += '<span class="ui-calendar-month" data-value="' + drawMonth + '">' + monthNames[drawMonth] + '</span>';
            }

            html += '</div><a class="ui-calendar-next' + (maxDate && maxDate < fnd ?
                ' ui-state-disable' : '') + '" href="#">&gt;&gt;</a></div>';
            return html;
        },

        _renderDay: function(j, printDate, firstDay, drawMonth, selectedDate, today, minDate, maxDate) {

            var otherMonth = (printDate.getMonth() !== drawMonth),
                unSelectable;

            unSelectable = otherMonth || (minDate && printDate < minDate) || (maxDate && printDate > maxDate);

            return "<td class='" + ((j + firstDay + 6) % 7 >= 5 ? "ui-calendar-week-end" : "") + // 标记周末

            (unSelectable ? " ui-calendar-unSelectable ui-state-disabled" : "") + //标记不可点的天

            (otherMonth || unSelectable ? '' : (printDate.getTime() === selectedDate.getTime() ? " ui-calendar-current-day" : "") + //标记当前选择
            (printDate.getTime() === today.getTime() ? " ui-calendar-today" : "") //标记今天
            ) + "'" +

            (unSelectable ? "" : " data-month='" + printDate.getMonth() + "' data-year='" + printDate.getFullYear() + "'") + ">" +

            (otherMonth ? "&#xa0;" : (unSelectable ? "<span class='ui-state-default'>" + printDate.getDate() + "</span>" :
                "<a class='ui-state-default" + (printDate.getTime() === today.getTime() ? " ui-state-highlight" : "") + (printDate.getTime() === selectedDate.getTime() ? " ui-state-active" : "") +
                "' href='#'>" + printDate.getDate() + "</a>")) + "</td>";
        }
    });

    prototype = this.Calendar.prototype;

    //添加直接的修改接口
    $.each(['maxDate', 'minDate', 'date', 'selectedDate'], function(i, name) {
        prototype[name] = function(val) {
            return val === undefined ? this.get(name) : (this.set(name, val), this);
        }
    });

    //补充注释

    /**
     * 设置或获取maxDate，如果想要设置生效需要调用[Refresh](#calendar_refresh)方法
     * @method maxDate
     * @param {String|Date} value 最大日期的值
     * @return {self} 返回本身
     */

    /**
     * 设置或获取minDate，如果想要设置生效需要调用[Refresh](#calendar_refresh)方法
     * @method minDate
     * @param {String|Date} value 最小日期的值
     * @return {self} 返回本身
     */

    /**
     * 设置或获取当前日期，如果想要设置生效需要调用[Refresh](#calendar_refresh)方法
     * @method date
     * @param {String|Date} value 当前日期
     * @return {self} 返回本身
     */

    /**
     * 设置或获取当前选中的日期，如果想要Option生效需要调用[Refresh](#calendar_refresh)方法
     * @method selectedDate
     * @param {String|Date} value 当前日期
     * @return {self} 返回本身
     */


    //开放接口，如果现有格式不能满足需求，外部可以通过覆写一下两个方法
    $.calendar = {

        /**
         * 解析字符串成日期格式对象。目前支持yyyy-mm-dd格式和yyyy/mm/dd格式。
         * @name $.calendar.parseDate
         * @grammar $.calendar.parseDate( str ) ⇒ Date
         */
        parseDate: function(obj) {
            var dateRE = /^(\d{4})(?:\-|\/)(\d{1,2})(?:\-|\/)(\d{1,2})$/;
            return Object.prototype.toString.call(obj) === '[object Date]' ? obj : dateRE.test(obj) ? new Date(parseInt(RegExp.$1, 10), parseInt(RegExp.$2, 10) - 1, parseInt(RegExp.$3, 10)) : null;
        },

        /**
         * 格式化日期对象为字符串, 输出格式为yyy-mm-dd
         * @name $.calendar.formatDate
         * @grammar $.calendar.formatDate( date ) ⇒ String
         */
        formatDate: function(date) {
            return date.getFullYear() + '-' + formatNumber(date.getMonth() + 1, 2) + '-' + formatNumber(date.getDate(), 2);
        }
    }

    /**
     * @event select
     * @param {Event} e Event对象
     * @param {Date} date 当前选中的日期
     * @param {String} dateStr 当前选中日期的格式化字符串
     * @param {Instance} instance 当前日历的实例
     * @description 选中日期的时候触发
     */
    
    /**
     * @event monthchange
     * @param {Event} e Event对象
     * @param {Date} month 当前月份
     * @param {String} year 当前年份
     * @param {Instance} instance 当前日历的实例
     * @description 前现实月份发生变化时触发
     */
    
    /**
     * @event destroy
     * @param {Event} e Event对象
     * @description 组件在销毁的时候触发
     */
})($);