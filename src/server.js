'use strict';

var cluster = require( 'cluster' );

if ( cluster.isMaster ) {
  var cpuCount = require( 'os' ).cpus().length;
  console.log( 'number of cpus: ' + cpuCount + '\n' );

  for ( var i = 0; i < cpuCount; ++i ) {
    cluster.fork();
  }

  cluster.on( 'exit', function( worker ) {
    console.log( 'Worker %d died', worker.id );
    cluster.fork();
  } );
} else {
  var express    = require( 'express' ),
      bodyParser = require( 'body-parser' ),
      jsonFile   = require( 'jsonfile' ),
      app        = express();

  var genericPayload = require( './simple.json' );

  app.get( '/simple/:id', function( req, res ) {
    console.log( 'get request received' );
    console.log( 'cluster id: ' + cluster.worker.id );
    console.log( req.headers );
    console.log( req.params );

    if ( req.params.id < genericPayload.people.length ) {
      res.status( 200 ).send( genericPayload.people[req.params.id] );
    } else {
      res.status( 404 ).send( req.params.id + ' is invalid' );
    }
  } );

  app.use( bodyParser.json() );
  app.post( '/simple', function( req, res ) {
    console.log( 'get request received' );
    console.log( 'cluster id: ' + cluster.worker.id );
    console.log( req.headers );
    console.log( req.params );
    console.log( req.body );

    var file = 'src/tmp_' + cluster.worker.id + '.json',
        obj = req.body;

    jsonFile.writeFile( file, obj, { spaces: 2 }, function( err ) {
      if ( err ) {
        console.log( err );
        res.status( 400 ).send( err );
      } else {
        res.status( 202 ).send( 'POST data accepted\nNode: ' + cluster.worker.id );
      }
    } );
  } );

  app.listen( 3000, function() {
    console.log(
      '***************************************\n' +
      'app server is running on port 3000\n\n' +
      'clusterid: ' + cluster.worker.id + '\n\n' +
      'End Point:\n/simple/:id\n/simple\n\nMETHODS:\nGET\nPOST\n\n' +
      '***************************************\n'
     );
  } );
}
