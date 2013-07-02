'use strict';

var Builds = require( './builds' );

/**
 * Constructor to create the Travalizit object
 *
 * @param  {Object} options options
 *
 * valid options are:
 * {
 *   host : 'http://something.com'
 * }
 *
 * @tested
 */
var Travalizit = function( options ) {
  options = options || {};
  this.host = options.host || 'https://api.travis-ci.org/';
};


/**
 * Get all set options of travalizit
 *
 * @return {Object} Object with all set options
 *
 * @tested
 */
Travalizit.prototype.getOptions = function() {
  return {
    host : this.host
  };
};


/**
 * Create a new builds obejct
 *
 * @param  {String} repoId repository id
 * @return {Builds}        repos object
 *
 * @tested
 */
Travalizit.prototype.builds = function( repoId ) {
  return new Builds( {
    host   : this.host,
    repoId : repoId
  } );
}

module.exports = Travalizit;
