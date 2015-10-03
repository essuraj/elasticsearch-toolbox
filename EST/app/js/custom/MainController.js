var gs;

app.controller('MainController', ['$scope', '$http', 'ESService', function ($scope, $http, $ess) {
    $scope.Title = "elasticsearch toolbox";
    $scope.qfieldTemp = [];
    $scope.indexInfo = {};
    gs = $scope;
    chrome.storage.sync.get("settings", function (result) {
        console.log(result);
        $scope.settings = result.settings;
        $scope.$digest();
    })
    $scope.connectToES = function (url) {
        Materialize.toast('Connecting to elasticsearch', 2000);
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
                var mappingsObj = (response[Object.keys(response)]).mappings;
                // $scope.MappingProperties = Object.keys(mappingsObj.properties);
                $scope.MappingList = Object.keys(mappingsObj);
            });



    };
    $scope.changeMapping = function (es) {

        var props = Object.keys($scope.Mappings[es.selectedIndex].mappings[es.selectedMapping].properties);
        $scope.MappingProps = props;

    };

    $scope.execute = function (es) {
        var query = $.parseJSON(queryEditor.getValue());
        var url = String.format("{0}/{1}/_search", es.url, es.selectedIndex);
        var jQfields = $('.fields:checked');
        var fields = [];
        $.each(jQfields, function (k, field) {
            fields.push($(field).prop('name'));
        });
        if (fields.length > 0)
            query.fields = fields;
        $ess.executeQuery(url, JSON.stringify(query))
            .then(function (response) {
                console.log("Q Result", response);
                $scope.Output = response;
                resultEditor.setValue(JSON.stringify(response, null, 2));
                $('#result').openModal();
            });



    };
    $scope.saveSettings = function (settings) {
        resultEditor.setOption("theme", settings.theme);
        queryEditor.setOption("theme", settings.theme);
        if (settings)
            chrome.storage.sync.set({ 'settings': settings }, function () {
                Materialize.toast('Settings saved', 3000, 'green');
            });
    };
}]);
