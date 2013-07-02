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


  constructor : function(test) {
    var t = new this.Travalizit();

    test.strictEqual( typeof t, 'object' );
    test.strictEqual( typeof t.getOptions, 'function' );

    test.done();
  },


  builds : function( test  ) {
    var t = new this.Travalizit(),
        repos = t.builds( '123456' );

    test.strictEqual( repos instanceof require( '../lib/builds' ), true );
    test.done();
  },


  getOptions : {
    defaultOptionsSet: function( test ) {
      var t = new this.Travalizit(),
          options = t.getOptions();

      test.strictEqual( typeof options, 'object' );
      test.strictEqual( Object.keys( options ).length, 1 );
      test.strictEqual( options.host, 'https://api.travis-ci.org/' );

      test.done();
    },
    newOptionsSet: function( test ) {
      var t = new this.Travalizit( { host : 'abc.def.gh' } ),
          options = t.getOptions();

      test.strictEqual( typeof options, 'object' );
      test.strictEqual( Object.keys( options ).length, 1 );
      test.strictEqual( options.host, 'abc.def.gh' );

      test.done();
    }
  }
};
