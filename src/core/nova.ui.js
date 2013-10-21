/* 
 * @file novaUI组件的基类，和定义组件的接口。 
 * @name nova.ui
 * @desc 通过nova.ui.define定义组件，自动继承于组件基类Widget，可快速创建新组件
 * @import src/zepto.js
 * */
(function($) {
    var nova = window.nova || {};

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
            };
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


(function() {
    var nova = window.nova || {};

    nova.utils = nova.utils || {

        /*
        * 字符串简易模板
        * @method tmpl
        * @static
        * @param {String} sTmpl 字符串模板，其中变量以｛$aaa｝表示
        * @param {Object} opts 模板参数
        * @return {String}  模板变量被替换后的字符串
        * @example alert(tmpl("{$a} love {$b}.",{a:"I",b:"you"}))
        tmpl:function(sTmpl,opts){
            return sTmpl.replace(/\{\$(\w+)\}/g,function(a,b){return opts[b]});
        },
        */

        /** 
         * 字符串模板
         * @method tmpl
         * @static
         * @param {String} sTmpl 字符串模板，其中变量以{$aaa}表示。模板语法：
         分隔符为{xxx}，"}"之前没有空格字符。
         js表达式/js语句里的'}', 需使用' }'，即前面有空格字符
         模板里的字符{用##7b表示
         模板里的实体}用##7d表示
         模板里的实体#可以用##23表示。例如（模板真的需要输出"##7d"，则需要这么写“##23#7d”）
         {strip}...{/strip}里的所有\r\n打头的空白都会被清除掉
         {=xxx} 输出经HTML转码的xxx
         {xxx} 输出xxx，xxx只能是表达式，不能使用语句，除非使用以下标签
         {js ...}       －－任意js语句, 里面如果需要输出到模板，用print("aaa");
         {if(...)}      －－if语句，写法为{if($a>1)},需要自带括号
         {elseif(...)}  －－elseif语句，写法为{elseif($a>1)},需要自带括号
         {else}         －－else语句，写法为{else}
         {/if}          －－endif语句，写法为{/if}
         {for(...)}     －－for语句，写法为{for(var i=0;i<1;i++)}，需要自带括号
         {/for}         －－endfor语句，写法为{/for}
         {while(...)}   －－while语句,写法为{while(i-->0)},需要自带括号
         {/while}       －－endwhile语句, 写法为{/while}
         * @param {Object} opts (Optional) 模板参数
         * @return {String|Function}  如果调用时传了opts参数，则返回字符串；如果没传，则返回一个function（相当于把sTmpl转化成一个函数）
         
         * @example alert(tmpl("{$a} love {$b}.",{a:"I",b:"you"}));
         * @example alert(tmpl("{js print('I')} love {$b}.",{b:"you"}));
         */
    };

})($);
