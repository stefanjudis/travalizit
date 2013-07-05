'use strict';

module.exports = {
  setUp : function( callback ) {
    this.travalizit = require( '../lib/travalizit' );
    this.request    = require( 'request' );

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
          getBuildsById = builds._getBuildsById;

      builds._getBuildsById = function() {
        test.strictEqual( arguments.length, 2 );
        test.strictEqual( arguments[ 0 ], '510697' );
        test.strictEqual( arguments[ 1 ], callback );

        test.done();
      };

      builds.all( callback );

      builds._getBuildsById = getBuildsById;
    },
    ownerAndNameAreDefined : function( test ) {
      var builds = this.travalizit.Builds( {
        owner : 'stefanjudis',
        name  : 'travalizit'
      } ),
          callback                = function() {},
          getBuildsByOwnerAndName = builds._getBuildsByOwnerAndName;

      builds._getBuildsByOwnerAndName = function() {
        test.strictEqual( arguments.length, 3 );
        test.strictEqual( arguments[ 0 ], 'stefanjudis' );
        test.strictEqual( arguments[ 1 ], 'travalizit' );
        test.strictEqual( arguments[ 2 ], callback );

        test.done();
      };

      builds.all( callback );

      builds._getBuildsByOwnerAndName = getBuildsByOwnerAndName;
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

    builds._getBuildsById( '123456', callback );

    this.request.get = get;
  },


  getBuildsByOwnerAndName : {
    errorInRequest : function( test ) {
      var builds = this.travalizit.Builds( {
          owner : 'stefanjudis',
          name  : 'travalizit',
          host  : 'http://abc.de/'
        } ),
          callback = function() {
          test.strictEqual( arguments.length, 1 );
          test.strictEqual( arguments[ 0 ], 'error' );

          test.done();
        },
          get      = this.request;

      this.request.get = function() {
        test.strictEqual( arguments.length, 2 );

        test.strictEqual( typeof arguments[ 0 ], 'object' );
        test.strictEqual( arguments[ 0 ].url, 'http://abc.de/repos' );
        test.strictEqual( arguments[ 0 ].qs.search, 'stefanjudis/travalizit' );

        callback( 'error' );
      };

      builds._getBuildsByOwnerAndName( 'stefanjudis', 'travalizit', callback );

      this.request.get = get;
    },
    noErrorInRequest : {
      idFound : function( test ) {
        var builds = this.travalizit.Builds( {
            owner : 'stefanjudis',
            name  : 'travalizit',
            host  : 'http://abc.de/'
          } ),
            callback          = function() {},
            get               = this.request,
            makeBuildsRequest = builds._makeBuildsRequest;

        this.request.get = function() {
          test.strictEqual( arguments.length, 2 );

          test.strictEqual( typeof arguments[ 0 ], 'object' );
          test.strictEqual( arguments[ 0 ].url, 'http://abc.de/repos' );
          test.strictEqual( arguments[ 0 ].qs.search, 'stefanjudis/travalizit' );

          test.strictEqual( typeof arguments[ 1 ], 'function' );

          arguments[ 1 ]( null, {}, [ { id: '123456' } ] );
        };

        builds._makeBuildsRequest = function() {
          test.strictEqual( arguments.length, 2 );

          test.strictEqual( arguments[ 0 ], '123456' );
          test.strictEqual( arguments[ 1 ], callback );

          test.done();
        };

        builds._getBuildsByOwnerAndName( 'stefanjudis', 'travalizit', callback );

        this.request.get = get;
        builds._makeBuildsRequest = makeBuildsRequest;
      },
      noIdFound : function( test ) {
        var builds = this.travalizit.Builds( {
            owner : 'stefanjudis',
            name  : 'travalizit',
            host  : 'http://abc.de/'
          } ),
            callback          = function() {
              test.strictEqual( arguments.length, 1 );
              test.strictEqual( arguments[ 0 ], 'Search responded no id' );

              test.done();
            },
            get               = this.request;

        this.request.get = function() {
          test.strictEqual( arguments.length, 2 );

          test.strictEqual( typeof arguments[ 0 ], 'object' );
          test.strictEqual( arguments[ 0 ].url, 'http://abc.de/repos' );
          test.strictEqual( arguments[ 0 ].qs.search, 'stefanjudis/travalizit' );

          test.strictEqual( typeof arguments[ 1 ], 'function' );

          arguments[ 1 ]( null, {}, [ {} ] );
        };

        builds._getBuildsByOwnerAndName( 'stefanjudis', 'travalizit', callback );

        this.request.get = get;
      }
    }
  }
};
