var resultEditor, queryEditor;
$(document).ready(function () {
    initCustomWindowButtons();
    $('.slider').slider({
        full_width: true
    }).slider('start');
    $('.modal-trigger').leanModal();
    
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
    resultEditor.setOption("theme", "ambiance");
    queryEditor.setOption("theme", "ambiance");
});
var app = angular.module("est", [], function ($provide) {
    // Prevent Angular from sniffing for the history API since it's not supported in packaged apps.
    $provide.decorator('$window', function ($delegate) {
        $delegate.history = null;
        return $delegate;
    });
});

var loader = $('.progress');
$.ajaxSetup({
    beforeSend: function () {
        loader.show();
    },
    complete: function () {
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
String.format = function () {
    var s = arguments[0];
    for (var i = 0; i < arguments.length - 1; i++) {
        var reg = new RegExp("\\{" + i + "\\}", "gm");
        s = s.replace(reg, arguments[i + 1]);
    }
    return s;
}

function initCustomWindowButtons() {
    document.getElementById("close-window-button").onclick = function () {
        window.close();
    };
    document.getElementById("max-window-button").onclick = function () {
        if (chrome.app.window.current().isMaximized())
            chrome.app.window.current().restore();
        else
            chrome.app.window.current().maximize();

    };
    document.getElementById("min-window-button").onclick = function () {
        chrome.app.window.current().minimize();
    };
}
var default_themes = ["3024-day",
"eclipse",
"neat",
"tomorrow-night-bright",
"3024-night",
"elegant",
"neo",
"tomorrow-night-eighties",
"ambiance-mobile",
"erlang-dark",
"night",
"twilight",
"ambiance",
"lesser-dark",
"paraiso-dark",
"vibrant-ink",
"base16-dark",
"liquibyte",
"paraiso-light",
"xq-dark",
"base16-light",
"mbo",
"pastel-on-dark",
"xq-light",
"blackboard",
"mdn-like",
"rubyblue",
"zenburn",
"cobalt",
"midnight",
"solarized",
"colorforth",
"monokai",
"the-matrix"
];