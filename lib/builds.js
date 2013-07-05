'use strict';

var request = require( 'request' );


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
    this._getBuildsById( this.repoId, callback );
  } else if ( this.owner && this.name ) {
    this._getBuildsByOwnerAndName( this.owner, this.name, callback );
  } else {
    callback(
      'Neither repoId nor name and owner were set. Fetching not possible.'
    );
  }
};


/**
 * get builds by calling travis 'builds' endpoint directly
 *
 * @param  {String}   repoId   travis repo id
 * @param  {Function} callback callback
 *
 * @tested
 */
Builds.prototype._getBuildsById = function( repoId, callback ) {
  request.get( {
    url : this.host + 'builds',
    qs  : {
      event_type    : 'push',
      repository_id : repoId
    }
  }, callback );
};


/**
 * get builds by calling travis 'search' endpoint first
 * to get the id and then calling travis 'builds' endpoint
 *
 * @param  {String}   owner    owner of the repo
 * @param  {String}   name     name of the repo
 * @param  {Function} callback [description]
 */
Builds.prototype._getBuildsByOwnerAndName = function( owner, name, callback ) {
  request.get( {
    url  : this.host + 'repos',
    qs   : {
      search : this.owner + '/' + this.name
    },
    json : true
  }, function( error, response, body ) {
    if ( error ) {
      callback( error );
    }

    // set fetched id to use it later
    this.repoId = body[ 0 ].id;

    if ( this.repoId ) {
      this._getBuildsById( this.repoId, callback );
    } else {
      callback(
        'Search responded no id'
      );
    }
  }.bind( this ) );
}


module.exports = Builds;
