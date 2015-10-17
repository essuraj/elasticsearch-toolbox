var gs;
app.controller('MainController', ['$scope', '$http', 'ESService', function ($scope, $http, $ess) {
    $scope.Title = "elasticsearch toolbox";
    $scope.qfieldTemp = [];
    $scope.qAggrTemp = [];
    gs = $scope;

    $scope.connectToES = function (url) {
        Materialize.toast('Connecting to elasticsearch', 500);
        $ess.getIndexes(url).then(function (stat) {
            Materialize.toast('Connected to elasticsearch', 3000, 'green');
            $scope.indexes = Object.keys(stat.data.indices);
            $scope.esStat = stat.data;
            $scope.isConnected = true;
        });
    };

    $scope.changeIndex = function (es) {
        $scope.indexInfo = $scope.indexes[es.selectedIndex];
        var url = String.format("{0}/{1}", es.url, es.selectedIndex);
        $ess.getMappings(url)
            .then(function (response) {
                //console.log("Mappings", response);
                $scope.Mappings = response;

                $scope.allMappings = [];
                var mappingsObj = (response[Object.keys(response)]).mappings;
                $scope.MappingList = Object.keys(mappingsObj);

                $.each($scope.MappingList, function (k, v) {
                    $scope.allMappings = $scope.allMappings.concat(Object.keys(mappingsObj[v].properties));

                });
                //$scope.allMappings.push('_all');

            });

    };
    $scope.changeMapping = function (es) {

        var props = Object.keys($scope.Mappings[es.selectedIndex].mappings[es.selectedMapping].properties);
        $scope.allMappings = props;

    };
    $scope.shareTo = function (site) {
        share(site);
    };
    $scope.dwnloadCSV = function () {

        var rows = [];
        $.each($scope.Output.hits.hits, function (i, res) {
            rows.push(res._source);
        });
        var csv = Papa.unparse(JSON.stringify(rows));

        var uri = 'data:text/csv;charset=utf-8,' + escape(csv);
        var link = document.createElement("a");
        link.href = uri;
        link.style = "visibility:hidden";
        link.download = "op.csv";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    $scope.saveUrl = function (site) {
        if ($scope.settings == undefined) {
            $scope.settings = {
                "theme": "blackboard",
                "useEditor": false
            };
        } else {
            if ($scope.settings.saveURLs) {
                if ($scope.settings.saveURLs.indexOf(site) == -1) {
                    $scope.settings.saveURLs.push(site);
                } else {
                    Materialize.toast('URL already saved.', 3000, 'green');
                    return;
                }

            } else {
                $scope.settings.saveURLs = [site]
            }
        }

        chrome.storage.sync.set({
            'settings': $scope.settings
        }, function () {
            Materialize.toast('URL saved', 3000, 'green');
        });

    };
    $scope.removeUrl = function (site) {

        $.each($scope.settings.saveURLs, function (i, v) {
            if (v == site) {
                $scope.settings.saveURLs.splice(i, 1);
            }
        });
        chrome.storage.sync.set({
            'settings': $scope.settings
        }, function () {
            Materialize.toast('URL removed', 3000, 'green');
        });
    };
    $scope.formatQuery = function () {
        CodeMirror.commands["selectAll"](queryEditor);
        var range = {
            from: queryEditor.getCursor(true),
            to: queryEditor.getCursor(false)
        };
        queryEditor.autoFormatRange(range.from, range.to);
        CodeMirror.commands["singleSelection"](queryEditor);
    };
    $scope.allCheck = function () {
        if ($scope.esQ.field === '_all') {
            $scope.esQ.qType = "query_string";
            $scope.$digest();

        }
    };
    $scope.checkForAll = function (type) {
        if ($scope.esQ.field === '_all' && type !== 'query_string') {
            $scope.esQ.field = '';
            $scope.$digest();
        }
    };
    $scope.addToQuery = function (esQ) {
        if (esQ == undefined || Object.keys(esQ).length != 4) {
            Materialize.toast('You need to fill in all the fields', 3000, 'orange darken-4');
        } else {
            if (esQ.condition.length > 0 && esQ.field.length > 0 && esQ.fieldValue.length > 0 && esQ.qType.length > 0) {
                $scope.qfieldTemp.push(esQ);
                $scope.esQ = {};
            } else {
                Materialize.toast('You need to fill in all the fields', 3000, 'orange darken-4');
            }
        }


    };
    $scope.addAggrToQuery = function (esQA) {

        if (esQA == undefined || Object.keys(esQA).length != 3) {
            Materialize.toast('You need to fill in all the fields to add it to the query', 3000, 'orange darken-4');

        } else {
            if (esQA.name.length > 0 && esQA.field.length > 0 && esQA.type.length > 0) {
                $scope.qAggrTemp.push(esQA);
                $scope.esQA = {};
            } else {
                Materialize.toast('You need to fill in all the fields', 3000, 'orange darken-4');
            }
        }

    };
    $scope.execute = function (es) {
        if (!es.selectedIndex) {
            Materialize.toast('Select an index', 3000, 'orange');
            $('#index').removeClass('shake').removeClass('animated').addClass('shake').addClass('animated');
            return;
        }

        var queryString = '';
        var queryObj = '';
        if ($scope.settings.useEditor) {
            queryString = queryEditor.getValue();
        } else {
            var queryObj = BuildQuery($scope.qfieldTemp, $scope.qAggrTemp)
            queryString = JSON.stringify(queryObj)
        }

        console.debug(queryString);

        var url = String.format("{0}/{1}/_search", es.url, es.selectedIndex);

        $ess.executeQuery(url, queryString)
            .then(function (response) {
                //console.log("Q Result", response);
                $scope.Output = response;
                if ($scope.Output.hits.hits.length == 0) {
                    Materialize.toast('No results found', 3000, 'orange darken-4');

                }
                queryEditor.setValue(queryString);
                resultEditor.setValue(JSON.stringify(response, null, 2));
                setTimeout(function () {

                    resultEditor.refresh();
                    queryEditor.refresh();
                }, 1);
                $('ul.tabs').tabs('select_tab', 'res');
            });
    };

    $scope.saveSettings = function (settings) {
        resultEditor.setOption("theme", settings.theme);
        queryEditor.setOption("theme", settings.theme);
        setTimeout(function () {
            resultEditor.refresh();
            queryEditor.refresh();
        }, 1);
        if (settings)
            chrome.storage.sync.set({
                'settings': settings
            }, function () {
                Materialize.toast('Settings saved', 3000, 'green');
            });
    };
}]);

function BuildQuery(queryParams, aggParams) {
    var queryTemplate = $.parseJSON(queryEditor.getValue());

    //Adding selected fields
    var jQfields = $('.fields:checked');
    var fields = [];
    $.each(jQfields, function (k, field) {
        fields.push($(field).prop('name'));
    });
    if (fields.length > 0)
        queryTemplate.fields = fields;

    //Adding Query Params
    queryTemplate.query.bool = GetQuery(queryParams);
    queryTemplate.aggregations = GetAggQuery(aggParams);

    queryTemplate.from = gs.esQP.from;
    queryTemplate.size = gs.esQP.size;

    return queryTemplate;
}

function GetQuery(queryParams) {
    var groups = {};
    var mustList = [],
        mustNotList = [],
        shouldList = [];
    $.each(queryParams, function (i, esQ) {

        switch (esQ.condition) {
            case "must":
                {
                    mustList.push(QueryObjGenerator(esQ.qType, esQ.field, esQ.fieldValue));
                    break;
                }
            case "must_not":
                {
                    mustNotList.push(QueryObjGenerator(esQ.qType, esQ.field, esQ.fieldValue));
                    break;
                }
            case "should":
                {
                    shouldList.push(QueryObjGenerator(esQ.qType, esQ.field, esQ.fieldValue));
                    break;
                }
            default:
                {
                    throw "";
                }
        }

    });

    return {
        "must": mustList,
        "must_not": mustNotList,
        "should": shouldList
    };

}

function GetAggQuery(aggParams) {
    var agg = [];
    $.each(aggParams, function (i, esQA) {
        agg.push(aggGenerator(esQA));
    });
    var AllAggTogether = agg.join();
    return $.parseJSON('{' + AllAggTogether + '}');
}

function QueryObjGenerator(type, field, value) {
    var objStr = "";
    if (type == "query_string") {
        objStr = '{"' + type + '":{"default_field":"' + field + '","query":"' + value + '"}}';

    } else {
        objStr = '{"' + type + '":{"' + field + '":"' + value + '"}}';
    }
    var json = $.parseJSON(objStr);
    //console.log(type, json);
    return json;
}

function aggGenerator(esQA) {


    var objStr = String.format('"{0}":{"{1}":{"field":"{2}"}}', esQA.name, esQA.type, esQA.field);

    //   var json = $.parseJSON(objStr);
    //console.log(type, json);
    return objStr;
}
