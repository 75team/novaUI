(function() {
    var Switchable = Widget.extend({
        /* 默认配置 */
        attrs: {
            index: -1,          // 初始选项
            count: 0,           // 选项个数
            recursive: false    // 是否可循环
        },

        /* 初始化 */
        setup: function() {
        },

        /* 切换到下一个，成功返回true, 触发next事件 */
        next: function() {
            var index = this.get('index');
            var next= this.getNextIndex();
            if(next != -1) {
                this.switch(next);
                return true;
            }
            return false;
        },

        /* 切换到上一个，成功返回true, 触发prev事件 */
        prev: function() {
            var index = this.get('index');
            var prev = this.getPrevIndex();
            if( prev != -1) {
                this.switch(prev);
                return true;
            }
            return false;
        },

        getNextIndex: function() {
            var from = this.get('index'),
                to = -1, 
                count = this.get('count');
            if(this.get('recursive')) {
                to = (from + 1) % count;
            }
            // 不可循环，但未超出范围
            else if((from + 1) < count){
                to = from + 1;
            }

            return to;
        },

        getPrevIndex: function() {
            var from = this.get('index'),
                to = -1, 
                count = this.get('count');
            if(this.get('recursive')) {
                to = (from + count - 1) % count;
            }
            // 不可循环，但未超出范围
            else if((from - 1) >= 0){
                to = from - 1;
            }

            return to;

        },

        /* 切换到to, 成功返回true, 触发switch事件 */
        switch: function(to) {
            var from = this.get('index');
            if(from != to) {
                this.set('index', to)
                //this.trigger('switch', [from, to]);
                return true;
            }
            return false;
        },
    });    

    this.Switchable = Switchable;
})(); 
