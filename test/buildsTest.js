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


  constructor : function( test ) {
    var builds = new this.travalizit.Builds();

    test.strictEqual( typeof builds, 'object' );

    test.done();
  },

  all : {
    repoIsDefined : function( test ) {
      var builds = new this.travalizit.Builds( {
        repoId : '510697'
      } ),
          request = this.request,
          callback = function( error, request, response ) {
            console.log( error );
            console.log( response );
          };

      this.request.get = function() {
        test.strictEqual( arguments.length, 2);

        test.strictEqual( typeof arguments[ 0 ], 'object' );
        test.strictEqual( arguments[ 0 ].qs.repository_id, '510697' );
        test.strictEqual( arguments[ 0 ].qs.event_type, 'push' );

        test.strictEqual( typeof arguments[ 1 ], 'function' );
        test.strictEqual( arguments[ 1 ], callback );

        test.done();
      };

      builds.all( callback )

      this.request = request;
    },
    repoIsUndefined : function( test ) {
      var builds = new this.travalizit.Builds( {
        repoId : ''
      } ),
          request = this.request,
          callback = function( error, request, response ) {
            console.log( error );
            console.log( response );
          };

      this.request.get = function() {
        test.strictEqual( arguments.length, 2);

        test.strictEqual( typeof arguments[ 0 ], 'object' );
        test.strictEqual( arguments[ 0 ].qs.repository_id, '' );
        test.strictEqual( arguments[ 0 ].qs.event_type, 'push' );

        test.strictEqual( typeof arguments[ 1 ], 'function' );
        test.strictEqual( arguments[ 1 ], callback );

        test.done();
      };

      builds.all( callback )

      this.request = request;
    }
  }
};
