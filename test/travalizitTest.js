'use strict';

module.exports = {
  setUp: function( callback ) {
    this.travalizit = require( '../lib/travalizit' );

    callback();
  },


  tearDown : function( callback ) {
    console.log = this._console;

    callback();
  },


  init : function( test ) {
    var t = this.travalizit;

    test.strictEqual( typeof t, 'object' );

    test.done();
  },


  builds : function( test  ) {
    var t = this.travalizit,
        repos = t.Builds( {
      repoId : '123456'
    } );

    test.strictEqual( repos instanceof require( '../lib/builds' ), true );
    test.done();
  },
};
