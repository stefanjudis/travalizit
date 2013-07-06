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

  if ( options && ( options.repoId || ( options.owner && options.name ) ) ) {
    return new Builds( options );
  } else {
    return false;
  }
};


/**
 * Constructore function to get a new jobs object
 *
 * @param  {String|Array} options Array of build numbers or
 *                                String with build number
 *
 * @return {Object}               jobs object or false if options
 *                                were not set correctly
 */
module.exports.Jobs = function( options ) {
  var Jobs = require( './jobs' );

  if ( options && ( options.repoId || ( options.owner && options.name ) ) ) {
    return new Jobs( options );
  } else {
    console.log('joooo false');
    return false;
  }
};
