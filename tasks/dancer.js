'use strict';

module.exports = function(grunt) {

  var spawn = require('child_process').spawn,
      dancer = require('../lib/dancer'),
      _currentProcess;

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerTask('dancer', 'Control your dancer server via Grunt', function(command) {

    command = command || 'start';
    //defaults
    var options = this.options({
      pidFile : "/tmp/dancerServer.pid",
      args : [],
      app_path : 'bin/app.pl', 
    });

    switch(command) {
      case 'start':
        dancer.start(options);
        break;
      case 'restart':
        if(typeof(_currentProcess) !== 'undefined') {

          _currentProcess.on('close', function() {
            _currentProcess = spawn('perl', [options.app_path].concat(options.args), {
              stdio: 'inherit'
            });
          });

          _currentProcess.kill('SIGQUIT');
        } else {
          if(grunt.file.exists(options.pidFile)) {
            var killArgs = ['-s', 'QUIT', grunt.file.read(options.pidFile)];
            var killTask = spawn('kill', killArgs, {
//              stdio: 'ignore'
            });

          }
          dancer.start(options);
        }
        break;
      case 'kill':
        dancer.kill(options);
        break;
    }

  });

};
