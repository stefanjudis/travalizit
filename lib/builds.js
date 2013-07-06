/*
 * Travalizit
 * https://github.com/stefanjudis/travalizit
 *
 * Copyright (c) 2013 stefan judis
 * Licensed under the MIT license.
 */

'use strict';

var request = require( 'request' ),
    helper  = require( './helper' );


/**
 * Constructor to create a new Repos object
 *
 * @param  {[Object} options options
 *
 * valid options are:
 * {
 *   host   : 'http://something.com',
 *   repoId : '123456'
 * }
 *
 * @tested
 */
var Builds = function( options ) {
  var host;

  options = options || {};

  this.host   = host = options.host || 'https://api.travis-ci.org/';
  this.repoId = options.repoId;
  this.owner  = options.owner;
  this.name   = options.name;
};


/**
 * Get all recent builds
 *
 * @param  {Object|Function}    paramsOrCallback params or callback function
 * @param  {Function|undefined} callback         callback
 *
 * @tested
 */
Builds.prototype.all = function( callback ) {
  if ( this.repoId ) {
    this._getBuildsByRepoId( this.repoId, callback );
  } else if ( this.owner && this.name ) {
    helper.getRepoId( this.host, this.owner, this.name, function( error, id ) {
      if ( error ) {
        callback( error );
      } else {
        this._getBuildsByRepoId( id, callback );
      }
    }.bind( this ) );
  } else {
    callback( {
      code    : 'NOT FOUND',
      message : 'Neither repoId nor name and owner were set. Fetching not possible.'
    } );
  }
};


/**
 * Get one or more builds by given id
 *
 * @param  {String|Array} build one build id or array of build ids
 *
 * @tested
 */
Builds.prototype.get = function( buildIdOrBuilds, callback ) {
  if ( buildIdOrBuilds instanceof Array ) {
    this._getBuildsByIds( buildIdOrBuilds, callback );
  } else {
    this._getBuildById( buildIdOrBuilds, callback )
  }
};


/**
 * get build by calling travis 'builds' endpoint
 * with given id
 *
 * @param  {String}   buildId   travis repo id
 * @param  {Function} callback callback
 *
 * @tested
 */
Builds.prototype._getBuildById = function( buildId, callback ) {
  request.get( {
    headers : {
      Accept : 'application/json; version=2'
    },
    json    : true,
    url     : this.host + 'builds/' + buildId
  }, function( error, res, body ) {
    this._getBuildByIdCallback( error, res, body, callback );
  }.bind( this ) );
};


/**
 * Callback function for Builds._getBuildById
 *
 * @param  {Object|null}   error    error or null
 * @param  {Object}        res      request response object
 * @param  {Object}        body     request response body
 * @param  {Function}      callback callback function
 *
 * @tested
 */
Builds.prototype._getBuildByIdCallback = function( error, res, body, callback ) {
  var response = {};

  if ( error ) {
    callback( error );

    return;
  }

  response[ body.build.id ] = body.build;

  callback( null, response, body.build.id );
};


/**
 * get build by calling travis 'builds' endpoint
 * with given id
 *
 * @param  {String}   buildId   travis repo id
 * @param  {Function} callback callback
 *
 * @tested
 */
Builds.prototype._getBuildsByIds = function( buildIds, callback ) {
  var eventEmitter   = new events.EventEmitter(),
      responseArray = [];

  eventEmitter.on( 'buildFetched', this._sendBuilds );

  buildIds.forEach( function( id ) {
    this._getBuildById( id, function( error, build, buildId ) {
      if ( error ) {
        callback( error );

        return;
      }

      responseArray.push( build[ buildId ] );

      eventEmitter.emit( 'buildFetched', responseArray, buildIds, callback );
    } );
  }.bind( this ) );
};


/**
 * get builds by calling travis 'builds' endpoint
 * directly without any ids
 *
 * @param  {String}   repoId   travis repo id
 * @param  {Function} callback callback
 *
 * @tested
 */
Builds.prototype._getBuildsByRepoId = function( repoId, callback ) {
  request.get( {
    headers : {
      Accept : 'application/json; version=2'
    },
    json    : true,
    qs      : {
      event_type    : 'push',
      repository_id : repoId
    },
    url     : this.host + 'builds'
  }, callback );
};


module.exports = Builds;
