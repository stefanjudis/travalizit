/*
 * Travalizit
 * https://github.com/stefanjudis/travalizit
 *
 * Copyright (c) 2013 stefan judis
 * Licensed under the MIT license.
 */

'use strict';

var builds  = require( './builds' ),
    events  = require( 'events' ),
    helper  = require( './helper' ),
    request = require( 'request' );


var Jobs = function( options ) {
  this.host   = options.host || 'https://api.travis-ci.org/';
  this.repoId = options.repoId;
  this.owner  = options.owner;
  this.name   = options.name;
};


/**
 * Get jobs for particular build(s)
 *
 * @param  {Array|String}        jobsOrType    array of job id's or
 *                                             'builds' to show that there is
 *                                             input of build id's comin'
 *
 * @param  {Array|Function}      buildsOrCallback array of build id's or
 *                                             callback function
 *
 * @param  {Function|undefined}  callback      callback function or undefined
 *
 * Examples
 *   -> get jobs for particular builds
 *     jobs.get( 'builds', [ '123456', '234567'], function() {} )
 *
 *   -> get job with given id
 *     jobs.get( '123456', function() {} )
 *
 *   -> get jobs with given id
 *     jobs.get( [ '123456', '234567' ], function() {} )
 */
Jobs.prototype.get = function( jobsOrType, buildsOrCallback, callback ) {
  if ( this.repoId ) {
    this._get( jobsOrType, buildsOrCallback, callback );
  } else {
    helper.getRepoId(
      this.host,
      this.owner,
      this.name,
      function( error, repoId ) {
        if ( error ) {
          callback( error );
        } else {
          // cache it for later
          this.repoId = repoId;

          this._get( jobsOrType, buildsOrCallback, callback );
        }
      }.bind( this )
    );
  }
};


/**
 * "Real" get function when repoId is definetely available
 *
 * @param  {Array|String}       jobsOrType       [description]
 * @param  {Array|Function}     buildsOrCallback [description]
 * @param  {Function|undefined} callback         [description]
 *
 * @tested
 */
Jobs.prototype._get = function( jobsOrType, buildsOrCallback, callback ) {
  if ( jobsOrType instanceof Array ) {
    this._getJobsById( jobsOrType, buildsOrCallback );
  } else if ( jobsOrType === 'builds' ) {
    this._getJobsByBuildId( buildsOrCallback, callback );
  } else {
    this._getJobsById( jobsOrType, buildsOrCallback );
  }
};


/**
 * [ description]
 * @param  {[type]}   repoId   [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
Jobs.prototype._getJobsByBuildId = function( buildIds, callback ) {
  // alles cool
  new builds( {
    repoId : this.repoId
  } ).get( buildIds, function( error, responseBuilds ) {
    var eventEmitter = new events.EventEmitter(),
        buildsArray  = [];

    eventEmitter.on( 'buildFetched', this._sendBuilds );

    if ( error ) {
      callback( error );
    }

    responseBuilds.forEach( function( build ) {
      this._getJobsById( build.job_ids, function( error, jobs ) {
        if ( error ) {
          callback( error );
        }

        var buildObject = {};

        buildObject[ build.id ] = {
          number : build.number,
          jobs   : jobs
        };

        buildsArray.push( buildObject );

        eventEmitter.emit(
          'buildFetched',
          buildsArray,
          responseBuilds,
          callback
        );
      } );
    }.bind( this ) );
  }.bind( this ) );
};


/**
 * Fetch job data with a given id
 *
 * @param  {String}   id       id
 * @param  {Function} callback callback
 *
 * @tested
 */
Jobs.prototype._getJobById = function( id, callback ) {
  request.get( {
    headers : {
      Accept : 'application/json; version=2'
    },
    json    : true,
    url     : this.host + 'jobs/' + id
  }, callback );
};


Jobs.prototype._getJobsById = function( idOrArrayOfIds, callback ) {
  var eventEmitter  = new events.EventEmitter(),
      jobsArray     = [],
      jobs;

  if ( idOrArrayOfIds instanceof Array === true ) {
    jobs = idOrArrayOfIds;
  } else {
    jobs = [ idOrArrayOfIds ];
  }

  eventEmitter.on( 'jobFetched', this._sendJobs );

  jobs.forEach( function( job ) {
    this._getJobById( job, function( error, res, body ) {
      jobsArray.push( body.job );

      eventEmitter.emit( 'jobFetched', jobsArray, jobs, callback );

    } );
  }.bind( this ) );
};


Jobs.prototype._sendBuilds = function( buildsResponse, builds, callback ) {
  if ( buildsResponse.length === builds.length ) {
    callback( null, buildsResponse );
  }
}


Jobs.prototype._sendJobs = function( jobsArray, jobs, callback ) {
  if ( jobsArray.length === jobs.length ) {
    callback( null, jobsArray );
  }
};


module.exports = Jobs;
