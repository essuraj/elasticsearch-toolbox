var resultEditor, queryEditor;
$(document).ready(function() {
    resultEditor = initCodeMirror("resultEditor");
    queryEditor = initCodeMirror("queryEditor");
    queryEditor.setValue(JSON.stringify({
        "query": {
            "bool": {
                "must": [{
                    "query_string": {
                        "default_field": "_all",
                        "query": "as"
                    }
                }],
                "must_not": [],
                "should": []
            }
        },
        "from": 0,
        "size": 10
    }, null, 2));
    resultEditor.setOption("theme", "neat");
});
var app = angular.module("est", [], function($provide) {
    // Prevent Angular from sniffing for the history API since it's not supported in packaged apps.
    $provide.decorator('$window', function($delegate) {
        $delegate.history = null;
        return $delegate;
    });
});

var loader = $('.progress');
$.ajaxSetup({
    beforeSend: function() {
        loader.show();
    },
    complete: function() {
        loader.hide();
    }
});


function initCodeMirror(element) {

    return CodeMirror.fromTextArea(document.getElementById(element), {
        matchBrackets: true,
        autoCloseBrackets: true,
        mode: "application/ld+json",
        lineWrapping: true
    });
}
String.format = function() {
    var s = arguments[0];
    for (var i = 0; i < arguments.length - 1; i++) {
        var reg = new RegExp("\\{" + i + "\\}", "gm");
        s = s.replace(reg, arguments[i + 1]);
    }
    return s;
}
