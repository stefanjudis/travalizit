'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON( 'package.json' ),


    jshint : {
      all : [
        'Gruntfile.js',
        'lib/**/*.js',
        'assets/js/collections/*.js',
        'assets/js/config/*.js',
        'assets/js/models/*.js',
        'assets/js/views/**/*.js',
        'test/**/*.js'
      ],
      options : {
        jshintrc : '.jshintrc'
      }
    },


    nodeunit: {
      all: ['test/**/*Test.js']
    },


    watch : {
      gruntfile : {
        files   : 'Gruntfile.js',
        tasks   : [ 'jshint:gruntfile' ],
        options : {
          nocase : true
        }
      },
      src : {
        files : [ 'lib/**/*', 'test/**/*.js', 'Gruntfile.js' ],
        tasks : [ 'default' ]
      }
    }
  });


  grunt.loadNpmTasks( 'grunt-contrib-jshint' );
  grunt.loadNpmTasks( 'grunt-contrib-watch' );
  grunt.loadNpmTasks( 'grunt-contrib-nodeunit' );

  // Default task.
  grunt.registerTask( 'default', [ 'jshint', 'test' ]);
};
