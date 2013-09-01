( function ( ) {

angular.module( "randl.directive", [] );
angular.module( "randl.routes", [] );
angular.module( "randl.controllers", [] );

angular.module( "randl", [ "randl.directive", "randl.controllers", "randl.routes" ] );

angular.module( "randl.controllers" ).controller( "MainController", function ( $scope, $route, $routeParams, $location ) {
    $scope.$route = $route;
    $scope.$location = $location;
    $scope.$routeParams = $routeParams;
});

angular.module( "randl.routes", [ "ngRoute" ] ).config( function ( $routeProvider, $locationProvider ) {

    $routeProvider.when( "/home", {
        templateUrl: "views/home.html",
        controller: "HomeController"
    });

    $routeProvider.when( "/items", {
        templateUrl: "/views/items.html",
        controller: "ItemsController"
    });

    $routeProvider.when( "/item/:id", {
        templateUrl: "/views/item.html",
        controller: "ItemController"
    });

    $routeProvider.when( "/item", {
        templateUrl: "/views/item.html",
        controller: "ItemController"
    });

    $routeProvider.when( "/user/:id", {
        templateUrl: "/views/user.html",
        controller: "UserController"
    });

    $locationProvider.html5Mode( true );
});

angular.module( "randl.controllers" ).controller( "ItemsController", function ( ) {
    console.log( "items" );
});

angular.module( "randl.controllers" ).controller( "ItemController", function ( ) {
    console.log( "item" );
});

angular.module( "randl.controllers" ).controller( "HomeController", function () {
    console.log( "home" );
});

angular.module( "randl.controllers" ).controller( "UserController", function () {
    console.log( "home" );
});


}());