var express = require( "express" );
var path = require( "path" );
var app = express();

app.use( "/assets", express.static( __dirname ) );
app.use( "/views", express.static( path.join( __dirname, "views"  ) ) );

app.get( "*", function ( req, res, next ) {
    res.sendfile( path.join( __dirname, "index.html" ) );
});

app.listen( 3000 );