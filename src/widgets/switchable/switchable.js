(function($) {

    this.Switchable = Widget.extend({
        /* 默认配置 */
        defaultConfig: {
            index: -1,          // 初始选项
            count: 0,           // 选项个数
            recursive: false    // 是否可循环
        },

        /* 初始化 */
        setup: function() {
            this.index = this.config.index;
            this.count = this.config.count;
        },

        /* 切换到下一个，成功返回true, 触发next事件 */
        next: function() {
            var from = this.index,
                to;
            // 可循环
            if(this.config.recursive) {
                to = (from + 1) % this.count;
                this.switchTo(to);
                this.trigger('next', [from, to]);
                return true;
            }
            // 不可循环，但未超出范围
            else if((to = from + 1) < this.count){
                this.switchTo(to);
                this.trigger('next', [from, to]);
                return true;
            }

            return false;
        },

        /* 切换到上一个，成功返回true, 触发prev事件 */
        prev: function() {
            var from = this.index,
                to;
            // 可循环
            if(this.config.recursive) {
                to = (from + this.count - 1) % this.count;
                this.switchTo(to);
                this.trigger('prev', [from, to]);
                return true;
            }
            // 不可循环，但未超出范围
            else if((to = from - 1) >= 0){
                this.switchTo(to);
                this.trigger('prev', [from, to]);
                return true;
            }

            return false;
        },

        /* 切换到to, 成功返回true, 触发switch事件 */
        switchTo: function(to) {
            var from = this.index;
            if(from != to) {
                this.index = to;
                this.trigger('switch', [from, to]);
                return true;
            }
            return false;
        }
    });
})($);
