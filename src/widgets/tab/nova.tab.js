(function() {
    this.Tab = Switchable.extend({
        defaultConfig: {
            index: 0,           // 初始选项
            count: 1,           // 选项个数

            openAnimate: true, 
            duration_ms: 200
        },

        selectors: {
            
        },

        setup: function() {
            this._super(arguments);
        }
    });
})();
