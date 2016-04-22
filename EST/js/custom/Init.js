var app = angular.module("est", [],
function($provide) {
    // Prevent Angular from sniffing for the history API since it's not supported in packaged apps.
    $provide.decorator('$window', function($delegate) {
        $delegate.history = null;
        return $delegate;
    });

});

var gp = "https://plus.google.com/share?url=https://chrome.google.com/webstore/detail/elasticsearch-toolbox/focdbmjgdonlpdknobfghplhmafpgfbp";
var fb = "http://www.facebook.com/sharer.php?u=https://chrome.google.com/webstore/detail/elasticsearch-toolbox/focdbmjgdonlpdknobfghplhmafpgfbp";
var tw = "http://twitter.com/home?status=https://chrome.google.com/webstore/detail/elasticsearch-toolbox/focdbmjgdonlpdknobfghplhmafpgfbp";
paceOptions = {
    ajax: true,
    document: true,
    eventLag: true
};

var defaultQuery = {
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
};

String.format = function () {
    var s = arguments[0];
    for (var i = 0; i < arguments.length - 1; i++) {
        var reg = new RegExp("\\{" + i + "\\}", "gm");
        s = s.replace(reg, arguments[i + 1]);
    }
    return s;
};

function share(name) {
    var site = "";
    switch (name) {
        case "Google Plus":
            site = gp;
            break;
        case "Facebook":
            site = fb;
            break;

        case "Twitter":
            site = tw;
            break;

    }
    newwindow = window.open(site, 'Share to ' + name, 'height=640,width=480');
    if (window.focus) {
        newwindow.focus();
    }
    return false;

}

function popuperf() {
    newwindow = window.open(fb, 'Share to ' + name, 'height=640,width=480');
    if (window.focus) {
        newwindow.focus();
    }
    return false;

}

function popupert() {
    newwindow = window.open(tw, 'Share to ' + name, 'height=640,width=480');
    if (window.focus) {
        newwindow.focus();
    }
    return false;

}