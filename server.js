var express = require( "express" );
var path = require( "path" );
var app = express();
var httpProxy = require( "http-proxy" );
var routingProxy = new httpProxy.RoutingProxy();

function proxy ( pattern, host, port ) {
    
    return function ( req, res, next ) {
        if ( req.url.match( pattern ) ) {
            routingProxy.proxyRequest( req, res, {
                host: host,
                port: port
            });
        } else {
            next();
        }
    }
}
//http://line030.de:8181/searchservice-0.0.1-SNAPSHOT/search/-/search/name/1/3
app.use( proxy( "/searchservice*", "line030.de", 8181 ) ); 
app.use( "/assets", express.static( __dirname ) );
app.use( "/views", express.static( path.join( __dirname, "views"  ) ) );

app.get( "*", function ( req, res, next ) {
    res.sendfile( path.join( __dirname, "index.html" ) );
});

var port = process.env.PORT || 3000;

app.listen( port, function () {
    console.log( "Listening on " + port );
});