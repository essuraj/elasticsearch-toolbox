var gs;

app.controller('MainController', ['$scope', '$http', 'ESService', function ($scope, $http, $ess) {
    $scope.Title = "elasticsearch toolbox";
    $scope.qfieldTemp = [];
    $scope.indexInfo = {};
    gs = $scope;
    chrome.storage.sync.get("settings", function (result) {
        console.log(result);
        $scope.settings = result.settings;
        if (result.settings)
            if (result.settings.theme) {
                resultEditor.setOption("theme", result.settings.theme);
                queryEditor.setOption("theme", result.settings.theme);
                setTimeout(function () {
                    resultEditor.refresh();
                    queryEditor.refresh();
                }, 1);
            }
        $scope.$digest();
    })
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
                console.log("Mappings", response);
                $scope.Mappings = response;

                $scope.allMappings = [];
                var mappingsObj = (response[Object.keys(response)]).mappings;
                // $scope.MappingProperties = Object.keys(mappingsObj.properties);
                $scope.MappingList = Object.keys(mappingsObj);

                $.each($scope.MappingList, function (k, v) {
                    //var map=new Object();
                    //map.doc=v;
                    $scope.allMappings = $scope.allMappings.concat(Object.keys(mappingsObj[v].properties));

                });


            });



    };
    $scope.changeMapping = function (es) {

        var props = Object.keys($scope.Mappings[es.selectedIndex].mappings[es.selectedMapping].properties);
        $scope.allMappings = props;

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
    $scope.execute = function (es) {
        if (!es.selectedIndex) {
            Materialize.toast('Select an index', 3000, 'orange');
            $('#index').removeClass('shake').removeClass('animated').addClass('shake').addClass('animated');
            return;
        }
        var query = BuildQuery($scope.qfieldTemp)
        queryEditor.setValue(JSON.stringify(query, null, 2));
        console.debug(query);
        var url = String.format("{0}/{1}/_search", es.url, es.selectedIndex);

        $ess.executeQuery(url, JSON.stringify(query))
            .then(function (response) {
                console.log("Q Result", response);
                $scope.Output = response;
                resultEditor.setValue(JSON.stringify(response, null, 2));
                setTimeout(function () {
                    resultEditor.refresh();
                    queryEditor.refresh();
                }, 1);
                $('#result').openModal();
            });



    };
    $scope.saveSettings = function (settings) {
        resultEditor.setOption("theme", settings.theme);
        queryEditor.setOption("theme", settings.theme);
        resultEditor.refresh();
        queryEditor.refresh();
        if (settings)
            chrome.storage.sync.set({
                'settings': settings
            }, function () {
                Materialize.toast('Settings saved', 3000, 'green');
            });
    };
}]);

function BuildQuery(queryParams) {
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

    return queryTemplate;
}

function GetQuery(queryParams) {
    var groups = {};
    var mustList = [], mustNotList = [], shouldList = [];
    $.each(queryParams, function (i, esQ) {

        switch (esQ.condition) {
            case "must": {
                mustList.push(QueryObjGenerator(esQ.qType, esQ.field, esQ.fieldValue));
                break;
            }
            case "must_not": {
                mustNotList.push(QueryObjGenerator(esQ.qType, esQ.field, esQ.fieldValue));
                break;
            }
            case "should": {
                shouldList.push(QueryObjGenerator(esQ.qType, esQ.field, esQ.fieldValue));
                break;
            }
            default: {
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

function QueryObjGenerator(type, field, value) {
    var objStr = '{"' + type + '":{"' + field + '":"' + value + '"}}';
   
    console.log(objStr);

    var json = $.parseJSON(objStr);
    console.log(json);
    return json;
}