/* 
 * @file novaUI组件的基类，和定义组件的接口。 
 * @name nova.ui
 * @desc 通过nova.ui.define定义组件，自动继承于组件基类Widget，可快速创建新组件
 * @import src/zepto.js
 * */
(function($) {
	var nova = nova || {};

	nova.ui = nova.ui || {
        /*
         * 定义novaUI组件
         * @method define
         * @param {Function} init 初始化方法
         * @param {JSON} prototype 组件的原型属性与方法
         * @return {Function} 组件类
         *
         * **Example**
         * <script>
         *      function init(ele, config) {
         *          // ...
         *      }
         *      var prototype = {
         *          _defaultConf: { //... },
         *          syncUI: function() {}
         *      }
         *      var Slide = nova.ui.define(init, prototype);
         *      window.Slide = Slide;
         * </script>
         *
         * **Usage**
         * <script>
         *      var slide = new Slide('.slider', {autoplay:true});
         * </script>
         *
         * */
		define: function(init, prototype) {
			var widget = function(ele, config) {
				Widget.call(this, ele, config);
				init.call(this, ele, this.config);
			}
			widget.prototype = new Widget();
			$.extend(widget.prototype, prototype);
			return widget;
		}
	};

    /*
     * novaUI组件的基类
     * @class Widget
     * @constructor
     * @param {DOM} ele 组件对应的DOM元素
     * @config {JSON} 组件配置
     *
     * */ 
	function Widget(ele, config) {
		this.root = $(ele);
		this.config = $.extend(true, this._defaultConf, config);
		this.init(ele, config);
	}

    /*
     * Widget原型属性和方法
     * 
     * */
	$.extend(Widget.prototype, {
		/* 默认配置 */
		_defaultConf: {}, 

        /*
         * 组件实例化时的初始化操作
         * @interface init
         * param {ele} 组件的DOM元素
         * param {JSON} 组件配置
         *
         * */
		init: function(ele, config) {}, 

        
        /*
         * 组件销毁操作
         * @interface destroy
         *
         * */
		destroy: function() {}, 

        /*
         * 同步widget UI
         * @interface syncUI
         *
         * */
		syncUI: function() {}, 

        /*
         * 给组件绑定事件
         * @method on
         * @param {String} ev 事件名称
         * @param {Function} callback 回调函数
         *
         * */
		on: function(ev, callback) {
			this.root.on(ev, $.proxy(callback, this));
			return this;
		}, 
        /*
         * 给组件解除事件
         * @method oof
         * @param {String} ev 事件名称
         * @param {Function} callback 回调函数
         *
         * */
		off: function(ev, callback) {
			this.root.off(ev, callback);
			return this;
		}, 
        /*
         * 触发组件事件
         * @method oof
         * @param {String} ev 事件名称
         * @param {JSON} data 额外参数
         *
         * */
		trigger: function(ev, data) {
			this.root.trigger(ev, data);
			return this;
		}
	});

	window.nova = window.nova || nova;
})($);
