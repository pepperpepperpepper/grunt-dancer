'use strict';

var spawn = require('child_process').spawn,
       fs = require('fs'),
   mkdirp = require('mkdirp'),
     path = require('path');

var _currentProcess;
var pid;


module.exports.pid = function(){ return pid };

module.exports.start = function(grunt, options, callback) {
    _currentProcess = grunt.util.spawn({
    cmd:      'perl',
    args:     [options.app_path].concat(options.args),
    env:      process.env,
    fallback: function() { /* Prevent EADDRINUSE from breaking Grunt */ },
    opts: { 
      stdio : 'pipe', 
      detached : true,
    },
  }, function(){ 
      grunt.log.error('Dancer process exited'.red);
      process.exit()
  });
  _currentProcess.stdout.on('data', function(data){
    grunt.log.writeln('Dancer:'.grey + data.toString().grey);
    if(data.toString().match(/.+/)){
      if (! process._watch){
        process.exit();
      } 
    }
  });
  _currentProcess.stderr.on('data', function(data){
    console.log('Dancer Stderr:'.grey + data.toString().grey);
    if(data.toString().match(/listening/)){
      mkdirp(path.dirname(options.pidFile), function (err){
        if(err){ 
          grunt.log.error('Could not create pidfile for dancer:'.red);
          grunt.log.error(err.red);
          _currentProcess.kill();
          process.exit(1);
        }
      });
      fs.writeFile(options.pidFile, _currentProcess.pid, function(err){
        if (err) {
          grunt.log.error('Could not write to pidFile'.red+options.pidFile.red+':'.red);
          grunt.log.error(err.red);
          process.exit(1);
        }
        if (! process._watch){
          callback();
          process.exit();
        } 
      });
    }
  });
};

module.exports.kill = function(grunt, options, callback){
  if(typeof(_currentProcess) !== 'undefined' && typeof(_currentProcess.pid) === 'number') {
      grunt.log.writeln("Sending kill signal to process: ".yellow + _currentProcess.pid.yellow);
      process.kill(_currentProcess.pid, 'SIGKILL');
      _currentProcess = undefined;
      return;
  }
  fs.readFile(options.pidFile, function(err, data){
    if (err){
      grunt.log.error('Could not read '.red + options.pidFile.red);
      process.exit(1);
    }
    grunt.log.writeln("Sending kill signal to process: ".yellow + data.toString().yellow);
    process.kill(parseInt(data), 'SIGKILL');
    fs.unlink(options.pidFile, callback);
  });
};
