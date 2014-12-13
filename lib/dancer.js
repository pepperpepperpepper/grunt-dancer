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
  //see if pid file exists
  fs.readFile(options.pidFile, function(err, data){
    //see if dancer is running
    if(data){
      var _pid = data.toString();
      if (! _pid){
        grunt.log.error('Dancer pid file '.red+options.pidFile.red+'exists in filesystem, but is empty.\n');
        grunt.log.error('Please remove '.red+options.pidFile.red+' to continue.'.red);
        process.exit(1);
      }
      var retries = RETRIES;
      (function recursiveSync(){
        try{
          if(process.kill(_pid, 0)){
            grunt.log.error('Dancer appears to be running already. Try killing it with:'.red);
            grunt.log.error('grunt dancer:kill'.yellow);
            process.exit(1);
          }
          retries--;
          if (options.debug){ grunt.log.error('Checking if dancer service is already running'.yellow); }
          setTimeout(recursiveSync, DELAY);
        }
        catch(err){
          grunt.log.error('Dancer pid file exists in filesystem.'.red);
          grunt.log.error('Please remove '.red+options.pidFile.red+' to continue.'.red);
          process.exit(1);
        }
      })();
      grunt.log.error('Unable to tell if process'.red+pid.red+' is running. Try killing it manually and restarting.'.red);
      return process.exit(1);
    }
    else if (err.code === 'ENOENT'){
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
            //probably remove
            if (! (process._watch || process._test)){
              return callback();
    //          process.exit();
            } 
            callback();
          });
        }
      });
    }else{
      grunt.error.log('Problem accessing dancer pid file '.red+options.pidFile.red+'.');
      grunt.error.log('Error: '.red+error.code.red);
      process.exit(1);
    }
  })
};
module.exports.kill = function(grunt, options, callback){
  fs.readFile(options.pidFile, function(err, data){
    if (err || data === 'undefined'){
      grunt.log.error('Could not read '.red + options.pidFile.red);
      grunt.log.error('If dancer is running, please kill it manually.'.red);
      process.exit(1);
    }
    var pid = data.toString();// otherwise it's a buffer
    if(options.debug) { grunt.log.error("Sending kill signal to process: ".yellow + pid.yellow)};
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
        fs.unlink(options.pidFile, function(){ 
          callback() 
        });
      }
    })();
  });
};
