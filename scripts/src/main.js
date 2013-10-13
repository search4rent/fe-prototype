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

angular.module( "randl.controllers" ).controller( "UserController", function ( $routeParams ) {
    console.log( "user", $routeParams.id );
});

angular.module( "randl.controllers" ).controller( "ItemsDetailController", function ( $scope, $routeParams ) {
    console.log( "item", $routeParams.id );

    $scope.condition = "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod " +
            "tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et " + 
            "accusam et justo duo dolores et ea."

    $scope.title = "Playstation mit 4 Controllern";

    $scope.location = "Konstanz";

    $scope.price = "225,99"

    $scope.picture = "/assets/img/temp_ps4.jpg"
});

angular.module( "randl.controllers" ).controller( "ItemsNewController", function ( $scope, $http ) {

    function uploadPicture () {
        return console.log( "upload" );
        
        var files = this.files;

        if ( files.length == 0 ) return alert( "choose a file" );

        var uri = "/upload";
        var xhr = new XMLHttpRequest();
        var form = new FormData();
        
        xhr.open( "POST", uri, true );
        xhr.onreadystatechange = function() {
            if ( xhr.readyState == 4 && xhr.status == 200 ) {
                var data = JSON.parse( xhr.responseText );
                $scope.form.picture = data.resized;
                $scope.$apply();
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

    $scope.choosePicture = function () {
        $( ".js-new-item__file" ).click();
    };

    $scope.upload = function () {
        $http.post( "/searchservice-0.0.1-SNAPSHOT/search/-/item/1123", {} )
        _d = {
            id: "63ae0c63-2342-4bb0-9b16-914001ad7d0f",
            description: $scope.condition,
            location: null,
            name: $scope.title,
            picture: [ $scope.picture ],
            price: $scope.price,
            category: []
        }
        console.dir( $scope.form );
    };

    $( ".js-new-item__file" ).change( uploadPicture );

    $scope.form = {
        picture: "http://placehold.it/400x200"
    };
});

angular.module( "randl.controllers" ).controller( "ItemsLendController", function ( $scope, $routeParams ) {
    activateLend();
    $scope.query = $routeParams.q;
});

angular.module( "randl.controllers" ).controller( "ItemsRentController", function ( $scope, $routeParams, $location, $http ) {
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
        $location.search( "q", $scope.query );
    };
});

angular.module( "randl.controllers" ).controller( "MessagesController", function ( $scope ) {
    var messaging = new Firebase( "https://randl-storage.firebaseIO.com/messaging" );

    $scope.reply = function () {
        var messages = messaging.child( "messages" );
        var message = messages.push( {
            conversationId: $scope.conversation.id,
            from: $scope.user.id,
            to: "2",
            body: this.message,
            time: new Date().getTime(),
            read: false
        });

        message.once( "value", function ( snapshot ) {
            console.log( "test" );
            var conversation = messaging.child( "conversations" ).child( $scope.conversation.id );
            conversation.child( snapshot.name() ).set( true );
        });
    
        $scope.message = "";
    };
});

angular.module( "randl.controllers" ).controller( "AccountController", function ( $scope, $location ) {
    
    var randl = new Firebase( "https://randl-storage.firebaseIO.com" );

    var auth = new FirebaseSimpleLogin( randl, function( error, user ) {

        if ( error != null ) throw error;
        if ( user == null ) return $location.url( "/auth" );

        $scope.auth = user;

        fetchUserData();
        if ( typeof $scope.conversations === "undefined" ) listenToMessages();

    });

    $scope.logout = function () {
        auth.logout();
    };

    $scope.delete = function () {
        alert( "Account deletion doesn't yet work" );
    };

    function listenToMessages () {
        $scope.conversations = [];
            
        var messaging = randl.child( "messaging" );
        messaging.child( "subscribers" ).child( $scope.auth.id ).on( "child_added", function ( snapshot ) {

            var conversationId = snapshot.name();
            var conversation = { id: conversationId, messages: [] };
            $scope.conversations.push( conversation );

            messaging.child( "conversations" ).child( conversationId ).on( "child_added", function ( snapshot ) {

                messaging.child( "messages" ).child( snapshot.name() ).on( "value", function ( snapshot ) {

                    var message = snapshot.val();
                    message.from = ( message.from == $scope.auth.id ) ? "Me" : "Hidden User";

                    $scope.$apply( function () {
                        conversation.messages.push( message );
                    });
                });
            });
        });
    }

    function fetchUserData () {
        $scope.lending = 0;
        $scope.renting = 0;
        $scope.user = {
            nick: "randl",
            email: $scope.auth.email,
            password: "******************"
        };
    }
});

angular.module( "randl.controllers" ).controller( "AuthController", function ( $scope, $location ) {

    var randl = new Firebase( "https://randl-storage.firebaseIO.com" );

    var auth = new FirebaseSimpleLogin( randl, function( error, user ) {
        
        if ( error != null ) throw error;

        if ( user != null ) {

            $scope.$apply( function () {
                $location.url( "/account" );
            });
        }
    });

    $scope.register = function () {
        auth.createUser( $scope.registration__email, "test", function( error, user ) {
            if ( error != null ) throw error;
        });
    };

    $scope.login = function () {
        auth.login( "password", {
            email: $scope.login__email,
            password: $scope.login__password,
            rememberMe: true
        });
    };
});

angular.module( "randl.routes", [ "ngRoute" ] ).config( function ( $routeProvider, $locationProvider ) {

    $routeProvider.when( "/", {
        templateUrl: "/views/rent.html",
        controller: "RentController"
    });

    $routeProvider.when( "/lend", {
        templateUrl: "/views/lend.html",
        controller: "LendController"
    });

    $routeProvider.when( "/items/new", {
        templateUrl: "/views/items-new.html",
        controller: "ItemsNewController"
    });

    $routeProvider.when( "/items/lend", {
        templateUrl: "/views/items-lend.html",
        controller: "ItemsLendController"
    });

    $routeProvider.when( "/items/rent", {
        templateUrl: "/views/items-rent.html",
        controller: "ItemsRentController"
    });

    $routeProvider.when( "/items/:id", {
        templateUrl: "/views/items-detail.html",
        controller: "ItemsDetailController"
    });

    $routeProvider.when( "/auth", {
        templateUrl: "/views/auth.html",
        controller: "AuthController"
    });

    $routeProvider.when( "/account", {
        templateUrl: "/views/account.html",
        controller: "AccountController"
    });


    $routeProvider.when( "/messages", {
        templateUrl: "/views/messages.html",
        controller: "MessagesController"
    });

    // $routeProvider.otherwise( { redirectTo: "/" } );

    $locationProvider.html5Mode( true );
});

}());