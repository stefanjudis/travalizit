'use strict';

module.exports = {
  setUp : function( callback ) {
    this.helper     = require( '../lib/helper' );
    this.request    = require( 'request' );
    this.travalizit = require( '../lib/travalizit' );

    callback();
  },


  tearDown : function( callback ) {
    callback();
  },


  get : {
    repoIdIsDefined : function( test ) {
      var jobs = new this.travalizit.Jobs( {
        repoId : '123456'
      } ),
          buildsOrCallback = [ '123456', '234567' ],
          callback         = function() {},
          get              = jobs._get,
          jobsOrType       = 'builds';

      jobs._get = function() {
        test.strictEqual( arguments.length, 3 );

        test.strictEqual( arguments[ 0 ], jobsOrType );

        test.strictEqual( arguments[ 1 ], buildsOrCallback );

        test.strictEqual( arguments[ 2 ], callback );

        test.done();
      }
      jobs.get( jobsOrType, buildsOrCallback, callback );

      jobs._get = get;
    },
    repoIdIsUndefined : function( test ) {
      var jobs = new this.travalizit.Jobs( {
        owner : 'stefanjudis',
        name  : 'travalizit'
      } ),
          buildsOrCallback = [ '123456', '234567' ],
          callback         = function() {},
          getRepoId        = this.helper.getRepoId,
          jobsOrType       = 'builds';

      this.helper.getRepoId = function() {
        test.strictEqual( arguments.length, 4 );

        test.strictEqual( arguments[ 0 ], 'https://api.travis-ci.org/' );

        test.strictEqual( arguments[ 1 ], 'stefanjudis' );

        test.strictEqual( arguments[ 2 ], 'travalizit' );

        test.strictEqual( typeof arguments[ 3 ], 'function' );
        test.strictEqual( arguments[ 3 ].length, 2 );

        test.done()
      };

      jobs.get( jobsOrType, buildsOrCallback, callback );

      this.helper.getRepoId = getRepoId;
    }
  },


  getExecutive : {
    jobsOrTypeIsAnArray : function( test ) {
      var jobs = new this.travalizit.Jobs( {
        repoId : '123456'
      } ),
          buildsOrCallback = function() {},
          getJobsById      = jobs._getJobsById,
          jobsOrType       = [ '123456', '234567' ];

      jobs._getJobsById = function() {
        test.strictEqual( arguments.length, 2 );

        test.strictEqual( arguments[ 0 ], jobsOrType );

        test.strictEqual( arguments[ 1 ], buildsOrCallback );

        test.done();
      };

      jobs._get( jobsOrType, buildsOrCallback );

      jobs._getJobsById = getJobsById;
    },
    jobsOrTypeIsAString : {
      stringIsBuild : function( test ) {
        var jobs = new this.travalizit.Jobs( {
          repoId : '123456'
        } ),
            buildsOrCallback = [ '123456', '234567' ],
            getJobsByBuildId = jobs._getJobsByBuildId,
            jobsOrType       = 'builds',
            callback         = function() {};

        jobs._getJobsByBuildId = function() {
          test.strictEqual( arguments.length, 2 );

          test.strictEqual( arguments[ 0 ], buildsOrCallback );

          test.strictEqual( arguments[ 1 ], callback );

          test.done();
        };

        jobs.get( jobsOrType, buildsOrCallback, callback );

        jobs._getJobsByBuildId = getJobsByBuildId;
      },
      stringIsId : function( test ) {
        var jobs = new this.travalizit.Jobs( {
          repoId : '123456'
        } ),
            buildsOrCallback = function() {},
            getJobsById      = jobs._getJobsById,
            jobsOrType       = '123456';

        jobs._getJobsById = function() {
          test.strictEqual( arguments.length, 2 );

          test.strictEqual( arguments[ 0 ], '123456' );

          test.strictEqual( arguments[ 1 ], buildsOrCallback );

          test.done();
        };

        jobs.get( jobsOrType, buildsOrCallback );

        jobs._getJobsById = getJobsById;
      }
    }
  },


  getJobById : function( test ) {
    var jobs = new this.travalizit.Jobs( {
      repoId : '123456'
    } ),
        callback = function() {},
        get      = this.request.get;

    this.request.get = function() {
      test.strictEqual( arguments.length, 2 );

      test.strictEqual( typeof arguments[ 0 ], 'object' );
      test.strictEqual( arguments[ 0 ].json, true );
      test.strictEqual(
        arguments[ 0 ].url, 'https://api.travis-ci.org/jobs/123456'
      );

      test.strictEqual( arguments[ 1 ], callback );

      test.done();
    }

    jobs._getJobById( '123456', callback );

    this.request.get = get;
  }
};
