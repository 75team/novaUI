/**
 * a minimal js file loader 
 */
(function(window){

    /* default modules */
    var modules = {
        'jquery': {
            'url': 'http://s0.qhimg.com/lib/jquery/183.js',
            'checker': function() {return !! window.jQuery}
        }
    };

    var queque = [];
    var callbacks = [];
    var running = false;

    /* load a js file and execute callback */
    function loadJs(url, callback) {
        var d = document;
        var head = d.getElementsByTagName('head')[0] || d.documentElement,
            script = d.createElement('script'),
            done = false;
        script.src = url;
        script.onerror = script.onload = script.onreadystatechange = function() {
            if (!done && (!this.readyState || this.readyState == "loaded" || this.readyState == "complete")) {
                done = true;
                if (callback) {
                    callback();
                }
                script.onerror = script.onload = script.onreadystatechange = null;
                head.removeChild(script);
            }
        };
        head.insertBefore(script, head.firstChild);
    };

    /* execute callback function */
    function execCallback(module) {
        var i, j, callback, requires;
        for (i = 0; i < callbacks.length; i++) {
            callback = callbacks[i];
            requires = callback.requires;
            for (j = 0; j < requires.length; j++) {
                if (requires[j] == module) break;
            }
            requires.splice(j, 1);
            if (requires.length === 0) { /* 所有依赖模块都有了 */
                callback.fun();
                callbacks.splice(i, 1);
            }
        }
    }

    /* load multiple modules in order */
    function loadsJsInOrder() {
        var module = queque.splice(0,1)[0];
        var config = modules[module];
        var onJsLoaded = function() {
            execCallback(module);
            config.loaded = true;
            if (queque.length) {
                loadsJsInOrder();
            } else {
                running = false;
            }
        };
        if (!config) { /* 未知模块 */
            return;
        }
        running = true;

        if (config.loaded || (config.checker && config.checker())) {
            onJsLoaded(module);
        } else {
            loadJs(config.url, function(){
                onJsLoaded(module);
            })
        }
        
    };


    /* interfaces */
    window._loader = {

        /**
         * add a module
         */
        add: function(name, url, checker) {
            if (!modules[name]) {
                modules[name] = {
                    url: url,
                    checker: checker
                }
            }
        },

        /**
         * use modules
         */
        use: function(names, callback) {
            names = names.split(/\s*,\s*/g),
            queque = queque.concat(names);
            callbacks.push({
                requires: names,
                fun: callback
            });
            if (!running) {
                loadsJsInOrder();
            }
        }

    };
})(window);