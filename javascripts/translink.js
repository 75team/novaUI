(function() {
    var code = $('code');
    for(var i = 0; i < code.length; i++) {
        var html = code.get(i).innerHTML;
        html = html.replace(/link\[(.*)\]\((.*)\)/g, '<a href="$2" target="_blank">$1</a>');
        code.get(i).innerHTML = html;
    }
})();
