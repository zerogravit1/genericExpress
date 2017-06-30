'use strict';

module.exports = function( grunt ) {
  grunt.initConfig( {
    jscs: {
      default: {
        src: '**/*.js',
        options: {
          config: '.jscs.json'
        }
      }
    },
    jshint: {
      options: {
        jshintrc: true
      },
      all: ['./src/**.js']
    },
    githooks: {
      all: {
        'pre-push': 'jscs jshint'
      }
    }
  } );

  grunt.loadNpmTasks( 'grunt-contrib-jshint' );
  grunt.loadNpmTasks( 'grunt-jscs' );
  grunt.loadNpmTasks( 'grunt-githooks' );
  grunt.registerTask( 'default', ['jshint'] );
};
