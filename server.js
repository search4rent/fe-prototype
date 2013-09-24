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

app.get( "/auth", function ( req, res, next ) {
    console.log( req );
    res.send( 200 );
});

app.get( "/cloudup", function ( req, res, next ) {
    var https = require( "https" );
    var options = {
        hostname: 'www.cloudup.com',
        port: 443,
        path: '/oauth/access_token?grant_type=password',
        method: 'POST'
    };

    var _req = https.request(options, function( res ) {
        res.on('data', function(d) {
            console.log( d );
        });
    });

    _req.end();

    _req.on('error', function(e) {
        console.error(e);
    });
    var accessToken = "lkajsfd";
    res.send( accessToken );
});

app.get( "*", function ( req, res, next ) {
    res.sendfile( path.join( __dirname, "index.html" ) );
});

var port = process.env.PORT || 3000;

app.listen( port, function () {
    console.log( "Listening on " + port );
});