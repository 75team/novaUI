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
		 {js ...}		－－任意js语句, 里面如果需要输出到模板，用print("aaa");
		 {if(...)}		－－if语句，写法为{if($a>1)},需要自带括号
		 {elseif(...)}	－－elseif语句，写法为{elseif($a>1)},需要自带括号
		 {else}			－－else语句，写法为{else}
		 {/if}			－－endif语句，写法为{/if}
		 {for(...)}		－－for语句，写法为{for(var i=0;i<1;i++)}，需要自带括号
		 {/for}			－－endfor语句，写法为{/for}
		 {while(...)}	－－while语句,写法为{while(i-->0)},需要自带括号
		 {/while}		－－endwhile语句, 写法为{/while}
		 * @param {Object} opts (Optional) 模板参数
		 * @return {String|Function}  如果调用时传了opts参数，则返回字符串；如果没传，则返回一个function（相当于把sTmpl转化成一个函数）
		 
		 * @example alert(tmpl("{$a} love {$b}.",{a:"I",b:"you"}));
		 * @example alert(tmpl("{js print('I')} love {$b}.",{b:"you"}));
		 */
		tmpl: (function() {
			
			var tmplFuns={};
			/*
			sArrName 拼接字符串的变量名。
			*/
			var sArrName = "sArrCMX",
				sLeft = sArrName + '.push("';
			/*
				tag:模板标签,各属性含义：
				tagG: tag系列
				isBgn: 是开始类型的标签
				isEnd: 是结束类型的标签
				cond: 标签条件
				rlt: 标签结果
				sBgn: 开始字符串
				sEnd: 结束字符串
			*/
			var tags = {
				'=': {
					tagG: '=',
					isBgn: 1,
					isEnd: 1,
					sBgn: '",QW.StringH.encode4HtmlValue(',
					sEnd: '),"'
				},
				'js': {
					tagG: 'js',
					isBgn: 1,
					isEnd: 1,
					sBgn: '");',
					sEnd: ';' + sLeft
				},
				'js': {
					tagG: 'js',
					isBgn: 1,
					isEnd: 1,
					sBgn: '");',
					sEnd: ';' + sLeft
				},
				//任意js语句, 里面如果需要输出到模板，用print("aaa");
				'if': {
					tagG: 'if',
					isBgn: 1,
					rlt: 1,
					sBgn: '");if',
					sEnd: '{' + sLeft
				},
				//if语句，写法为{if($a>1)},需要自带括号
				'elseif': {
					tagG: 'if',
					cond: 1,
					rlt: 1,
					sBgn: '");} else if',
					sEnd: '{' + sLeft
				},
				//if语句，写法为{elseif($a>1)},需要自带括号
				'else': {
					tagG: 'if',
					cond: 1,
					rlt: 2,
					sEnd: '");}else{' + sLeft
				},
				//else语句，写法为{else}
				'/if': {
					tagG: 'if',
					isEnd: 1,
					sEnd: '");}' + sLeft
				},
				//endif语句，写法为{/if}
				'for': {
					tagG: 'for',
					isBgn: 1,
					rlt: 1,
					sBgn: '");for',
					sEnd: '{' + sLeft
				},
				//for语句，写法为{for(var i=0;i<1;i++)},需要自带括号
				'/for': {
					tagG: 'for',
					isEnd: 1,
					sEnd: '");}' + sLeft
				},
				//endfor语句，写法为{/for}
				'while': {
					tagG: 'while',
					isBgn: 1,
					rlt: 1,
					sBgn: '");while',
					sEnd: '{' + sLeft
				},
				//while语句,写法为{while(i-->0)},需要自带括号
				'/while': {
					tagG: 'while',
					isEnd: 1,
					sEnd: '");}' + sLeft
				} //endwhile语句, 写法为{/while}
			};

			return function(sTmpl, opts) {

				var fun  = tmplFuns[sTmpl];
				if (!fun) {
					var N = -1,
						NStat = []; //语句堆栈;
					var ss = [
						[/\{strip\}([\s\S]*?)\{\/strip\}/g, function(a, b) {
							return b.replace(/[\r\n]\s*\}/g, " }").replace(/[\r\n]\s*/g, "");
						}],
						[/\\/g, '\\\\'],
						[/"/g, '\\"'],
						[/\r/g, '\\r'],
						[/\n/g, '\\n'], //为js作转码.
						[
							/\{[\s\S]*?\S\}/g, //js里使用}时，前面要加空格。
							function(a) {
								a = a.substr(1, a.length - 2);
								for (var i = 0; i < ss2.length; i++) {a = a.replace(ss2[i][0], ss2[i][1]); }
								var tagName = a;
								if (/^(=|.\w+)/.test(tagName)) {tagName = RegExp.$1; }
								var tag = tags[tagName];
								if (tag) {
									if (tag.isBgn) {
										var stat = NStat[++N] = {
											tagG: tag.tagG,
											rlt: tag.rlt
										};
									}
									if (tag.isEnd) {
										if (N < 0) {throw new Error("Unexpected Tag: " + a); }
										stat = NStat[N--];
										if (stat.tagG != tag.tagG) {throw new Error("Unmatch Tags: " + stat.tagG + "--" + tagName); }
									} else if (!tag.isBgn) {
										if (N < 0) {throw new Error("Unexpected Tag:" + a); }
										stat = NStat[N];
										if (stat.tagG != tag.tagG) {throw new Error("Unmatch Tags: " + stat.tagG + "--" + tagName); }
										if (tag.cond && !(tag.cond & stat.rlt)) {throw new Error("Unexpected Tag: " + tagName); }
										stat.rlt = tag.rlt;
									}
									return (tag.sBgn || '') + a.substr(tagName.length) + (tag.sEnd || '');
								} else {
									return '",(' + a + '),"';
								}
							}
						]
					];
					var ss2 = [
						[/\\n/g, '\n'],
						[/\\r/g, '\r'],
						[/\\"/g, '"'],
						[/\\\\/g, '\\'],
						[/\$(\w+)/g, 'opts["$1"]'],
						[/print\(/g, sArrName + '.push(']
					];
					for (var i = 0; i < ss.length; i++) {
						sTmpl = sTmpl.replace(ss[i][0], ss[i][1]);
					}
					if (N >= 0) {throw new Error("Lose end Tag: " + NStat[N].tagG); }
					
					sTmpl = sTmpl.replace(/##7b/g,'{').replace(/##7d/g,'}').replace(/##23/g,'#'); //替换特殊符号{}#
					sTmpl = 'var ' + sArrName + '=[];' + sLeft + sTmpl + '");return ' + sArrName + '.join("");';
					
					//alert('转化结果\n'+sTmpl);
					tmplFuns[sTmpl] = fun = new Function('opts', sTmpl);
				}

				if (arguments.length > 1) {return fun(opts); }
				return fun;
			};
		}()),
    }    

    window.nova = window.nova || nova;
})($);
