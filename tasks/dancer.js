'use strict';

module.exports = function(grunt) {

  var spawn = require('child_process').spawn,
      dancer = require('../lib/dancer');

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerTask('dancer', 'Control your dancer server via Grunt', function(command) {

    command = command || 'start';

    var args = [];
    var opts = this.options();
    opts.pidFile = opts.pidFile || "/tmp/dancerServer.pid";

    switch(command) {
      case 'serve':
        dancer.serve(args, opts);
        break;
      case 'start':
        dancer.start(args, opts);
        break;
      case 'restart':
        if(_currentProcess) {

          _currentProcess.on('close', function() {
            _currentProcess = spawn(args, {
              stdio: 'inherit'
            });
          });

          _currentProcess.kill('SIGQUIT');
        } else {
          if(grunt.file.exists(_pidFile)) {
            var killArgs = ['-s', 'QUIT', grunt.file.read(_pidFile)];
            var killTask = spawn('kill', killArgs, {
              stdio: 'ignore'
            });

            // args.unshift('server');
            _currentProcess = spawn(args, {
              stdio: ['ignore', process.stdout, 'ignore']
            });
          }
        }
        break;
      case 'kill':
        dancer.kill(args, opts);
        break;
    }

  });

};
