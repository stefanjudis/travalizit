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

  host = options.host || 'https://api.travis-ci.org/';

  this.host   = host + 'builds';
  this.repoId = options.repoId || '';
};


/**
 * Get all recent builds
 *
 * @param  {Object|Function}    paramsOrCallback params or callback function
 * @param  {Function|undefined} callback         callback
 *
 * @tested
 */
Builds.prototype.all = function( paramsOrCallback, callback ) {
  callback = callback || paramsOrCallback;

  request.get( {
    url : this.host,
    qs  : {
      event_type    : 'push',
      repository_id : this.repoId
    }
  }, callback );
};

module.exports = Builds;
