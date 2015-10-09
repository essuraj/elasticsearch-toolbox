var resultEditor, queryEditor;
paceOptions = {
    ajax: true,
    document: true,
    eventLag: true
};
$(document).ready(function() {
    initCustomWindowButtons();
    $('.slider').slider({
        full_width: true
    }).slider('start');
    $('.modal-trigger').leanModal();

    resultEditor = initCodeMirror("resultEditor");
    queryEditor = initCodeMirror("queryEditor");
    resultEditor.setOption("readOnly", true)
    queryEditor.setValue(JSON.stringify({
        "query": {
            "bool": {
                "must": [{
                    "match_all": {}
                }],
                "must_not": [],
                "should": []
            }
        },
        "from": 0,
        "size": 10
    }, null, 2));

    setTimeout(function() {
        resultEditor.refresh();
        queryEditor.refresh();
    }, 100);
});
var app = angular.module("est", [], function($provide) {
    // Prevent Angular from sniffing for the history API since it's not supported in packaged apps.
    $provide.decorator('$window', function($delegate) {
        $delegate.history = null;
        return $delegate;
    });
});



function initCodeMirror(element) {

    return CodeMirror.fromTextArea(document.getElementById(element), {
        matchBrackets: true,
        lineNumbers: true,
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

function initCustomWindowButtons() {
    document.getElementById("close-window-button").onclick = function() {
        window.close();
    };
    document.getElementById("max-window-button").onclick = function() {
        if (chrome.app.window.current().isMaximized())
            chrome.app.window.current().restore();
        else
            chrome.app.window.current().maximize();

    };
    document.getElementById("min-window-button").onclick = function() {
        chrome.app.window.current().minimize();
    };
}
