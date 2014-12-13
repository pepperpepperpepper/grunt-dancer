'use strict';

module.exports = function(grunt) {

  var spawn = require('child_process').spawn,
      dancer = require('../lib/dancer'),
      _currentProcess;

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks
  var noop = function(){};
  grunt.registerTask('dancer', 'Control your dancer server via Grunt', function(command) {

    command = command || 'start';
    //defaults
    var options = this.options({
      pidFile : "/tmp/dancerServer.pid",
      args : [],
      app_path : 'bin/app.pl', 
      stderr : 'true',
      stdout : 'true'
    });

    grunt.event.once('watch',function(){
      process._watch = true;
    });

    options.stderr = options.stderr ? function(s) { grunt.log.error(s.red); } : noop;
    options.stdout = options.stdout ? function(s) { grunt.log.error(s.red); } : noop;
    
    switch(command) {
      case 'start':
        var done = this.async();
        if(process._watch){
          grunt.log.writeln("starting from watch".grey);
        } 
        dancer.start(grunt, options, done);
        break;
      case 'kill':
        var done = this.async();
        dancer.kill(grunt, options, done);
        break;
    }

  });

};
