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
    helper.getRepoId( this.host, this.owner, this.name, function( error, id ) {
      if ( error ) {
        callback( error );
      } else {
        this._getBuildsById( id, callback );
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
 * get builds by calling travis 'builds' endpoint directly
 *
 * @param  {String}   repoId   travis repo id
 * @param  {Function} callback callback
 *
 * @tested
 */
Builds.prototype._getBuildsById = function( repoId, callback ) {
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
