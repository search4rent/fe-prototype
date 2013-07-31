function SearchController ( $scope ) {
    $scope.remote = "/service/rentandlend/item/_search";
}

angular.module( 'randl', [] ).directive( 'suggestSearch', function ( $http, $document ) {

    function fetch ( remote, query, callback ) {
        var query = {
            "suggest" : {
                "text" : query,
                "my-suggest-1" : {
                    "term" : {
                        "size": 4,
                        "field" : "name"
                    }
                }
            }
        };

        $http.post( remote, query ).
            success( function( data, status, headers, config ) {
                var hits = data.hits.hits.map( function ( hit ) {
                    return hit._source;
                });
                callback( null, hits );
            });
    }

    return {
        require: 'ngModel',
        link: function( scope, element, attributes, controller ) {
            var suggest = element.parent().find( ".search-suggest" );
            var hits;
            var current;

            element.bind( "blur", function () {
                suggest.hide();
            });

            element.bind( "keyup", function ( e ) {
                var value;

                if ( 40 == e.keyCode || 38 == e.keyCode ) {
                    if ( 38 == e.keyCode ) {

                        if ( null != current ) {
                            current.removeClass( "search-item--active" );
                            current = current.prev();
                        }
                    } else {

                        if ( null == current ) {

                            firstChild = suggest.children().first()

                            if ( 1 == firstChild.length ) {
                                current = firstChild;
                            } else { return; }
                        } else {
                            
                            current.removeClass( "search-item--active" );
                            current = current.next();
                        }
                    }

                    element.val( current.children().first().text() );
                    current.addClass( "search-item--active" );
                } else if ( 13 == e.keyCode ) {

                    var link = current.children().first()
                    var href = link.attr( "href" );
                    var title = link.text();

                    history.pushState( {}, title, href );
                } else if ( 27 == e.keyCode ) {

                    suggest.hide();
                } else {

                    value = element.val();
                    current = null;
                    
                    if ( value.length > 2 ) {

                        fetch( scope.remote, element.val(), function ( error, hits ) {
                            scope.hits = hits;

                            suggest.show();

                            var offset = element.offset();
                            var height = element.outerHeight();
                            var width = element.innerWidth();
                            
                            suggest.css( "top", offset.top + height );
                            suggest.css( "width", width );
                        });
                    } else {
                        suggest.hide();
                    }
                }

            });
        }
    };
});