var express         = require( "express" );
var path            = require( "path" );
var fs              = require( "fs" );
var app             = express();
var httpProxy       = require( "http-proxy" );
var routingProxy    = new httpProxy.RoutingProxy();


var cloudinary = require("cloudinary");
cloudinary.config({ 
    cloud_name: "hd0wxiur1", 
    api_key: "264668386615174", 
    api_secret: "p9t0u1-VySGbDlFd4gOyMfm1gng" 
});

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
app.use( express.bodyParser() )
app.use( proxy( "/searchservice*", "line030.de", 8181 ) );
app.use( "/assets", express.static( __dirname ) );
app.use( "/views", express.static( path.join( __dirname, "views"  ) ) );

app.post( "/upload", function( req, res, next ) {
    var stream = cloudinary.uploader.upload_stream( function( result ) {

        console.log( result );

        var img = cloudinary.url(result.public_id, {
            format: "png",
            width: 320,
            height: 240,
            crop: "fill"
        });

        var data = {
            original: result.url,
            resized: img
        };

        res.json( data );
        
    }, { public_id: req.body.title } );

    fs.createReadStream( req.files.image.path, { encoding: "binary" } )
        .on( "data", stream.write ).on( "end", stream.end );
});

app.get( "*", function ( req, res, next ) {
    res.sendfile( path.join( __dirname, "index.html" ) );
});

var port = process.env.PORT || 3000;

app.listen( port, function () {
    console.log( "Listening on " + port );
});