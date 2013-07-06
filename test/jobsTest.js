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
  }
};
