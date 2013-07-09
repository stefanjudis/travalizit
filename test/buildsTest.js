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


  getBuildById : function( test ) {
    var builds = this.travalizit.Builds( {
        repoId : '123456',
        host   : 'http://abc.de/'
      } ),
        callback = function() {},
        get      = this.request;

    this.request.get = function() {
      test.strictEqual( arguments.length, 2 );

      test.strictEqual( typeof arguments[ 0 ], 'object' );
      test.strictEqual( arguments[ 0 ].url, 'http://abc.de/builds/123456' );
      test.strictEqual( arguments[ 0 ].json, true );

      test.strictEqual( arguments[ 1 ].length, 3 );

      test.done();
    };

    builds._getBuildById( '123456', callback );

    this.request.get = get;
  },


  getBuildByIdCallback : {
    errorAppeared : function( test ) {
      var builds = this.travalizit.Builds( {
          repoId : '123456',
          host   : 'http://abc.de/'
        } ),
          callback = function() {
            test.strictEqual( arguments.length, 1 );

            test.strictEqual( arguments[ 0 ], error );

            test.done();
          },
          error = {
            code    : 'SOME ERROR',
            message : 'some error appeared'
          }

      builds._getBuildByIdCallback( error, null, null, callback );
    },
    noErrorAppeared : {
      responseBodyWasDefinedAndIncludedBuild : function( test ) {
        var builds = this.travalizit.Builds( {
            repoId : '123456',
            host   : 'http://abc.de/'
          } ),
            callback = function() {
              test.strictEqual( arguments.length, 3 );

              test.strictEqual( arguments[ 0 ], null );

              test.strictEqual( typeof arguments[ 1 ], 'object' );
              test.strictEqual( Object.keys( arguments[ 1 ] ).length, 1 );
              test.strictEqual( arguments[ 1 ][ '123456' ].id, '123456' );
              test.strictEqual( arguments[ 1 ][ '123456' ].someData, 'someData' );

              test.strictEqual( arguments[ 2 ], '123456' );

              test.done();
            };

        builds._getBuildByIdCallback(
          null,
          {},
          {
            build : {
              id       : '123456',
              someData : 'someData'
            }
          },
          callback
        );
      },
      responseBodyWasDefinedButNoIncludedBuild : function( test ) {
        var builds = this.travalizit.Builds( {
            repoId : '123456',
            host   : 'http://abc.de/'
          } ),
            callback = function() {
              test.strictEqual( arguments.length, 3 );

              test.strictEqual( arguments[ 0 ], null );

              test.strictEqual( typeof arguments[ 1 ], 'object' );
              test.strictEqual( Object.keys( arguments[ 1 ] ).length, 0 );

              test.strictEqual( arguments[ 2 ], undefined );

              test.done();
            };

        builds._getBuildByIdCallback(
          null,
          {},
          {},
          callback
        );
      }
    }
  },


  getBuildsByIds : function( test ) {
    var builds = this.travalizit.Builds( {
      repoId : '123456',
      host   : 'http://abc.de/'
    } ),
        buildIds     = [ '123456', '234567' ],
        callback     = function() {},
        count        = 0,
        getBuildById = builds._getBuildById;

    builds._getBuildById = function() {
      test.strictEqual( arguments.length, 2 );

      test.strictEqual( arguments[ 0 ], buildIds[ count ] );

      test.strictEqual( arguments[ 1 ].length, 2 );

      count++;

      if ( count === buildIds.length ) {
        test.done();
      }
    };

    builds._getBuildsByIds( buildIds, callback );

    builds._getBuildById = getBuildById;
  },


  getBuildsByIdLoopCallback : {
    errorAppeared : function( test ) {
      var builds = this.travalizit.Builds( {
        repoId : '123456',
        host   : 'http://abc.de/'
      } ),
          callback = function() {
            test.strictEqual( arguments.length, 1 );

            test.strictEqual( arguments[ 0 ], error );

            test.done();
          },
          error    = {
        code    : 'SOME CODE',
        message : 'some message'
      };

      builds._getBuildsByIdsLoopCallback(
        error,
        null,
        null,
        null,
        null,
        callback
      );
    },
    noErrorAppeared : function( test ) {
      var builds = this.travalizit.Builds( {
        repoId : '123456',
        host   : 'http://abc.de/'
      } ),
          callback      = function() {},
          eventEmitter  = {
        emit : function() {
          test.strictEqual( arguments.length, 4 );

          test.strictEqual( arguments[ 0 ], 'buildFetched' );

          test.strictEqual( arguments[ 1 ] instanceof Array, true );
          test.strictEqual( arguments[ 1 ].length, 1 );
          test.strictEqual( arguments[ 1 ][ 0 ].someData, 'someData' );

          test.strictEqual( arguments[ 2 ], '123456' );

          test.strictEqual( arguments[ 3 ], callback );

          test.done();
        }
      },
          responseArray = [];

      builds._getBuildsByIdsLoopCallback(
        null,
        {
          123456 : {
            someData : 'someData'
          }
        },
        '123456',
        responseArray,
        eventEmitter,
        callback
      );
    }
  },


  getBuildsByRepoId : function( test ) {
    var builds = this.travalizit.Builds( {
      repoId : '123456',
      host   : 'http://abc.de/'
    } ),
        callback = function() {},
        get      = this.request.get;

    this.request.get = function() {
      test.strictEqual( arguments.length, 2 );

      test.strictEqual( typeof arguments[ 0 ], 'object' );
      test.strictEqual( arguments[ 0 ].json, true );
      test.strictEqual( arguments[ 0 ].qs.event_type, 'push' );
      test.strictEqual( arguments[ 0 ].qs.repository_id, '123456' );
      test.strictEqual( arguments[ 0 ].url, 'http://abc.de/builds' );

      test.strictEqual( arguments[ 1 ], callback );

      test.done();
    };

    builds._getBuildsByRepoId( '123456', callback );

    this.request.get = get;
  },


  sendBuilds : {
    allBuildsAreFetched : function( test ) {
      var builds = this.travalizit.Builds( {
        repoId : '123456',
        host   : 'http://abc.de/'
      } ),
          buildIds = [ '123456', '234567' ],
          callback = function() {
            test.strictEqual( arguments.length, 2 );

            test.strictEqual( arguments[ 0 ], null );

            test.strictEqual( arguments[ 1 ], responseArray );

            test.done();
          },
          responseArray = [ 'something', 'somethingElse' ];

      builds._sendBuilds( responseArray, buildIds, callback );
    }
  }
};
