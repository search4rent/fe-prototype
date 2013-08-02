( function ( ) {

angular.module( "randl.directive", [] );

angular.module( "randl", [ "randl.directive" ] );

angular.module( "randl" ).controller( "SearchController", function ( $scope, $http ) {

    $scope.$watch( "query", function ( val ) {

        val || ( val = "" );
        if ( val.length < 3 ) return;

        var query = {
            "suggest" : {
                "text" : val,
                "my-suggest-1" : {
                    "term" : {
                        "size": 4,
                        "field" : "name"
                    }
                }
            }
        };

        $http.get( "/service/search4rent/-/input/" + val ).
            success( function( data ) {
                console.log( data );
                $scope.hits = data.items.map( function ( item ) {
                    return item.title.name[ 0 ];
                });
            });
    });
});

angular.module( "randl.directive" ).directive( "suggestSearch", function ( $http ) {

    var ACTIVE_CLASS = "search-item--active";
    var SUGGEST_CLASS = "search-suggest";

    return {

        link: function( scope, element ) {
            var suggest = element.parent().find( "." + SUGGEST_CLASS );
            var current;

            var offset  = element.offset();
            var height  = element.outerHeight();
            var width   = element.innerWidth();
            
            suggest.css( "top", offset.top + height );
            suggest.css( "width", width );

            scope.$watch( "hits", function ( hits ) {
                hits || ( hits = [] );
                if ( hits.length > 0 ) suggest.show();
            });

            element.bind( "blur", function () {
                suggest.hide();
            });

            element.bind( "keyup", function ( e ) {
                var value;

                // Navigate through results with arrow up and arrow down
                if ( 40 == e.keyCode || 38 == e.keyCode ) {

                    // arrow up
                    if ( 38 == e.keyCode ) {

                        if ( null != current ) {
                            current.removeClass( ACTIVE_CLASS );
                            current = current.prev();
                        }

                    // arrow down
                    } else {

                        if ( null == current ) {

                            firstChild = suggest.children().first()

                            if ( 1 == firstChild.length ) {
                                current = firstChild;
                            } else { return; }
                        } else {
                            
                            current.removeClass( ACTIVE_CLASS );
                            current = current.next();
                        }
                    }

                    element.val( current.children().first().text() );
                    current.addClass( ACTIVE_CLASS );

                // Go to page on Enter
                } else if ( 13 == e.keyCode ) {

                    var link = current.children().first()
                    var href = link.attr( "href" );
                    var title = link.text();

                    history.pushState( {}, title, href );

                // Hide on Escape
                } else if ( 27 == e.keyCode ) {
                    suggest.hide();
                }
            });
        }
    };
});

}());