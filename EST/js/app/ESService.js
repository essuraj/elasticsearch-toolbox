app.service('ESService', ['$http','esFactory', function ($http,esFactory) {

    this.getIndexes = function (url) {
        return $http.get(url + "/_stats")
            .then(
                function (data) {
                    $('nav>div').removeClass("blue-grey darken-4").addClass('blue darken-4');
                    return data;
                },
                function (httpError) {
                    $('nav>div').removeClass("blue darken-4").addClass('blue-grey darken-4');
                    gs.isConnected = false;
                    Materialize.toast('Unable to connect to elasticsearch', 3000, 'red');

                    throw httpError;
                });
    };

    this.getMappings = function (url) {
        return $http.get(url)
            .then(
                function (data) {
                    return data.data;
                },
                function (httpError) {

                    Materialize.toast(httpError.data.error, 3000, 'red');
                    throw httpError;
                });

    };

    this.executeQuery = function (url, query) {
        return $http.post(url, query)
            .then(
                function (data) {
                    return data.data;
                },
                function (httpError) {
                    return httpError.data.error;
                    // Materialize.toast("Query Error", 3000, 'red');
                    // throw httpError;
                });


    };
}]);
