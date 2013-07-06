'use strict';

module.exports = {
  setUp : function( callback ) {
    this.travalizit = require( '../lib/travalizit' );
    this.request    = require( 'request' );
    this.helper     = require( '../lib/helper' );

    callback();
  },


  tearDown : function( callback ) {
    callback();
  },


  all : {
    repoIdIsDefined : function( test ) {
      var builds = new this.travalizit.Builds( {
        repoId : '510697'
      } ),
          callback      = function() {},
          getBuildsById = builds._getBuildsByRepoId;

      builds._getBuildsByRepoId = function() {
        test.strictEqual( arguments.length, 2 );
        test.strictEqual( arguments[ 0 ], '510697' );
        test.strictEqual( arguments[ 1 ], callback );

        test.done();
      };

      builds.all( callback );

      builds._getBuildsByRepoId = getBuildsById;
    },
    ownerAndNameAreDefined : function( test ) {
      var builds = this.travalizit.Builds( {
        owner : 'stefanjudis',
        name  : 'travalizit'
      } ),
          callback  = function() {},
          getRepoId = this.helper.getRepoId;

      this.helper.getRepoId = function() {
        test.strictEqual( arguments.length, 4 );

        test.strictEqual( arguments[ 0 ], 'https://api.travis-ci.org/' );

        test.strictEqual( arguments[ 1 ], 'stefanjudis' );

        test.strictEqual( arguments[ 2 ], 'travalizit' );

        test.strictEqual( typeof arguments[ 3 ], 'function' );
        test.strictEqual( arguments[ 3 ].length, 2 );

        test.done();
      };

      builds.all( callback );

      this.helper.getRepoId = getRepoId;
    }
  },


  get : {
    inputIsId : function( test ) {
      var builds = this.travalizit.Builds( {
        repoId : '123456',
        host   : 'http://abc.de/'
      } ),
          callback      = function() {},
          getBuildById = builds._getBuildById;

      builds._getBuildById = function() {
        test.strictEqual( arguments.length, 2 );

        test.strictEqual( arguments[ 0 ], '12345' );

        test.strictEqual( arguments[ 1 ], callback );
        test.done();
      };

      builds.get( '12345', callback );

      builds._getBuildById = getBuildById;
    },
    inputIsArrayOfIds : function( test ) {
      var builds = this.travalizit.Builds( {
        repoId : '123456',
        host   : 'http://abc.de/'
      } ),
          callback       = function() {},
          getBuildsByIds = builds._getBuildsByIds,
          buildIds       = [ '12345', '23456' ];

      builds._getBuildsByIds = function() {
        test.strictEqual( arguments.length, 2 );

        test.strictEqual( arguments[ 0 ], buildIds );

        test.strictEqual( arguments[ 1 ], callback );
        test.done();
      };

      builds.get( buildIds, callback );

      builds._getBuildsByIds = getBuildsByIds;
    }
  },


  getBuildsById : function( test ) {
    var builds = this.travalizit.Builds( {
        repoId : '123456',
        host   : 'http://abc.de/'
      } ),
        callback = function() {},
        get      = this.request;

    this.request.get = function() {
      test.strictEqual( arguments.length, 2 );

      test.strictEqual( typeof arguments[ 0 ], 'object' );
      test.strictEqual( arguments[ 0 ].url, 'http://abc.de/builds' );
      test.strictEqual( arguments[ 0 ].qs.event_type, 'push' );
      test.strictEqual( arguments[ 0 ].qs.repository_id, '123456' );

      test.strictEqual( arguments[ 1 ], callback );

      test.done();
    };

    builds._getBuildsByRepoId( '123456', callback );

    this.request.get = get;
  }
};
