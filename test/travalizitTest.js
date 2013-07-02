'use strict';

module.exports = {
  setUp: function( callback ) {
    this.Travalizit = require( '../lib/travalizit' );

    callback();
  },


  tearDown : function( callback ) {
    console.log = this._console;

    callback();
  },


  constructor : function( test ) {
    var t = this.Travalizit;

    test.strictEqual( typeof t, 'object' );

    test.done();
  },


  builds : function( test  ) {
    var t = this.Travalizit,
        repos = new t.builds( '123456' );

    test.strictEqual( repos instanceof require( '../lib/builds' ), true );
    test.done();
  },
};
