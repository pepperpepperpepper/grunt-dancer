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
        grunt.log.error(('Dancer pid file ' + options.pidFile + 'exists in filesystem, but is empty.').red);
        grunt.log.error(('Please remove ' + options.pidFile + ' to continue.').red);
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
          grunt.log.error(('Please remove '+options.pidFile+' to continue.').red);
          process.exit(1);
        }
      })();
      grunt.log.error(('Unable to tell if process' + pid + ' is running. Try killing it manually and restarting.').red);
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
          callback();
      });
      _currentProcess.stdout.on('data', function(data){
        grunt.log.writeln(('Dancer:' + data.toString()).grey);
        if(data.toString().match(/.+/)){
          if (! process._dancer_session){
            process.exit();
          } 
        }
      });
      _currentProcess.stderr.on('data', function(data){
        grunt.log.writeln(('Dancer Stderr:' + data.toString()).grey);
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
              grunt.log.error(('Could not write to pidFile'+options.pidFile+':').red);
              grunt.log.error(err.red);
              process.exit(1);
            }
            //probably remove
            if (! process._dancer_session){
              return callback();
            } 
            callback();
          });
        }
      });
    }else{
      grunt.error.log(('Problem accessing dancer pid file '+options.pidFile+'.').red);
      grunt.error.log(('Error: '+error.code).red);
      process.exit(1);
    }
  })
};

module.exports.kill = function(grunt, options, callback){
  function _syncKill(pid, callback){
    if(options.debug) { grunt.log.error(('Sending kill signal to process: ' + pid).yellow)};
    process.kill(pid, 'SIGKILL');
    var retries = RETRIES;
    (function recursiveSync(){
      try{
         if(process.kill(pid, 0)){
           if (! retries){
             grunt.log.error(('Unable to kill process ' + pid + ' between starts. Trying increasing delay length?').red);
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
  }

  if (typeof(_currentProcess) !== 'undefined' && typeof(_currentProcess.pid) === 'number'){
    return _syncKill(_currentProcess.pid, callback)
  };
  fs.readFile(options.pidFile, function(err, data){
    if (err || data === 'undefined'){
      grunt.log.error('Could not read '.red + options.pidFile.red);
      grunt.log.error('If dancer is running, please kill it manually.'.red);
      process.exit(1);
    }
    _syncKill(data.toString(), callback);// otherwise it's a buffer
  });
};
