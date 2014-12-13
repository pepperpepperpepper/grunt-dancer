'use strict';

var spawn = require('child_process').spawn,
       fs = require('fs'),
   mkdirp = require('mkdirp'),
     path = require('path');

var DELAY = 1000;
var RETRIES = 3

var _currentProcess;
var pid;

module.exports.start = function(grunt, options, callback) {
    console.log('calling start');
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
      if (! process._watch){
          console.log('no process watch');
//        fs.unlink(options.pidFile, function(err){
//          grunt.log.error("Could not remove ".red + options.pidFile.red);
//        });
      }
      callback();
  });
  _currentProcess.stdout.on('data', function(data){
    grunt.log.writeln('Dancer:'.grey + data.toString().grey);
    if(data.toString().match(/.+/)){
      if (! (process._watch || process._test)){
        process.exit();
      } 
    }
  });
  _currentProcess.stderr.on('data', function(data){
    grunt.log.writeln('Dancer Stderr:'.grey + data.toString().grey);
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
        if (! (process._watch || process._test)){
          console.log("calling callback");
          return callback();
//          process.exit();
        } 
        console.log("calling callback return");
        callback();
      });
    }
  });
};
module.exports.kill = function(grunt, options, callback){
  fs.readFile(options.pidFile, function(err, data){
    var pid = data.toString();// otherwise it's a buffer
    if (err || pid === 'undefined'){
      grunt.log.error('Could not read '.red + options.pidFile.red);
      process.exit(1);
    }
    grunt.log.writeln("Sending kill signal to process: ".yellow + pid.yellow);
    process.kill(pid, 'SIGKILL');
    var retries = RETRIES;
    (function recursiveSync(){
      try{
         if(process.kill(pid, 0)){
           if (! retries){
             grunt.log.error('Unable to kill process '+pid+' between starts. Trying increasing delay length?'.red);
             callback();
           }
           retries--;
           if (options.debug){ grunt.log.error('Checking if dancer server was killed successfully'.yellow); }
           setTimeout(recursiveSync, DELAY);
         }
      }
      catch(err){
        _currentProcess = undefined;
        console.log("calling the damn callback");
        fs.unlink(options.pidFile, function(){ 
          callback() 
        });
      }
    })();
  });
};
