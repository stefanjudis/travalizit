/*
 * Travalizit
 * https://github.com/stefanjudis/travalizit
 *
 * Copyright (c) 2013 stefan judis
 * Licensed under the MIT license.
 */

'use strict';

/**
 * Constructor function to get a new builds object
 *
 * @param  {Object}       options options
 *
 * @return {Object|false}         builds object or false if options
 *                                were not set correctly
 *
 * @tested
 */
module.exports.Builds = function( options ) {
  var Builds = require( './builds' );

  if ( options && (options.repoId || ( options.owner && options.name ) ) ) {
    return new Builds( options );
  } else {
    return false;
  }
};
