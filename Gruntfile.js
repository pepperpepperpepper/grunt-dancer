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
        tasks: ['dancer:watch']
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

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'dancer:start', 'dancer:kill', 'mochaTest']);

  // By default, lint and run all tests.
  
  grunt.registerTask('default', ['dancer:start', 'watch']);

};
