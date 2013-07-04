'use strict';

/**
 * Constructor function to get a new builds object
 *
 * @param  {Object} options options
 *
 * @tested
 */
module.exports.Builds = function( options ) {
  var Builds = require( './builds' );

  return new Builds( options );
};
