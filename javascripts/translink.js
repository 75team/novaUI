(function() {
    var html = document.body.innerHTML;
    html = html.replace(/link\[(.*)\]\((.*)\)/g, '<a href="$2" target="_blank">$1</a>');
    document.body.innerHTML = html;
})();
