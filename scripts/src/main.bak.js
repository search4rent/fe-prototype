( function ( ) {

angular.module( "randl.directive", [] );
angular.module( "randl.routes", [] );
angular.module( "randl.controllers", [] );

angular.module( "randl", [ "randl.directive", "randl.controllers", "randl.routes" ] );

// angular.module( "randl.controllers" ).controller( "SearchController", function ( $scope, $http ) {

//     var stopWatching = $scope.$watch( "query", function ( val ) {

//         val || ( val = "" );
//         if ( val.length < 3 ) return;
        
//         // $http.get( "/service/search4rent/-/input/" + val ).

//         //     success( function( data ) {
                
//         //         $scope.hits = data.items.map( function ( item ) {
//         //             return item.title.name[ 0 ];
//         //         });
//         //     });

//         $scope.hits = [
//             "einz",
//             "zwei",
//             "drei"
//         ]
//     });

//     $scope.search = function ( index ) {
//         // @TODO silently change $scope.query
//         // @TODO close suggest on search
//         stopWatching();

//         if ( typeof index !== "undefined" ) {
//             $scope.query = $scope.hits[ index ];
//         }

//         history.pushState( {}, "search", "search?q=" + $scope.query );
//     };

// });

angular.module( "randl.routes", [ "ngRoute" ] ).config( function ( $routeProvider, $locationProvider ) {
    $routeProvider.when( "/test", {
        templateUrl: 'test.html',
        controller: IndexController
    });
});

angular.module( "randl.controllers" ).controller( "IndexController", function ( ) {

});

// angular.module( "randl.directive" ).directive( "suggestSearch", function ( $http ) {

//     var ACTIVE_CLASS = "search-item--active";
//     var SUGGEST_CLASS = "search-suggest";

//     return {

//         link: function( scope, element ) {

//             var suggest = element.parent().find( "." + SUGGEST_CLASS );
//             var current;
//             var firstChild;

//             var offset  = element.offset();
//             var height  = element.outerHeight();
//             var width   = element.innerWidth();
            
//             suggest.css( "top", offset.top + height );
//             suggest.css( "width", width );

//             scope.$watch( "hits", function ( hits ) {

//                 // reset suggest search
//                 current = null;

//                 hits || ( hits = [] );
//                 if ( hits.length > 0 ) suggest.show();
//             });

//             element.bind( "keyup", function ( e ) {

//                 var value;

//                 // Navigate through results with arrow up and arrow down
//                 if ( 40 == e.keyCode || 38 == e.keyCode ) {

//                     // arrow up
//                     if ( 38 == e.keyCode ) {

//                         if ( null != current ) {
//                             current.removeClass( ACTIVE_CLASS );
//                             current = current.prev();
//                         }

//                     // arrow down
//                     } else {

//                         if ( null == current ) {

//                             firstChild = suggest.children().first()

//                             if ( 1 == firstChild.length ) {
//                                 current = firstChild;
//                             } else { return; }
//                         } else {
                            
//                             current.removeClass( ACTIVE_CLASS );
//                             current = current.next();
//                         }
//                     }

//                     // not applied on purpose to not trigger any watchers
//                     // and cause another suggest search
//                     scope.query = current.children().first().text(); 
//                     element.val( scope.query );
//                     current.addClass( ACTIVE_CLASS );

//                 // Hide on Escape & Enter
//                 } else if ( 27 == e.keyCode || 13 == e.keyCode ) {
//                     suggest.hide();
//                 }
//             });
//         }
//     };
// });

}());