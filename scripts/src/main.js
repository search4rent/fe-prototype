( function ( ) {

angular.module( "randl.directive", [] );
angular.module( "randl.routes", [] );
angular.module( "randl.controllers", [] );

angular.module( "randl", [ "randl.directive", "randl.controllers", "randl.routes" ] );

angular.module( "randl.controllers" ).controller( "MainController", function ( $scope, $route, $routeParams, $location ) {

    $scope.toggleNav = function () {
        $( "nav.main" ).toggleClass( "active" );
    };

    $scope.$route = $route;
    $scope.$location = $location;
    $scope.$routeParams = $routeParams;
});

angular.module( "randl.controllers" ).controller( "ItemsController", function ( ) {
    console.log( "items" );
});

angular.module( "randl.controllers" ).controller( "LendController", function () {
    $( "html" ).removeClass( "rent" );
    $( "html" ).addClass( "lend" );
});

angular.module( "randl.controllers" ).controller( "RentController", function () {
    $( "html" ).removeClass( "lend" );
    $( "html" ).addClass( "rent" );
});

angular.module( "randl.controllers" ).controller( "UserController", function () {
    console.log( "user" );
});

angular.module( "randl.routes", [ "ngRoute" ] ).config( function ( $routeProvider, $locationProvider ) {

    $routeProvider.when( "/", {
        templateUrl: "views/rent.html",
        controller: "RentController"
    });

    $routeProvider.when( "/lend", {
        templateUrl: "views/lend.html",
        controller: "LendController"
    });

    $routeProvider.when( "/items/lend", {
        templateUrl: "/views/items-lend.html",
        controller: "ItemsController"
    });

    $routeProvider.when( "/items/rent", {
        templateUrl: "/views/items-rent.html",
        controller: "ItemsController"
    });

    $routeProvider.when( "/user/:id", {
        templateUrl: "/views/user.html",
        controller: "UserController"
    });

    $locationProvider.html5Mode( true );
});

}());