function RentsController( $scope, $http ) {
    // $scope.rents = [
    //     {
    //         "description": "einz"
    //     },
    //     {
    //         "description": "zwei"
    //     },
    //     {
    //         "description": "drei"
    //     }
    // ];

    var query = {
        "query": {
            "match_all": {}
        }
    };

    $http.post( "/service/rentandlend/item/_search", query ).
        success( function( data, status, headers, config ) {
            console.log( data.hits );
            $scope.rents = data.hits.hits.map( function ( hit ) {
                return hit._source;
            });
        });
}