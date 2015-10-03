var gs;

app.controller('MainController', ['$scope', '$http', 'ESService', function ($scope, $http, $ess) {
    $scope.Title = "elasticsearch toolbox";
    $scope.indexInfo = {};
    gs = $scope;
    $scope.connectToES = function (url) {
        Materialize.toast('Connecting to elasticsearch', 2000);
        $ess.getIndexes(url).then(function (stat) {
            Materialize.toast('Connected to elasticsearch', 3000, 'green');
            $scope.indexes = Object.keys(stat.data.indices);
            $scope.esStat = stat.data;
            $scope.isConnected = true;
        });


    };


    $scope.change = function (es) {
        $scope.indexInfo = $scope.indexes[es.selectedIndex];
        var url = String.format("{0}/{1}", es.url, es.selectedIndex);
        $ess.getMappings(url)
            .then(function (response) {
                console.log("Mappings", response);
                $scope.Mappings = response;
            });



    };
    $scope.execute = function (es) {

        var url = String.format("{0}/{1}/_search", es.url, es.selectedIndex);
        $ess.executeQuery(url, queryEditor.getValue())
            .then(function (response) {
                console.log("Q Result", response);
                $scope.Output = response;
                resultEditor.setValue(JSON.stringify(response, null, 2));
            });



    };
}]);
