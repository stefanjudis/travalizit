'use strict';

module.exports = {
  setUp : function( callback ) {
    this.helper  = require( '../lib/helper' );
    this.request = require( 'request' );

    callback();
  },


  tearDown : function( callback ) {
    callback();
  },


  getRepoId : {
    errorAppeared : function( test ) {
      var get      = this.request.get,
          callback = function() {};

      this.request.get = function() {
        test.strictEqual( arguments.length, 2 );

        test.strictEqual( arguments[ 0 ].json, true );
        test.strictEqual( typeof arguments[ 0 ].qs, 'object' );
        test.strictEqual( arguments[ 0 ].qs.search, 'someOwner/someName' );
        test.strictEqual( arguments[ 0 ].url, 'someHost/repos' );

        test.strictEqual( arguments[ 1 ].length, 3 );

        test.done();
      };

      this.helper.getRepoId( 'someHost/', 'someOwner', 'someName', callback );

      this.request.get = get;
    }
  },


  getRepoIdCallback : {
    errorAppeared : function( test ) {
      var callback = function() {
        test.strictEqual( arguments.length, 1 );
        test.strictEqual( arguments[ 0 ], error );
        test.done();
      },
          error = {
        someError : 'someError'
      };

      this.helper._getRepoIdCallback( error, null, null, callback );
    },
    noErrorAppeared : {
      repoIdIsDefined : function( test ) {
        var callback = function() {
          test.strictEqual( arguments.length, 2 );

          test.strictEqual( arguments[ 0 ], null );

          test.strictEqual( arguments[ 1 ], 'someId' );

          test.done();
        },
            body = [ {
          id : 'someId'
        } ];

        this.helper._getRepoIdCallback( null, null, body, callback );
      },

      repoIdIsUndefined : function( test ) {
        var callback = function() {
          test.strictEqual( arguments.length, 1 );

          test.strictEqual( arguments[ 0 ].code, 'NOT FOUND' );
          test.strictEqual( arguments[ 0 ].message, 'Search responded no id' );

          test.done();
        },
            body = [ {} ];

        this.helper._getRepoIdCallback( null, null, body, callback );
      }
    }
  }
};
