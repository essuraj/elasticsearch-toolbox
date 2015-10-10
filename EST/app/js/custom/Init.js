
var app = angular.module("est", [], function ($provide) {
    // Prevent Angular from sniffing for the history API since it's not supported in packaged apps.
    $provide.decorator('$window', function ($delegate) {
        $delegate.history = null;
        return $delegate;
    });
});

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
