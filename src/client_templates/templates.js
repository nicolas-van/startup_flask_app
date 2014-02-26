(function() {
var declare = function() {
return (function() {
    var __ematches = {'&': '&amp;','<': '&lt;','>': '&gt;','"': '&quot;',"'": '&#x27;','/': '&#x2F;'};
    var escape_function = function(s) {return ('' + (!s ? '' : s)).replace(/[&<>"'/]/g, function(a){return __ematches[a];});};
    return function(a) {
        var o = '';
        o += '\n';
        var sample = function(a) {
            var o = '';
            o += '\n';
            o += 'Hello\n';
            return o;
        };
        o += '\n';
        return o;
    };
})();
};
if (typeof(define) !== 'undefined') {
    define([], declare);
} else if (typeof(exports) !== 'undefined') {
    module.exports = declare();
} else {
    templates = declare();
}
})();