'use strict';

/**
 * Constructor to create the Travalizit object
 *
 * @param  {Object} options options
 *
 * valid options are:
 * {
 *   host: 'http://something.com'
 * }
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


module.exports = Travalizit;
