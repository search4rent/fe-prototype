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

angular.module( "randl.controllers" ).controller( "RentItemsController", function ( $scope, $routeParams ) {
    activateRent();
    $scope.query = $routeParams.q;
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
        controller: "LendItemsController"
    });

    $routeProvider.when( "/items/rent", {
        templateUrl: "/views/items-rent.html",
        controller: "RentItemsController"
    });

    $routeProvider.when( "/user/:id", {
        templateUrl: "/views/user.html",
        controller: "UserController"
    });

    $locationProvider.html5Mode( true );
});

}());