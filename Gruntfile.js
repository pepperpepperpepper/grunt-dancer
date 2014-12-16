'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js'
//        '<%= mochaTest.src %>',
      ],
      options: {
        jshintrc: '.jshintrc',
      },
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp'],
    },

    // Configuration to be run (and then tested).
    dancer: {
      options: {
        app_path : 'test/bin/app.pl',
        debug : true,
        args : []
      },
    },
    watch: {
      dancer: {
        options: {
          spawn : false,
        },
        files: [
          'test/bin/app.pl'
        ],
        tasks: ['dancer']
      }
    },

    // Unit tests.
    mochaTest: {
      test: {
        reporter: 'spec',
      },
      src: ['test/dancer_spec.js'],
    },

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-mocha-test');

  // By default, lint and run all tests.
  grunt.registerTask('test-watch', ['dancer', 'watch']);
  
  grunt.registerTask('default', ['dancer', 'watch']);

};
