( function ( ) {

function activateRent () {
    $( "html" ).removeClass( "lend" );
    $( "html" ).addClass( "rent" );
}

function activateLend () {
    $( "html" ).removeClass( "rent" );
    $( "html" ).addClass( "lend" );
}

angular.module( "randl.directive", [] );
angular.module( "randl.routes", [] );
angular.module( "randl.controllers", [] );

angular.module( "randl", [ "randl.directive", "randl.controllers", "randl.routes" ] );

angular.module( "randl.controllers" ).controller( "MainController", function ( $scope, $route, $routeParams, $location ) {

    $scope.toggleNav = function () {
        $( "nav.main" ).toggleClass( "active" );
    };

    $scope.$route = $route;
    $scope.$routeParams = $routeParams;
});

angular.module( "randl.controllers" ).controller( "LendItemsController", function ( $scope, $routeParams ) {
    activateLend();
    $scope.query = $routeParams.q;
});

angular.module( "randl.controllers" ).controller( "RentItemsController", function ( $scope, $routeParams, $location, $http ) {
    activateRent();
    $scope.query = $routeParams.q;

    function search ( q ) {
        var url = "/searchservice-0.0.1-SNAPSHOT/search/-/search/" + q + "/1/5";
        $http.get( url ).
            success( function( data, status, headers, config ) {
                $scope.items = data.list;
            }).
            error( function( data, status, headers, config ) {
                throw new Error( "Search after " + q + " failed. " + status );
            });
    }

    search( $routeParams.q );

    $scope.submit = function () {
        $location.search("q", $scope.query );
    };
});

angular.module( "randl.controllers" ).controller( "LendController", function ( $scope, $location ) {
    activateLend();

    $scope.submit = function () {
        $location.url( "/items/lend?q=" + this.query );
    };
});

angular.module( "randl.controllers" ).controller( "RentController", function ( $scope, $location ) {
    activateRent();

    $scope.submit = function () {
        $location.url( "/items/rent?q=" + this.query );
    };
});

angular.module( "randl.controllers" ).controller( "UserController", function () {
    console.log( "user" );
});

angular.module( "randl.controllers" ).controller( "ItemController", function () {
    console.log( "item" );
});

angular.module( "randl.controllers" ).controller( "ItemsNewController", function ( $scope ) {

    $scope.upload = function () {
        
        var files = $( ":file.new-item__picture" )[ 0 ].files;
        if ( files.length == 0 ) return alert( "choose a file" );

        var uri = "/upload";
        var xhr = new XMLHttpRequest();
        var form = new FormData();
        
        xhr.open( "POST", uri, true );
        xhr.onreadystatechange = function() {
            if ( xhr.readyState == 4 && xhr.status == 200 ) {
                var data = JSON.parse( xhr.responseText );
                $( ".new-item__img" ).attr( "src", data.resized );
            }
        };
        xhr.upload.addEventListener( "progress", function( e ) {
            if ( e.lengthComputable ) {
                var percentage = Math.round( ( e.loaded * 100 ) / e.total );
                console.log( percentage );
            }
        }, false );

        form.append( "image", files[ 0 ] );
        
        xhr.send( form );
    };
});

angular.module( "randl.routes", [ "ngRoute" ] ).config( function ( $routeProvider, $locationProvider ) {

    $routeProvider.when( "/", {
        templateUrl: "views/rent.html",
        controller: "RentController"
    });

    $routeProvider.when( "/item", {
        templateUrl: "views/item.html",
        controller: "ItemController"
    });

    $routeProvider.when( "/lend", {
        templateUrl: "views/lend.html",
        controller: "LendController"
    });

    $routeProvider.when( "/items/lend", {
        templateUrl: "/views/items-lend.html",
        controller: "LendItemsController"
    });

    $routeProvider.when( "/items/rent", {
        templateUrl: "/views/items-rent.html",
        controller: "RentItemsController"
    });

    $routeProvider.when( "/items/new", {
        templateUrl: "/views/items-new.html",
        controller: "ItemsNewController"
    });

    $routeProvider.when( "/user/:id", {
        templateUrl: "/views/user.html",
        controller: "UserController"
    });

    $locationProvider.html5Mode( true );
});

}());