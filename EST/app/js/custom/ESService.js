app.service('ESService', ['$http', function ($http) {

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
                    throw httpError.status + " : " +
                        httpError.data;
                });
    };
    this.getMappings = function (url) {
        return $http.get(url)
            .then(
                function (data) {

                    return data.data;
                },
                function (httpError) {

                    throw httpError.status + " : " +
                        httpError.data;
                });

    };
    this.executeQuery = function (url, query) {
        return $http.post(url, query)
            .then(
                function (data) {
                    console.log(data);
                    return data.data;
                },
                function (httpError) {


                    throw httpError.status + " : " +
                        httpError.data;
                });


    };
}]);
