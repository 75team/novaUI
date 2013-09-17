;(function($) {
	$.extend($, {

		// 原型继承
		inheritPrototype: function(subType, superType) {
			function F() {};
			F.prototype = superType.prototype;

			var prototype = new F();
			prototype.constructor = subType;

			subType.prototype = prototype;
		}, 

		isObject: function(obj) {

		}

	});

	$.each("String Boolean RegExp Number Date Object Null Undefined".split(" "), function( i, name ){
        var fn;

        if( 'is' + name in $ ) return;//already defined then ignore.

        switch (name) {
            case 'Null':
                fn = function(obj){ return obj === null; };
                break;
            case 'Undefined':
                fn = function(obj){ return obj === undefined; };
                break;
            default:
                fn = function(obj){ return new RegExp(name + ']', 'i').test( toString(obj) )};
        }
        $['is'+name] = fn;
    });

})($);