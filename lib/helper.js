/*
 * Travalizit
 * https://github.com/stefanjudis/travalizit
 *
 * Copyright (c) 2013 stefan judis
 * Licensed under the MIT license.
 */

'use strict';

var request = require( 'request' ),
    Helper  = {};


/**
 * Function to get Travis RepoId by name and owner
 *
 * @param  {String}   host     host of travis api
 * @param  {String}   owner    repo owner
 * @param  {String}   name     repo name
 * @param  {Function} callback callback
 *
 * @tested
 */
Helper.getRepoId = function( host, owner, name, callback ) {
  request.get( {
    json    : true,
    qs      : {
      search : owner + '/' + name
    },
    url     : host + 'repos'
  },  function( error, response, body ) {
    Helper._getRepoIdCallback( error, response, body, callback );
  } );
}


/**
 * Callback for getRepoId function
 *
 * @param  {Object} error    error
 * @param  {Object} response response
 * @param  {Obejct} body     body
 *
 * @tested
 */
Helper._getRepoIdCallback = function( error, response, body, callback ) {
  if ( error ) {
    callback( error );

    return;
  }

  var repoId = body[ 0 ] ? body[ 0 ].id : false;

  if ( repoId ) {
    callback( null, repoId );
  } else {
    callback( {
      code    : 'NOT FOUND',
      message : 'Search responded no id'
    } );
  }
};


module.exports = Helper;
